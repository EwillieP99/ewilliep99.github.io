import { useReducedMotion } from "@/hooks/useReducedMotion";

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCUIT GRID — Subtle pulsing hex/circuit grid background via CSS
// Pure CSS implementation — no canvas overhead
// ═══════════════════════════════════════════════════════════════════════════════

export function CircuitGrid({ className = "" }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[1] ${className}`}
      aria-hidden="true"
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          opacity: 0.025,
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Intersection dots at grid crossings */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: `radial-gradient(circle, rgba(0, 245, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Diagonal circuit traces (very subtle) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.015,
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(168, 85, 247, 0.4) 49%, rgba(168, 85, 247, 0.4) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(0, 245, 255, 0.3) 49%, rgba(0, 245, 255, 0.3) 51%, transparent 52%)
          `,
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}
