export type PokemonCompiled = {
    name: string; // from list pokemon
    sprite: string; // data.sprites.front_default
    types: TypeInfo[]; // data.types
    exp: number; // data.base_experience
    chosen: boolean; // whether the pokemon is chosen for the team
}


/** Get from pokemon by id or by name */
export type PokemonStats = {
    sprite: string; // data.sprites.front_default
    types: TypeInfo[]; // data.types
    exp: number; // data.base_experience
}

export type TypeInfo = { // data.types
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export type Pokemon = {
    name: string;
    url: string;
}

export const POKEMON_TYPES = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];
