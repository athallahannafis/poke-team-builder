'use client';

import Image from "next/image";
import { PokemonCompiled, TypeInfo } from "../types/Pokemon";
import { usePokemonContext } from "../context/PokemonContext";



const PokemonCard = ({ pokemon }: { pokemon: PokemonCompiled }) => {
    const { addPokemonToTeam } = usePokemonContext();
    const { name, sprite, types, exp } = pokemon;   
    return (
        <div className="p-5 h-[300px] w-[200px] flex flex-col items-center justify-between border rounded-lg border-gray-500">
            <div className="flex flex-col items-center gap-2">
                <Image src={sprite} alt={name} width={100} height={100} />
                <h2 className="text-xl font-bold">{name}</h2>
                <p>Types: {types.map((typeInfo: TypeInfo) => typeInfo.type.name).join(", ")}</p>
                <p>Base Experience: {exp}</p>
            </div>
            <button 
            onClick={() => {
                addPokemonToTeam(pokemon);
            }}
            className="bg-gray-300 text-black font-bold rounded-lg px-4 py-2 w-full active:scale-95 transition-transform duration-100">
                Add to Team
            </button>
        </div>
    );
}

export default PokemonCard;