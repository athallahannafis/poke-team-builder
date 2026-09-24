import { Pokemon, PokemonCompiled, PokemonStats } from "../types/Pokemon";
import { emptyUrlApi, api } from "./api";

const getlistOfPokemon = async (limit: number, offset: number) => {
    const res  = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    if (res.status !== 200) {
        throw new Error("Failed to fetch pokemon list");
    }
    const data: { results: Pokemon[] } = await res.data;

    const compiledList: PokemonCompiled[] = await Promise.all(data.results.map(async(item) => {
        const parsedUrl = new URL(item.url);
        if (parsedUrl.origin !== "https://pokeapi.co" || !parsedUrl.pathname.startsWith("/api/v2/pokemon/")) {
            throw new Error("URL Pokemon tidak valid atau tidak tepercaya");
        }
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