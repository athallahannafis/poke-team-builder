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
        const res = await api.get(`/type/${type}`);
        if (res.status !== 200) {
            throw new Error("Failed to fetch pokemon by type");
        }

        const data: PokemonTypeResponse = res.data;
        results = data.pokemon
            .slice(offset, offset + limit)
            .map(({ pokemon }) => pokemon);
    }

    const settled = await Promise.allSettled(results.map(async(item) => {
        const statsResponse = await emptyUrlApi.get(item.url);
        if (statsResponse.status !== 200) {
            throw new Error("Failed to fetch pokemon stats");
        }

        const statsData: PokemonStats = statsResponse.data;
        return {
            id: statsData.id,
            name: item.name,
            types: statsData.types,
            image: statsData.sprites.front_default,
            url: item.url,
            chosen: false,
        };
    }));

    const compiledList: PokemonCompiled[] = settled
        .filter((res): res is PromiseFulfilledResult<PokemonCompiled> => res.status === "fulfilled")
        .map((res) => res.value);

    return compiledList;
}

export {  getlistOfPokemon };
