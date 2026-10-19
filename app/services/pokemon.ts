import { Pokemon, PokemonCompiled, PokemonStats, PokemonType } from "../types/Pokemon";
import { emptyUrlApi, api } from "./api";

type PokemonTypeResponse = {
    pokemon: Array<{
        pokemon: Pokemon;
    }>;
};

const getlistOfPokemon = async (
    limit: number,
    offset: number,
    type: PokemonType | "all" = "all",
) => {
    let results: Pokemon[];

    if (type === "all") {
        const res = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
        if (res.status !== 200) {
            throw new Error("Failed to fetch pokemon list");
        }

        const data: { results: Pokemon[] } = res.data;
        results = data.results;
    } else {
        const typeCache = new Map<PokemonType, Pokemon[]>();
        let typeResults = typeCache.get(type);
        if (!typeResults) {
            const res = await api.get(`/type/${type}`);
            if (res.status !== 200) {
                throw new Error("Failed to fetch pokemon by type");
            }

            const data: PokemonTypeResponse = res.data;
            typeResults = data.pokemon.map(({ pokemon }) => pokemon);
            typeCache.set(type, typeResults);
        }
        results = typeResults.slice(offset, offset + limit);
    }

    const compiledList: PokemonCompiled[] = await Promise.all(results.map(async(item) => {
        const statsResponse = await emptyUrlApi.get(item.url);
        if (statsResponse.status !== 200) {
            throw new Error("Failed to fetch pokemon stats");
        }
        const statsData: PokemonStats = {
            sprite: statsResponse.data.sprites.front_default ?? "",
            types: statsResponse.data.types ?? [],
            exp: statsResponse.data.base_experience ?? 0,
        };
        
        return {
            name: item.name,
            sprite: statsData.sprite ?? "",
            types: statsData.types ?? [],
            exp: statsData.exp ?? 0,
            chosen: false,
        };
    }));

    return compiledList;
}

export {  getlistOfPokemon };
