// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Shared Framer Motion variants
// ═══════════════════════════════════════════════════════════════════════════════

import type { Variants, Transition } from "framer-motion";

// Smooth easing curve
const neonEase = [0.22, 1, 0.36, 1] as const;

// Staggered container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

// Fade up item
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: neonEase as unknown as string } as Transition,
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: neonEase as unknown as string } as Transition,
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: neonEase as unknown as string } as Transition,
  },
};

// Scale up reveal
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: neonEase as unknown as string } as Transition,
  },
};

// Glitch entry
export const glitchIn: Variants = {
  hidden: { opacity: 0, x: -10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Navbar slide down
export const navSlideDown: Variants = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: neonEase as unknown as string } as Transition,
  },
};
