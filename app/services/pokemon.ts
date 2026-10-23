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

    const compiledList: PokemonCompiled[] = await Promise.all(
        results.map(async (item): Promise<PokemonCompiled> => {
            const statsResponse = await emptyUrlApi.get(item.url);
            if (statsResponse.status !== 200) {
                throw new Error("Failed to fetch pokemon stats");
            }

            const data = statsResponse.data;
            return {
                name: item.name,
                sprite: data?.sprites?.front_default ?? "",
                types: data?.types ?? [],
                exp: typeof data?.base_experience === "number" ? data.base_experience : 0,
                chosen: false,
            };
        })
    );

    return compiledList;
}

export {  getlistOfPokemon };
