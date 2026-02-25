import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Subtle CRT scanline overlay across the entire viewport */
export function Scanline() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return <div className="scanline-overlay" aria-hidden="true" />;
}
