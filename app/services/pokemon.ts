import { PokemonCompiled } from "../types/Pokemon";
import { api, getPokeApiPokemonPath } from "./api";
import { parsePokemonCompiled } from "../validation/pokemon";

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const getlistOfPokemon = async (limit: number, offset: number) => {
    const safeLimit = normalizeLimit(limit);
    const safeOffset = normalizeOffset(offset);
    const res  = await api.get(`/pokemon?limit=${safeLimit}&offset=${safeOffset}`);
    if (res.status !== 200) {
        throw new Error("Failed to fetch pokemon list");
    }
    const data: unknown = res.data;
    if (!isRecord(data) || !Array.isArray(data.results)) {
        throw new Error("Failed to fetch pokemon list");
    }

    const compiledResults = await Promise.all(data.results.map(async (item): Promise<PokemonCompiled | null> => {
        try {
            if (!isRecord(item) || typeof item.name !== "string" || typeof item.url !== "string") {
                return null;
            }

            const pokemonPath = getPokeApiPokemonPath(item.url);
            const statsResponse = await api.get(pokemonPath);
            if (statsResponse.status !== 200) return null;

            const responseData: unknown = statsResponse.data;
            if (!isRecord(responseData) || !isRecord(responseData.sprites)) return null;

            const baseExperience = responseData.base_experience;
            return parsePokemonCompiled({
                name: item.name,
                sprite: typeof responseData.sprites.front_default === "string"
                    ? responseData.sprites.front_default
                    : "",
                types: responseData.types,
                exp: typeof baseExperience === "number" && Number.isSafeInteger(baseExperience) && baseExperience >= 0
                    ? baseExperience
                    : 0,
                chosen: false,
            });
        } catch {
            return null;
        }
    }));

    const compiledList = compiledResults.filter(
        (pokemon): pokemon is PokemonCompiled => pokemon !== null
    );

    return compiledList;
}

export {  getlistOfPokemon };
