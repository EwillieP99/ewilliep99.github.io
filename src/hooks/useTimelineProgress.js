import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion.js";

/**
 * Tracks scroll progress through a container element.
 * Returns a ref to attach to the container and a smoothed MotionValue (0→1).
 */
export function useTimelineProgress() {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.65"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return {
    containerRef,
    progress: prefersReduced ? scrollYProgress : smoothProgress,
    scrollYProgress,
  };
}
