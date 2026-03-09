'use client';

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRef, useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const BottomModal = ({ isOpen, onClose, children }: Props) => {
    const startYRef = useRef<number | null>(null);
    const [dragY, setDragY] = useState(0);

    function onTouchStart(e: React.TouchEvent) {
        startYRef.current = e.touches[0].clientY;
        setDragY(0);
    }

    function onTouchMove(e: React.TouchEvent) {
        if (startYRef.current === null) return;
        const delta = e.touches[0].clientY - startYRef.current;
        if (delta > 0) setDragY(delta);
    }

    function onTouchEnd() {
        if (dragY > 100) onClose();
        setDragY(0);
        startYRef.current = null;
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 flex items-end justify-center">
                <DialogPanel
                    transition
                    style={{ transform: `translateY(${dragY}px)`, transition: dragY ? "none" : undefined }}
                    className="w-full max-w-[425px] bg-white rounded-t-2xl px-4 pt-3 pb-8 flex flex-col gap-4
                               transition-transform duration-300 ease-out data-[closed]:translate-y-full"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* drag handle */}
                    <div className="flex justify-center">
                        <div className="w-10 h-1.5 rounded-full bg-zinc-300" />
                    </div>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default BottomModal;
