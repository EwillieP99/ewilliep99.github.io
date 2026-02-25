import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

/**
 * Wraps any section in a scroll-triggered fade-up animation.
 * Respects prefers-reduced-motion automatically.
 */
export function AnimatedSection({ children, delay = 0, className = "", id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={prefersReduced ? false : { opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
