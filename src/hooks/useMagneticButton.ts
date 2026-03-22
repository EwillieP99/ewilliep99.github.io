import { useRef, type RefObject, type MouseEvent } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STRENGTH = 0.22;
const MAX_PX = 8;

const springConfig = { stiffness: 280, damping: 24, mass: 0.55 };

function clampOffset(v: number) {
  return Math.max(-MAX_PX, Math.min(MAX_PX, v * STRENGTH));
}

/**
 * Pointer-relative pull for buttons. Wrapper stays fixed; inner motion node uses x/y.
 */
export function useMagneticButton(): {
  ref: RefObject<HTMLDivElement | null>;
  style: { x: ReturnType<typeof useSpring<number>>; y: ReturnType<typeof useSpring<number>> } | undefined;
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
} {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const relX = useMotionValue(0);
  const relY = useMotionValue(0);

  const xTarget = useTransform(relX, clampOffset);
  const yTarget = useTransform(relY, clampOffset);
  const x = useSpring(xTarget, springConfig);
  const y = useSpring(yTarget, springConfig);

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    relX.set(e.clientX - (rect.left + rect.width / 2));
    relY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const onMouseLeave = () => {
    relX.set(0);
    relY.set(0);
  };

  return {
    ref,
    style: prefersReduced ? undefined : { x, y },
    onMouseMove,
    onMouseLeave,
  };
}
