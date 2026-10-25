import { Pokemon, PokemonCompiled, PokemonStats, PokemonType } from "../types/Pokemon";
import { emptyUrlApi, api } from "./api";

type PokemonTypeResponse = {
    pokemon: Array<{
        pokemon: Pokemon;
    }>;
};

const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;
const MAX_OFFSET = 100_000;

const normalizeLimit = (limit: number): number => {
    if (!Number.isSafeInteger(limit)) return DEFAULT_LIMIT;
    return Math.min(MAX_LIMIT, Math.max(1, limit));
};

const normalizeOffset = (offset: number): number => {
    if (!Number.isSafeInteger(offset)) return 0;
    return Math.min(MAX_OFFSET, Math.max(0, offset));
};

const getlistOfPokemon = async (
    limit: number,
    offset: number,
    type: PokemonType | "all" = "all",
) => {
    const safeLimit = normalizeLimit(limit);
    const safeOffset = normalizeOffset(offset);
    let results: Pokemon[];

    if (type === "all") {
        const res = await api.get(`/pokemon?limit=${safeLimit}&offset=${safeOffset}`);        if (res.status !== 200) {
            throw new Error("Failed to fetch pokemon list");
        }

        const data: { results: Pokemon[] } = res.data;
        results = data.results;
    } else {
        const res = await api.get(`/type/${type}`);
        if (res.status !== 200) {
            throw new Error("Failed to fetch pokemon by type");
        }

        const data: PokemonTypeResponse = res.data;
        results = data.pokemon
            .slice(0, limit)
            .map(({ pokemon }) => pokemon);
    }

    const compiledList: PokemonCompiled[] = await Promise.all(results.map(async (item) => {
        const statsResponse = await emptyUrlApi.get(item.url);
        if (statsResponse.status !== 200) {
            throw new Error("Failed to fetch pokemon stats");
        }
        const data = statsResponse.data;
        return {
            name: item.name,
            sprite: data.sprites?.front_default ?? "",
            types: data.types ?? [],
            exp: typeof data.base_experience === "number" ? data.base_experience : 0,
            chosen: false,
        };
    }));

    return compiledList;
}

export {  getlistOfPokemon };
