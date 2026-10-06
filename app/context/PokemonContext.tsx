"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getlistOfPokemon } from "../services/pokemon";
import { PokemonCompiled } from "../types/Pokemon";
import { parsePokemonCompiled, parseStoredPokemonTeam } from "../validation/pokemon";

const MAX_TEAM_SIZE = 6;

type TeamAction =
  | { type: "add"; pokemon: PokemonCompiled }
  | { type: "remove"; name: string };

const chosenPokemonReducer = (state: PokemonCompiled[], action: TeamAction): PokemonCompiled[] => {
  if (action.type === "remove") {
    return state.filter((pokemon) => pokemon.name !== action.name);
  }

  const pokemon = parsePokemonCompiled(action.pokemon);
  if (
    !pokemon ||
    state.length >= MAX_TEAM_SIZE ||
    state.some((chosen) => chosen.name === pokemon.name)
  ) {
    return state;
  }

  return [...state, { ...pokemon, chosen: true }];
};

const loadStoredPokemonTeam = (): PokemonCompiled[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem("chosenPokemon");
    return stored ? parseStoredPokemonTeam(stored) ?? [] : [];
  } catch {
    return [];
  }
};

type PokemonContextType = {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  listOfPokemon: PokemonCompiled[];
  setListOfPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
  chosenPokemon: PokemonCompiled[];
  addPokemonToTeam: (pokemon: PokemonCompiled) => void;
  removePokemon: (name: string) => void;
};

const PokemonContext = createContext<PokemonContextType | null>(null);

export function PokemonProvider({ children }: { children: React.ReactNode }) {  
  const [limit, setLimit] = useState<number>(40);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listOfPokemon, setListOfPokemon] = useState<PokemonCompiled[]>([]);
  const [chosenPokemon, dispatchTeam] = useReducer(
    chosenPokemonReducer,
    undefined,
    loadStoredPokemonTeam
  );

  // Keep a ref of chosen names so the fetch effect can read them without re-running.
  // set of pokemon names that are currently chosen, 
  // used to mark pokemon as chosen when fetching new batches without causing re-renders
  const chosenNamesRef = useRef<string[]>(chosenPokemon.map((p) => p.name));

  useEffect(() => {
    chosenNamesRef.current = chosenPokemon.map((p) => p.name);
    setListOfPokemon((list) =>
      list.map((pokemon) => {
        const chosen = chosenNamesRef.current.includes(pokemon.name);
        return pokemon.chosen === chosen ? pokemon : { ...pokemon, chosen };
      })
    );

    try {
      window.localStorage.setItem("chosenPokemon", JSON.stringify(chosenPokemon));
    } catch {
      // The team remains usable for this session if storage is unavailable.
    }
  }, [chosenPokemon]);

  const addPokemonToTeam = useCallback((pokemon: PokemonCompiled) => {
    if (chosenPokemon.length >= MAX_TEAM_SIZE) {
        alert("You can only choose up to 6 pokemon!");
    } else {
      dispatchTeam({ type: "add", pokemon });
    }
  }, [chosenPokemon]);

  useEffect(() => {
    getlistOfPokemon(limit,offset)
      .then((data) =>
        /** 
         * after fetching data, check chosen pokemon (from localstorage)
         * based on set of chosenNamesRef set, and update the chosen flag
         * from listOfPokemon accordingly
         */
        setListOfPokemon(
          data.map((p) => ({ ...p, chosen: chosenNamesRef.current.includes(p.name) }))
        )
      )
      .catch((err) => console.error("Failed to fetch pokemon list:", err))
      .finally(() => setIsLoading(false));
  }, [limit, offset]);

  function removePokemon(name: string) {
    dispatchTeam({ type: "remove", name });
  }

  return (
    <PokemonContext.Provider value={{
      limit,
      setLimit,
      offset,
      setOffset,
      isLoading,
      setIsLoading,
      listOfPokemon,
      setListOfPokemon,
      chosenPokemon,
      addPokemonToTeam,
      removePokemon,
    }}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemonContext() {
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error("usePokemonContext must be used within PokemonProvider");
  return ctx;
}
