'use client';

import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";
import { usePokemonContext } from "../context/PokemonContext";
import { PokemonCompiled } from "../types/Pokemon";

const TEAM_SIZE = 6;

const TeamSheet = () => {
    const { chosenPokemon, removePokemon } = usePokemonContext();

    const slots: (PokemonCompiled | null)[] = [
        ...chosenPokemon,
        ...Array(TEAM_SIZE - chosenPokemon.length).fill(null),
    ];

    return (
        <>
            <h2 className="text-lg font-bold text-center">
                Your Team ({chosenPokemon.length}/{TEAM_SIZE})
            </h2>

            <div className="flex flex-col w-full px-3 gap-3">
                {slots.map((pokemon, i) => (
                    <div
                        key={i}
                        className=" flex flex-row items-center justify-between rounded-xl border border-dashed border-zinc-300 bg-zinc-50 relative "
                    >
                        {pokemon ? (
                            <>  
                                <div className="flex items-center gap-4">
                                    <div className="p-1 bg-gray-200 m-3 border border-gray-700">
                                        <Image
                                            src={pokemon.sprite}
                                            alt={pokemon.name}
                                            width={42}
                                            height={42}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-xs font-semibold capitalize text-left leading-tight">
                                        {pokemon.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removePokemon(pokemon.name)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 transition-colors mr-5"
                                    aria-label={`Remove ${pokemon.name}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <span className="w-full text-zinc-300 text-xl h-[76px] flex items-center text-center justify-center">Empty Slot</span>
                        )}
                    </div>
                ))}
                <p className="text-center pt-2 border-t-2 border-gray-700 font-bold">
                    {`Total base exp: ${chosenPokemon.reduce((sum, p) => {
                        return sum + p.exp;
                    }, 0 // starting number for return value
                    )}`}
                </p>
            </div>
        </>
    );
};

export default TeamSheet;
