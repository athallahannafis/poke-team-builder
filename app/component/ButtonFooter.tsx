'use client';

import Image from "next/image";
import { usePokemonContext } from "../context/PokemonContext";
import { PokemonCompiled } from "../types/Pokemon";

const TEAM_SIZE = 6;

const ButtonFooter = () => {
    const { chosenPokemon } = usePokemonContext();

    const slots: (PokemonCompiled | null)[] = [
        ...chosenPokemon,
        ...Array(TEAM_SIZE - chosenPokemon.length).fill(null),
    ];

    return (
        <footer className="sticky bottom-0 z-50 w-full bg-white border-t border-zinc-200 px-4 py-6 flex flex-col justify-center">
            <button className="bg-blue-500 text-white font-bold rounded-lg px-4 py-2 w-full active:scale-95 transition-transform duration-100">
                {`View team (${chosenPokemon.length}/${TEAM_SIZE})`}
            </button>
        </footer>
    );
};

export default ButtonFooter;
