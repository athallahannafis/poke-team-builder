"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getlistOfPokemon } from "../services/pokemon";
import { PokemonCompiled } from "../types/Pokemon";

type PokemonContextType = {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  listOfPokemon: PokemonCompiled[];
  setListOfPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
  chosenPokemon: PokemonCompiled[];
  setChosenPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
  addPokemonToTeam: (pokemon: PokemonCompiled) => void;
  removePokemon: (name: string) => void;
};

const PokemonContext = createContext<PokemonContextType | null>(null);

export function PokemonProvider({ children }: { children: React.ReactNode }) {  
  const [limit, setLimit] = useState<number>(20);
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

  // Keep a ref of chosen names so the fetch effect can read them without re-running
  const chosenNamesRef = useRef(new Set(chosenPokemon.map((p) => p.name)));

  useEffect(() => {
    chosenNamesRef.current = new Set(chosenPokemon.map((p) => p.name));
    localStorage.setItem("chosenPokemon", JSON.stringify(chosenPokemon));
  }, [chosenPokemon]);

  const addPokemonToTeam = useCallback((pokemon: PokemonCompiled) => {
    setChosenPokemon((prev) => {
      if (prev.length >= 6) {
        alert("You can only choose up to 6 pokemon!");
        return prev;
      }
      setListOfPokemon((list) =>
        list.map((p) => p.name === pokemon.name ? { ...p, chosen: true } : p)
      );
      return [...prev, { ...pokemon, chosen: true }];
    });
  }, []);

  useEffect(() => {
    // setIsLoading(true);
    getlistOfPokemon(limit)
      .then((data) =>
        setListOfPokemon(
          data.map((p) => ({ ...p, chosen: chosenNamesRef.current.has(p.name) }))
        )
      )
      .catch((err) => console.error("Failed to fetch pokemon list:", err))
      .finally(() => setIsLoading(false));
  }, [limit]);

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
      isLoading,
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
