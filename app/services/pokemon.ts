import { Pokemon, PokemonCompiled, PokemonStats } from "../types/Pokemon";
import { emptyUrlApi, api } from "./api";


// const getPokemonByName = async (name: string) => {
//     const res = await api.get(`/pokemon/${name}`);
//     if (res.status !== 200) {
//         throw new Error("Failed to fetch pokemon");
//     }
//     const data = await res.data;
//     return {
//         name: data.name,
//         imageUrl: data.sprites.front_default,
//         types: data.types.map((typeInfo: any) => typeInfo.type.name),
//     };
// }

const getlistOfPokemon = async (limit: number) => {
    const res  = await api.get(`/pokemon?limit=${limit}`);
    if (res.status !== 200) {
        throw new Error("Failed to fetch pokemon list");
    }
    const data: { results: Pokemon[] } = await res.data;

    const compiledList: PokemonCompiled[] = await Promise.all(data.results.map(async(item) => {
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