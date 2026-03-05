import { useState, useEffect, useRef, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

/** Tracks the mouse position globally, including normalized -1..1 values */
export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({
    x: 0, y: 0, normalizedX: 0, normalizedY: 0,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return pos;
}

/**
 * Ref-based mouse position that writes directly to a DOM element's
 * background gradient, avoiding React re-renders entirely.
 */
export function useMouseGlow(glowColor: string) {
  const ref = useRef<HTMLDivElement>(null);

  const updateGlow = useCallback((e: MouseEvent) => {
    if (ref.current) {
      ref.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, ${glowColor}, transparent 70%)`;
    }
  }, [glowColor]);

  useEffect(() => {
    window.addEventListener("mousemove", updateGlow, { passive: true });
    return () => window.removeEventListener("mousemove", updateGlow);
  }, [updateGlow]);

  return ref;
}
