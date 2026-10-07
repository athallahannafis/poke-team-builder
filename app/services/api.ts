import axios from "axios";

const POKEAPI_ORIGIN = "https://pokeapi.co";
const POKEAPI_API_PREFIX = "/api/v2";

const api = axios.create({
  baseURL: `${POKEAPI_ORIGIN}${POKEAPI_API_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const getPokeApiPokemonPath = (itemUrl: string): string => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(itemUrl);
  } catch {
    throw new Error("Invalid PokeAPI Pokémon URL");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.origin !== POKEAPI_ORIGIN ||
    parsedUrl.username !== "" ||
    parsedUrl.password !== "" ||
    parsedUrl.port !== "" ||
    !parsedUrl.pathname.startsWith(`${POKEAPI_API_PREFIX}/pokemon/`) ||
    parsedUrl.search !== "" ||
    parsedUrl.hash !== ""
  ) {
    throw new Error("Invalid PokeAPI Pokémon URL");
  }

  return parsedUrl.pathname.slice(POKEAPI_API_PREFIX.length);
};

export { api, getPokeApiPokemonPath };
