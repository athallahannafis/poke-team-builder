import { PokemonCompiled, TypeInfo } from "../types/Pokemon";

const MAX_TEAM_SIZE = 6;
const MAX_SERIALIZED_TEAM_LENGTH = 50_000;
const MAX_TYPES_PER_POKEMON = 2;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isAllowedTypeUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.origin === "https://pokeapi.co" &&
      url.pathname.startsWith("/api/v2/type/") &&
      url.username === "" &&
      url.password === "" &&
      url.port === "" &&
      url.search === "" &&
      url.hash === ""
    );
  } catch {
    return false;
  }
};

const isAllowedSprite = (value: string): boolean => {
  if (value === "") return true;

  try {
    const url = new URL(value);
    return (
      url.origin === "https://raw.githubusercontent.com" &&
      url.pathname.startsWith("/PokeAPI/sprites/") &&
      url.username === "" &&
      url.password === "" &&
      url.port === "" &&
      url.search === "" &&
      url.hash === ""
    );
  } catch {
    return false;
  }
};

const parseTypeInfo = (value: unknown): TypeInfo | null => {
  if (!isRecord(value) || !isRecord(value.type)) return null;

  const { slot } = value;
  const { name, url } = value.type;
  if (
    typeof slot !== "number" ||
    !Number.isSafeInteger(slot) ||
    slot < 1 ||
    typeof name !== "string" ||
    !/^[a-z0-9-]{1,64}$/.test(name) ||
    typeof url !== "string" ||
    !isAllowedTypeUrl(url)
  ) {
    return null;
  }

  return { slot, type: { name, url } };
};

export const parsePokemonCompiled = (value: unknown): PokemonCompiled | null => {
  if (!isRecord(value) || !Array.isArray(value.types)) return null;

  const { name, sprite, exp, chosen } = value;
  if (
    typeof name !== "string" ||
    !/^[a-z0-9-]{1,64}$/.test(name) ||
    typeof sprite !== "string" ||
    sprite.length > 2048 ||
    !isAllowedSprite(sprite) ||
    typeof exp !== "number" ||
    !Number.isSafeInteger(exp) ||
    exp < 0 ||
    typeof chosen !== "boolean" ||
    value.types.length > MAX_TYPES_PER_POKEMON
  ) {
    return null;
  }

  const types: TypeInfo[] = [];
  for (const typeValue of value.types) {
    const type = parseTypeInfo(typeValue);
    if (!type) return null;
    types.push(type);
  }

  return {
    name,
    sprite,
    types,
    exp,
    chosen,
  };
};

export const parseStoredPokemonTeam = (serialized: string): PokemonCompiled[] | null => {
  if (serialized.length > MAX_SERIALIZED_TEAM_LENGTH) return null;

  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    return null;
  }

  if (!Array.isArray(value) || value.length > MAX_TEAM_SIZE) return null;

  const team: PokemonCompiled[] = [];
  for (const pokemonValue of value) {
    const pokemon = parsePokemonCompiled(pokemonValue);
    if (!pokemon) return null;
    team.push({ ...pokemon, chosen: true });
  }

  return team;
};
