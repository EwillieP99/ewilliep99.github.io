import { useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// GLITCH CARD — Card wrapper that triggers a glitch effect on hover or
// section enter (random clip-path + color shift)
// ═══════════════════════════════════════════════════════════════════════════════

interface GlitchCardProps {
  children: ReactNode;
  className?: string;
  /** Trigger glitch when card enters viewport */
  triggerOnEnter?: boolean;
  /** Trigger glitch on hover (default: true) */
  triggerOnHover?: boolean;
  /** Glitch intensity: how much clip-path shift (px) */
  intensity?: number;
}

export function GlitchCard({
  children,
  className = "",
  triggerOnEnter = false,
  triggerOnHover = true,
  intensity = 3,
}: GlitchCardProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Trigger glitch on enter
  const shouldGlitchOnEnter = triggerOnEnter && isInView;

  const handleHoverStart = () => {
    if (!triggerOnHover) return;
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  const glitchActive = isGlitching || (shouldGlitchOnEnter && isGlitching);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      onHoverStart={handleHoverStart}
      onViewportEnter={
        triggerOnEnter
          ? () => {
              setIsGlitching(true);
              setTimeout(() => setIsGlitching(false), 300);
            }
          : undefined
      }
    >
      {/* Cyan ghost layer */}
      {glitchActive && (
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-40"
          style={{
            clipPath: `inset(${20 + Math.random() * 30}% 0 ${20 + Math.random() * 30}% 0)`,
            transform: `translate(${-intensity}px, ${Math.random() * 2}px)`,
            filter: "hue-rotate(-30deg) saturate(2)",
          }}
          aria-hidden
        >
          {children}
        </div>
      )}

      {/* Pink ghost layer */}
      {glitchActive && (
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-40"
          style={{
            clipPath: `inset(${40 + Math.random() * 20}% 0 ${10 + Math.random() * 30}% 0)`,
            transform: `translate(${intensity}px, ${-Math.random() * 2}px)`,
            filter: "hue-rotate(30deg) saturate(2)",
          }}
          aria-hidden
        >
          {children}
        </div>
      )}

      {/* Main content */}
      <motion.div
        animate={
          glitchActive
            ? { x: [0, -intensity, intensity, -intensity / 2, intensity / 2, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
