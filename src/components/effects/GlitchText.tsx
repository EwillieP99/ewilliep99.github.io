import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  /** Trigger glitch on hover */
  hover?: boolean;
  /** Trigger glitch on mount after delay (ms) */
  delay?: number;
}

/**
 * Text with a cyberpunk glitch effect — color-split + position jitter.
 * Uses CSS pseudo-elements for the RGB split and Framer for the shake.
 */
export function GlitchText({ children, className = "", hover = true, delay }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (delay !== undefined) {
      const timer = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onHoverStart={hover ? () => setIsGlitching(true) : undefined}
      onHoverEnd={hover ? () => setIsGlitching(false) : undefined}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        transition: { duration: 0.3, ease: "easeInOut" },
      } : {}}
    >
      {/* Cyan shadow layer */}
      {isGlitching && (
        <span
          className="absolute inset-0 text-neon-cyan opacity-70"
          style={{ clipPath: "inset(20% 0 50% 0)", transform: "translate(-2px, 0)" }}
          aria-hidden
        >
          {children}
        </span>
      )}
      {/* Pink shadow layer */}
      {isGlitching && (
        <span
          className="absolute inset-0 text-neon-pink opacity-70"
          style={{ clipPath: "inset(50% 0 20% 0)", transform: "translate(2px, 0)" }}
          aria-hidden
        >
          {children}
        </span>
      )}
      {/* Main text */}
      <span className="relative">{children}</span>
    </motion.span>
  );
}
