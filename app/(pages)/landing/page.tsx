'use client';

import PokemonCard from "@/app/component/PokemonCard";
import { usePokemonContext } from "@/app/context/PokemonContext";
import { useEffect, useRef } from "react";

const Landing = () => {
    const { listOfPokemon, isLoading, setLimit, setIsLoading } = usePokemonContext();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading) return; // don't observe while loading; cleanup disconnects the previous observer

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                console.log("reached bottom — load more!");
                setIsLoading(true);
                setTimeout(() => {
                    setLimit((prev) => prev + 20);
                }, 1000); // show spinner for 2s before fetching
            }
        });

        if (bottomRef.current) observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [isLoading]);

    return (
        <div className="flex flex-wrap gap-3 py-5 justify-center">

            

            {listOfPokemon.map((pokemon, index) => (
                    <PokemonCard key={`pokemon-${index}`} pokemon={pokemon} />
                ))
            }

            {
                isLoading && (
                <div className="flex items-center justify-center py-20 w-full">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                </div>
                )
            }
            {/* sentinel */}
            <div ref={bottomRef} />
        </div>
    );
};

export default Landing;