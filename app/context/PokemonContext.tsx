"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getlistOfPokemon } from "../services/pokemon";
import { PokemonCompiled } from "../types/Pokemon";

type PokemonContextType = {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  listOfPokemon: PokemonCompiled[];
  chosenPokemon: PokemonCompiled[];
  setChosenPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
  addPokemonToTeam: (pokemon: PokemonCompiled) => void;
};

const PokemonContext = createContext<PokemonContextType | null>(null);

export function PokemonProvider({ children }: { children: React.ReactNode }) {  
  const [limit, setLimit] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listOfPokemon, setListOfPokemon] = useState<PokemonCompiled[]>([]);
  const [chosenPokemon, setChosenPokemon] = useState<PokemonCompiled[]>([]);

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
    getlistOfPokemon(limit)
      .then((data) => setListOfPokemon(data))
      .catch((err) => console.error("Failed to fetch pokemon list:", err))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return (
    <PokemonContext.Provider value={{
      limit,
      setLimit,
      isLoading,
      listOfPokemon,
      chosenPokemon,
      setChosenPokemon,
      addPokemonToTeam,
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
