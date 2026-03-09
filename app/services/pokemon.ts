import api from "./api";


const getPokemon = async (name: string) => {
    const res = await api.get(`/pokemon/${name}`);
    if (res.status !== 200) {
        throw new Error("Failed to fetch pokemon");
    }
    const data = await res.data;
    return {
        name: data.name,
        imageUrl: data.sprites.front_default,
        types: data.types.map((typeInfo: any) => typeInfo.type.name),
    };
}

const getlistOfPokemon = async (limit: number) => {
    const res  = await api.get(`/pokemon?limit=${limit}`);
    if (res.status !== 200) {
        throw new Error("Failed to fetch pokemon list");
    }
    const data = await res.data;
    return data.results.map((pokemon: {name: string, url: string}) => pokemon);
}

export { getPokemon, getlistOfPokemon };