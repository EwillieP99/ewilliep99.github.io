import { useRef, useState, type ReactNode, type CSSProperties, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// HOLO CARD — Holographic card with 3D tilt, inner shine sweep, perspective
// border that follows mouse, and content lift with inner neon glow
// ═══════════════════════════════════════════════════════════════════════════════

interface HoloCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string; // e.g. "0, 245, 255" for cyan
  padding?: string;
  /** Disable all hover effects */
  static?: boolean;
}

export function HoloCard({
  children,
  className = "",
  glowColor = "0, 245, 255",
  padding = "p-6",
  static: isStatic = false,
}: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isStatic || prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const handleMouseEnter = () => !isStatic && setIsHovered(true);
  const handleMouseLeave = () => {
    if (isStatic) return;
    setIsHovered(false);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  const rotateX = isHovered ? (mousePos.y - 0.5) * -10 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 10 : 0;

  const cardStyle: CSSProperties = {
    transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "holo-card relative overflow-hidden rounded-xl border border-white/10",
        "bg-white/[0.03] backdrop-blur-xl",
        padding,
        className,
      )}
      style={!prefersReduced ? cardStyle : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={!isStatic ? { y: -4 } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* ── Perspective border glow that follows mouse ───────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(${glowColor}, 0.15),
            transparent 60%
          )`,
        }}
      />

      {/* ── Border highlight that follows cursor ─────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          border: "1px solid transparent",
          backgroundClip: "padding-box",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          background: `radial-gradient(
            300px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(${glowColor}, 0.5),
            rgba(${glowColor}, 0.1) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* ── Shine sweep on hover ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.06 : 0,
          background: `linear-gradient(
            ${105 + (mousePos.x - 0.5) * 30}deg,
            transparent 30%,
            rgba(255, 255, 255, 0.8) 50%,
            transparent 70%
          )`,
        }}
      />

      {/* ── Inner neon glow (bottom edge) ────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-[10%] right-[10%] h-px pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0.15,
          background: `linear-gradient(90deg, transparent, rgba(${glowColor}, 0.8), transparent)`,
          boxShadow: isHovered
            ? `0 0 15px rgba(${glowColor}, 0.3), 0 0 30px rgba(${glowColor}, 0.1)`
            : "none",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
