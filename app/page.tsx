'use client';
import Image from "next/image";
import Landing from "./(pages)/landing/page";
import { usePokemonContext } from "./context/PokemonContext";
import TeamFooter from "./component/TeamFooter";
import pokeball from "@/public/pokeball.svg";
import ButtonFooter from "./component/ButtonFooter";

export default function RootContent() {
  const {chosenPokemon} = usePokemonContext();
  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200 px-4 h-14 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight">Pokedex Builder</span>
        <div className="flex flex-row items-center gap-1">
          <Image src={pokeball} alt="Pokeball icon" width={24} height={24}/>
          {chosenPokemon.length}
        </div>
      </nav>
      <Landing/>
      {/* <TeamFooter/> */}
      <ButtonFooter/>
    </>
  );
}
