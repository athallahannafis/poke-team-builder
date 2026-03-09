'use client';

import { useState } from "react";
import { usePokemonContext } from "../context/PokemonContext";
import BottomModal from "./BottomModal";
import TeamSheet from "./TeamSheet";

const TEAM_SIZE = 6;

const ButtonFooter = () => {
    const { chosenPokemon } = usePokemonContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <footer className="sticky bottom-0 z-50 w-full bg-white border-t border-zinc-200 px-4 py-3 flex flex-col justify-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 text-white font-bold rounded-lg px-4 py-2 w-full [@media(hover:hover)]:hover:bg-blue-600 active:scale-95 transition-all duration-100"
                >
                    {`View team (${chosenPokemon.length}/${TEAM_SIZE})`}
                </button>
            </footer>
            <BottomModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <TeamSheet />
            </BottomModal>
        </>
    );
};

export default ButtonFooter;
