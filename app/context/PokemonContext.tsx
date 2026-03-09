"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getlistOfPokemon } from "../services/pokemon";
import { PokemonCompiled } from "../types/Pokemon";

type PokemonContextType = {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  listOfPokemon: PokemonCompiled[];
  chosenPokemon: PokemonCompiled[];
  setChosenPokemon: React.Dispatch<React.SetStateAction<PokemonCompiled[]>>;
};

const PokemonContext = createContext<PokemonContextType | null>(null);

export function PokemonProvider({ children }: { children: React.ReactNode }) {  
  const [limit, setLimit] = useState<number>(20);

  const [listOfPokemon, setListOfPokemon] = useState<PokemonCompiled[]>([]);

  // list chosen pokemon
  const [chosenPokemon, setChosenPokemon] = useState<PokemonCompiled[]>([]);

  useEffect(() => {
    getlistOfPokemon(limit).then((data) => {
      console.log(data);
      setListOfPokemon(data);
    }).catch((err) => {
      console.error("Failed to fetch pokemon list:", err);
    });
  }, [limit]);

  return (
    <PokemonContext.Provider value={{ 
      limit,
      setLimit,
      listOfPokemon,
      chosenPokemon,
      setChosenPokemon,
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
