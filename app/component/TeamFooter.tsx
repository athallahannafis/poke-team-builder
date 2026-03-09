'use client';

import Image from "next/image";
import { usePokemonContext } from "../context/PokemonContext";
import { PokemonCompiled } from "../types/Pokemon";

const TEAM_SIZE = 6;

const TeamFooter = () => {
    const { chosenPokemon } = usePokemonContext();

    const slots: (PokemonCompiled | null)[] = [
        ...chosenPokemon,
        ...Array(TEAM_SIZE - chosenPokemon.length).fill(null),
    ];

    return (
        <footer className="sticky bottom-0 z-50 w-full bg-white border-t border-zinc-200 px-4 py-2">
            <div className="flex items-center justify-between gap-1">
                {slots.map((pokemon, i) => (
                    <div
                        key={i}
                        className="flex-1 aspect-square flex items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50"
                    >
                        {pokemon ? (
                            <Image
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-contain p-1"
                                title={pokemon.name}
                            />
                        ) : (
                            <span className="text-zinc-300 text-xl">?</span>
                        )}
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default TeamFooter;
