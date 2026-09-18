'use client';

import { usePokemonContext, PokemonFilter as PokemonFilterValue } from "../context/PokemonContext";
import { POKEMON_TYPES } from "../types/Pokemon";

const formatTypeName = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

const PokemonFilter = () => {
    const { typeFilter, setTypeFilter, setOffset, setIsLoading } = usePokemonContext();

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const nextFilter = event.target.value as PokemonFilterValue;
        setIsLoading(true);
        setTypeFilter(nextFilter);
        setOffset(0);
    }

    return (
        <div className="border-b border-zinc-200 bg-white px-4 py-3">
            <label htmlFor="pokemon-type-filter" className="mb-1 block text-sm font-bold text-zinc-700">
                Filter by element
            </label>
            <select
                id="pokemon-type-filter"
                value={typeFilter}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
                <option value="all">All elements</option>
                {POKEMON_TYPES.map((type) => (
                    <option key={type} value={type}>
                        {formatTypeName(type)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PokemonFilter;
