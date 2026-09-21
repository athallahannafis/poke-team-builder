import { Pokemon, PokemonCompiled, PokemonSort, TypeInfo } from "../types/Pokemon";
import { emptyUrlApi, api } from "./api";

type PokemonListResponse = {
    count: number;
    results: Pokemon[];
};

type PokemonDetailsResponse = {
    sprites: {
        front_default: string | null;
    };
    types: TypeInfo[];
    base_experience: number | null;
};

// PokeAPI returns the collection in Pokédex order and has no sort parameter.
// A collator gives a predictable, case-insensitive alphabetical order and puts
// numbered names in the order users generally expect (for example, porygon2
// before porygon-z).
const pokemonNameCollator = new Intl.Collator("en", {
    sensitivity: "base",
    numeric: true,
});

export function sortPokemonByName(pokemon: Pokemon[]): Pokemon[] {
    return [...pokemon].sort((first, second) => {
        const nameComparison = pokemonNameCollator.compare(first.name, second.name);

        // Keep the comparator deterministic even if two names differ only by
        // case or punctuation ignored by the collator.
        return nameComparison || first.name.localeCompare(second.name);
    });
}

let sortedPokemonCatalog: Promise<Pokemon[]> | null = null;
const pokemonDetailsCache = new Map<string, Promise<PokemonCompiled>>();

async function getSortedPokemonCatalog(): Promise<Pokemon[]> {
    if (sortedPokemonCatalog) return sortedPokemonCatalog;

    sortedPokemonCatalog = (async () => {
        // First get the count, then request the complete lightweight catalog.
        // Details are still fetched only for the visible page below.
        const countResponse = await api.get<PokemonListResponse>("/pokemon?limit=1&offset=0");
        if (countResponse.status !== 200) {
            throw new Error("Failed to fetch pokemon count");
        }

        const { count, results: firstResults } = countResponse.data;
        const catalogResponse = firstResults.length === count
            ? countResponse
            : await api.get<PokemonListResponse>(`/pokemon?limit=${count}&offset=0`);

        if (catalogResponse.status !== 200) {
            throw new Error("Failed to fetch pokemon catalog");
        }

        return sortPokemonByName(catalogResponse.data.results);
    })().catch((error) => {
        // Allow a later render to retry if the catalog request failed.
        sortedPokemonCatalog = null;
        throw error;
    });

    return sortedPokemonCatalog;
}

async function getPokemonDetails(item: Pokemon): Promise<PokemonCompiled> {
    const cachedDetails = pokemonDetailsCache.get(item.url);
    if (cachedDetails) return cachedDetails;

    const detailsPromise = emptyUrlApi.get<PokemonDetailsResponse>(item.url)
        .then((statsResponse) => {
            if (statsResponse.status !== 200) {
                throw new Error(`Failed to fetch pokemon stats for ${item.name}`);
            }

            return {
                name: item.name,
                sprite: statsResponse.data.sprites.front_default ?? "",
                types: statsResponse.data.types ?? [],
                exp: statsResponse.data.base_experience ?? 0,
                chosen: false,
            };
        })
        .catch((error) => {
            // A transient detail failure should not poison the cache forever.
            pokemonDetailsCache.delete(item.url);
            throw error;
        });

    pokemonDetailsCache.set(item.url, detailsPromise);
    return detailsPromise;
}

const getlistOfPokemon = async (
    limit: number,
    offset: number,
    sortBy: PokemonSort = "pokedex",
) => {
    let results: Pokemon[];

    if (sortBy === "name") {
        const catalog = await getSortedPokemonCatalog();
        results = catalog.slice(offset, offset + limit);
    } else {
        const res = await api.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
        if (res.status !== 200) {
            throw new Error("Failed to fetch pokemon list");
        }
        results = res.data.results;
    }

    const compiledList = await Promise.all(results.map(getPokemonDetails));

    return compiledList;
}

export { getlistOfPokemon };
