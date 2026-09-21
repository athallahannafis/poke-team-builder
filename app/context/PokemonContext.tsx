"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getlistOfPokemon } from "../services/pokemon";
import { PokemonCompiled, PokemonSort } from "../types/Pokemon";

type PokemonContextType = {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  sortBy: PokemonSort;
  setSortBy: React.Dispatch<React.SetStateAction<PokemonSort>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  listOfPokemon: PokemonCompiled[];
  setListOfPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
  chosenPokemon: PokemonCompiled[];
  setChosenPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
  addPokemonToTeam: (pokemon: PokemonCompiled) => void;
  removePokemon: (name: string) => void;
};

const PokemonContext = createContext<PokemonContextType | null>(null);

export function PokemonProvider({ children }: { children: React.ReactNode }) {  
  const [limit, setLimit] = useState<number>(40);
  const [offset, setOffset] = useState<number>(0);
  const [sortBy, setSortBy] = useState<PokemonSort>("pokedex");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listOfPokemon, setListOfPokemon] = useState<PokemonCompiled[]>([]);
  const [chosenPokemon, setChosenPokemon] = useState<PokemonCompiled[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("chosenPokemon");
      return stored ? (JSON.parse(stored) as PokemonCompiled[]) : [];
    } catch {
      return [];
    }
  });

  // Keep a ref of chosen names so the fetch effect can read them without re-running.
  // set of pokemon names that are currently chosen, 
  // used to mark pokemon as chosen when fetching new batches without causing re-renders
  const chosenNamesRef = useRef<string[]>(chosenPokemon.map((p) => p.name));

  useEffect(() => {
    // update the ref and localStorage whenever chosenPokemon changes
    chosenNamesRef.current = chosenPokemon.map((p) => p.name);
    localStorage.setItem("chosenPokemon", JSON.stringify(chosenPokemon));
  }, [chosenPokemon]);

  const addPokemonToTeam = useCallback((pokemon: PokemonCompiled) => {
    if (chosenPokemon.length >= 6) {
        alert("You can only choose up to 6 pokemon!");
    } else {
      setChosenPokemon((prev) => {
        // update the existing list of pokemon to mark this one as chosen
        setListOfPokemon((list) =>
          list.map((p) => p.name === pokemon.name ? { ...p, chosen: true } : p)
        );
        // add item to chosen pokemon list
        return [...prev, { ...pokemon, chosen: true }]
      });
    }
  }, [chosenPokemon]);

  useEffect(() => {
    let isCancelled = false;

    getlistOfPokemon(limit, offset, sortBy)
      .then((data) => {
        if (isCancelled) return;

        /** 
         * after fetching data, check chosen pokemon (from localstorage)
         * based on set of chosenNamesRef set, and update the chosen flag
         * from listOfPokemon accordingly
         */
        setListOfPokemon(
          data.map((p) => ({ ...p, chosen: chosenNamesRef.current.includes(p.name) }))
        );
      })
      .catch((err) => console.error("Failed to fetch pokemon list:", err))
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [limit, offset, sortBy]);

  function removePokemon(name: string) {
        setChosenPokemon((prev) => prev.filter((p) => p.name !== name));
        setListOfPokemon((list) =>
            list.map((p) => (p.name === name ? { ...p, chosen: false } : p))
        );
    }

  return (
    <PokemonContext.Provider value={{
      limit,
      setLimit,
      offset,
      setOffset,
      sortBy,
      setSortBy,
      isLoading,
      setIsLoading,
      listOfPokemon,
      setListOfPokemon,
      chosenPokemon,
      setChosenPokemon,
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
