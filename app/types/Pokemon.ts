export type PokemonCompiled = {
    name: string; // from list pokemon
    sprite: string; // data.sprites.front_default
    types: TypeInfo[]; // data.types
    exp: number; // data.base_experience
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