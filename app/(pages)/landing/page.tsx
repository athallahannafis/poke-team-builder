'use client';

import PokemonCard from "@/app/component/PokemonCard";
import { usePokemonContext } from "@/app/context/PokemonContext";
import useLandingHooks from "./hooks";

const Landing = () => {
    const { listOfPokemon, isLoading, offset } = usePokemonContext();
    const { topRef, bottomRef, wasTopLoad, wasBottomLoad} = useLandingHooks();

    return (
        <>
            <div ref={topRef} />
            <div className="flex flex-wrap gap-3 py-5 justify-center">


                {isLoading && wasTopLoad && offset > 0 && (
                    <div className="w-full flex items-center justify-center py-5">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                    </div>
                )}


                {/* Index always between limit from context -> 40 (0-39) */}
                {listOfPokemon.map((pokemon, index) => {
                    return (
                         <div key={`index-${index}`} id={`index-${index}`}>
                            <PokemonCard key={`pokemon-${index}`}  pokemon={pokemon} />
                        </div>
                    )
                })}

                {
                    isLoading && wasBottomLoad && (
                    <div className="flex items-center justify-center py-20 w-full">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                    </div>
                    )
                }
                {/* sentinel */}
            </div>
                <div ref={bottomRef} />
        </>
    );
};

export default Landing;