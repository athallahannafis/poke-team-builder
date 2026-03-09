'use client';

import PokemonCard from "@/app/component/PokemonCard";
import { usePokemonContext } from "@/app/context/PokemonContext";
import { getlistOfPokemon } from "@/app/services/pokemon";
import { useEffect } from "react";

const Landing = () => {

    const { listOfPokemon  } = usePokemonContext();

    useEffect(() => {
        console.log(listOfPokemon);
    }, [listOfPokemon])

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
    )
}

export default Landing;