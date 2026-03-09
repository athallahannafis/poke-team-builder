import Image from "next/image";
import { PokemonCompiled, TypeInfo } from "../types/Pokemon";



const PokemonCard = ({ name, sprite, types, exp }: PokemonCompiled) => {
    return (
        <div className="p-5 h-[300px] w-[200px] flex flex-col items-center gap-5 border rounded-lg border-gray-500">
            <Image src={sprite} alt={name} width={100} height={100} />
            <h2 className="text-xl font-bold">{name}</h2>
            <p>Types: {types.map((typeInfo: TypeInfo) => typeInfo.type.name).join(", ")}</p>
            <p>Base Experience: {exp}</p>
        </div>
    );
}

export default PokemonCard;