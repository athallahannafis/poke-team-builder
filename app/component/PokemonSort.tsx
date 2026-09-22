'use client';

import { usePokemonContext } from "../context/PokemonContext";
import { PokemonSort as PokemonSortValue } from "../types/Pokemon";

const PokemonSort = () => {
    const { sortBy, setSortBy, setOffset, setIsLoading, isLoading } = usePokemonContext();

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const nextSort = event.target.value as PokemonSortValue;
        setIsLoading(true);
        setSortBy(nextSort);
        setOffset(0);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <div className="mx-auto w-full max-w-[425px] border-b border-zinc-200 bg-white px-4 py-3">
            <label htmlFor="pokemon-sort" className="mb-1 block text-sm font-bold text-zinc-700">
                Sort Pokémon
            </label>
            <select
                id="pokemon-sort"
                value={sortBy}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <option value="name">Name (A–Z)</option>
                <option value="pokedex">Pokédex number</option>
            </select>
        </div>
        
    );
};

export default PokemonSort;
