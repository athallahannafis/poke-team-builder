'use client';

import PokemonCard from "@/app/component/PokemonCard";
import { usePokemonContext } from "@/app/context/PokemonContext";

const Landing = () => {
    const { listOfPokemon, isLoading } = usePokemonContext();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-3 py-5 justify-center">
            {listOfPokemon.map((pokemon) => (
                <PokemonCard
                    key={pokemon.name}
                    name={pokemon.name}
                    sprite={pokemon.sprite}
                    types={pokemon.types}
                    exp={pokemon.exp}
                />
            ))}
        </div>
    );
}

export default Landing;