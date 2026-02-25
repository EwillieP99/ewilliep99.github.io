import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Custom neon cursor that follows the mouse with a trailing glow.
 * Hidden on mobile/touch devices and when reduced motion is preferred.
 */
export function NeonCursor() {
  const prefersReduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;

    // Only show on devices with fine pointer (no touch)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    setVisible(true);

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMove, { passive: true });

    // Detect hover on interactive elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, input, textarea, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    document.querySelectorAll("a, button, input, textarea, [role='button']").forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      observer.disconnect();
    };
  }, [prefersReduced]);

  if (!visible) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        animate={{
          x: pos.x - 16,
          y: pos.y - 16,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        style={{
          background: "radial-gradient(circle, rgba(0,245,255,0.15), transparent 70%)",
          border: "1px solid rgba(0,245,255,0.2)",
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] bg-neon-cyan"
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.3 }}
        style={{ boxShadow: "0 0 8px rgba(0,245,255,0.8)" }}
      />
    </>
  );
}
