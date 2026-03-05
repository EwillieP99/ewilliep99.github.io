import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ═══════════════════════════════════════════════════════════════════════════════
// NEON CURSOR — Custom neon crosshair cursor with mode changes
// Modes: default (crosshair), "select" (interactive elements), "hack" (cards)
// ═══════════════════════════════════════════════════════════════════════════════

type CursorMode = "default" | "select" | "hack";

export function NeonCursor() {
  const prefersReduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  const handleEnterInteractive = useCallback(() => setMode("select"), []);
  const handleEnterCard = useCallback(() => setMode("hack"), []);
  const handleLeave = useCallback(() => setMode("default"), []);

  useEffect(() => {
    if (prefersReduced) return;

    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    setVisible(true);

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    // Bind interactive element listeners
    const bindListeners = () => {
      // Buttons, links, inputs → "select" mode
      document.querySelectorAll("a, button, input, textarea, select, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterInteractive);
        el.addEventListener("mouseleave", handleLeave);
        (el as HTMLElement).style.cursor = "none";
      });

      // Cards and hoverable containers → "hack" mode
      document.querySelectorAll(".holo-card, .glass-card, [data-cursor='hack']").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterCard);
        el.addEventListener("mouseleave", handleLeave);
        (el as HTMLElement).style.cursor = "none";
      });
    };

    bindListeners();

    const observer = new MutationObserver(bindListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      observer.disconnect();
      document.documentElement.style.cursor = "";
    };
  }, [prefersReduced, handleEnterInteractive, handleEnterCard, handleLeave]);

  if (!visible) return null;

  const isSelect = mode === "select";
  const isHack = mode === "hack";

  // Ring size based on mode
  const ringSize = isSelect ? 40 : isHack ? 48 : 32;
  const ringOffset = ringSize / 2;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        animate={{
          x: pos.x - ringOffset,
          y: pos.y - ringOffset,
          width: ringSize,
          height: ringSize,
          scale: clicking ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
        style={{
          border: `1px solid rgba(${isHack ? "168, 85, 247" : "0, 245, 255"}, ${isSelect || isHack ? 0.5 : 0.2})`,
          background: `radial-gradient(circle, rgba(${isHack ? "168, 85, 247" : "0, 245, 255"}, ${isSelect ? 0.12 : isHack ? 0.1 : 0.06}), transparent 70%)`,
        }}
      />

      {/* Crosshair lines — default mode only */}
      {mode === "default" && (
        <>
          {/* Horizontal crosshair */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            animate={{ x: pos.x - 8, y: pos.y - 0.5 }}
            transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.3 }}
            style={{
              width: 16,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
            }}
          />
          {/* Vertical crosshair */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            animate={{ x: pos.x - 0.5, y: pos.y - 8 }}
            transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.3 }}
            style={{
              width: 1,
              height: 16,
              background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.4), transparent)",
            }}
          />
        </>
      )}

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: pos.x - 2,
          y: pos.y - 2,
          scale: clicking ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.3 }}
        style={{
          width: 4,
          height: 4,
          background: isHack ? "#a855f7" : "#00f5ff",
          boxShadow: `0 0 8px ${isHack ? "rgba(168,85,247,0.8)" : "rgba(0,245,255,0.8)"}`,
        }}
      />

      {/* Mode label — shows on select/hack */}
      {(isSelect || isHack) && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] font-mono text-[8px] tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }}
          animate={{
            x: pos.x + ringOffset + 4,
            y: pos.y - 4,
            opacity: 0.6,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
          style={{
            color: isHack ? "#a855f7" : "#00f5ff",
            textShadow: `0 0 4px ${isHack ? "rgba(168,85,247,0.5)" : "rgba(0,245,255,0.5)"}`,
          }}
        >
          {isHack ? "HACK" : "SELECT"}
        </motion.div>
      )}
    </>
  );
}
