'use client';

import Image from "next/image";
import { usePokemonContext } from "../context/PokemonContext";
import { PokemonCompiled } from "../types/Pokemon";

const TEAM_SIZE = 6;

const TeamSheet = () => {
    const { chosenPokemon, setChosenPokemon, setListOfPokemon, removePokemon } = usePokemonContext();

    const slots: (PokemonCompiled | null)[] = [
        ...chosenPokemon,
        ...Array(TEAM_SIZE - chosenPokemon.length).fill(null),
    ];

    return (
        <>
            <h2 className="text-lg font-bold text-center">
                Your Team ({chosenPokemon.length}/{TEAM_SIZE})
            </h2>

            <div className="grid grid-cols-3 gap-3">
                {slots.map((pokemon, i) => (
                    <div
                        key={i}
                        className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 relative"
                    >
                        {pokemon ? (
                            <>
                                <Image
                                    src={pokemon.sprite}
                                    alt={pokemon.name}
                                    width={72}
                                    height={72}
                                    className="object-contain"
                                />
                                <span className="text-xs font-semibold capitalize text-center leading-tight">
                                    {pokemon.name}
                                </span>
                                <button
                                    onClick={() => removePokemon(pokemon.name)}
                                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-xs font-bold leading-none [@media(hover:hover)]:hover:bg-red-200 transition-colors"
                                    aria-label={`Remove ${pokemon.name}`}
                                >
                                    ×
                                </button>
                            </>
                        ) : (
                            <span className="text-zinc-300 text-2xl">?</span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default TeamSheet;
