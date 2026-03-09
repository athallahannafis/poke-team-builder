import { usePokemonContext } from "@/app/context/PokemonContext";
import { useEffect, useRef } from "react";

export default function useLandingHooks() {
    const PAGE_STEP = 20;
    const { isLoading, setOffset, offset, setIsLoading } = usePokemonContext();
        const bottomRef = useRef<HTMLDivElement>(null);
        const topRef = useRef<HTMLDivElement>(null);
        const wasTopLoad = useRef(false);
        const wasBottomLoad = useRef(false);
        // Bottom observer — slide window forward by one page
        useEffect(() => {
            if (isLoading) return;
    
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setIsLoading(true);
                    setTimeout(() => {
                        wasBottomLoad.current = true;
                        setOffset((prev) => prev + PAGE_STEP);
                    }, 1000);
                }
            });
    
            if (bottomRef.current) observer.observe(bottomRef.current);
            return () => observer.disconnect();
        }, [isLoading, setIsLoading, setOffset]);
    
        // Top observer — slide window backward by one page (only when not already at the start)
        useEffect(() => {
            if (isLoading) return;
            if (offset === 0) return;
    
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setIsLoading(true);
                    setTimeout(() => {
                        wasTopLoad.current = true;
                        setOffset((prev) => Math.max(0, prev - PAGE_STEP));
                    }, 1000);
                }
            });
    
            if (topRef.current) observer.observe(topRef.current);
            return () => observer.disconnect();
        }, [isLoading, offset, setIsLoading, setOffset]);
    
        // After a top-triggered load finishes, scroll to the middle of the rendered list
        useEffect(() => {
            if (isLoading || !wasTopLoad.current) return;
            wasTopLoad.current = false;
            document.getElementById(`index-${21}`)
                ?.scrollIntoView({ behavior: 'instant', block: 'center' });
        }, [isLoading]);

        // After a bottom-triggered load finishes, scroll to the middle of the rendered list
        useEffect(() => {
            if (isLoading || !wasBottomLoad.current) return;
            wasBottomLoad.current = false;
            document.getElementById(`index-${19}`)
                ?.scrollIntoView({ behavior: 'instant', block: 'center' });
        }, [isLoading, setIsLoading]);

        return { topRef, bottomRef, wasBottomLoad, wasTopLoad };
}