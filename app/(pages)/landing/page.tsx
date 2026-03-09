'use client';

import { getlistOfPokemon } from "@/app/services/pokemon";
import { useEffect } from "react";

const Landing = () => {

    useEffect(() => {
        getlistOfPokemon(10).then(pokemonList => {
            console.log(pokemonList);
        }).catch(err => {
            console.error(err);
        });
    }, [])

    return (
        <div>
            Landing page
        </div>
    )
}

export default Landing;