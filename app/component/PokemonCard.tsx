'use client';

import Image from "next/image";
import { PokemonCompiled, TypeInfo } from "../types/Pokemon";
import { usePokemonContext } from "../context/PokemonContext";



const PokemonCard = ({ pokemon }: { pokemon: PokemonCompiled }) => {
    const { addPokemonToTeam } = usePokemonContext();
    const { name, sprite, types } = pokemon;   
    return (
        <div className="p-5 h-[300px] w-[200px] flex flex-col items-center justify-between border rounded-lg border-gray-500">
            <div className="flex flex-col items-center gap-2">
                <Image src={sprite} alt={name} width={110} height={110} />
                <h2 className="text-xl font-bold">{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
                {/* <p>
                    Types: {types.map((typeInfo: TypeInfo) => typeInfo.type.name).join(", ")}

                </p> */}
                <div className="flex flex-row items-center justify-center gap-3 w-full">
                    {
                        types.map((item: TypeInfo,index : number) => {
                            return (
                                <div key={index}
                                className="rounded-full px-2 font-bold border border-gray-500"
                                >
                                    <p>{item.type.name.charAt(0).toUpperCase() + item.type.name.slice(1)}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button
                onClick={() => addPokemonToTeam(pokemon)}
                disabled={pokemon.chosen}
                className="font-bold rounded-lg px-4 py-2 w-full transition-all duration-100 disabled:opacity-50 active:not-disabled:scale-95 bg-gray-300 text-black"
            >
                {pokemon.chosen ? "Added" : "Add to Team"}
            </button>
        </div>
    );
}

export default PokemonCard;