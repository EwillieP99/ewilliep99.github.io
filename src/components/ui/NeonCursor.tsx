import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ===============================================================================
// NEON CURSOR — GPU-accelerated custom cursor with RAF + lerp
// Modes: default (crosshair), "select" (interactive elements), "hack" (cards)
// Uses refs + translate3d instead of React state to avoid re-renders
// ===============================================================================

type CursorMode = "default" | "select" | "hack";

const LERP_RING = 0.15;
const LERP_DOT = 0.25;

export function NeonCursor() {
  const prefersReduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const crossHRef = useRef<HTMLDivElement>(null);
  const crossVRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const mode = useRef<CursorMode>("default");
  const clicking = useRef(false);
  const mounted = useRef(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const updateStyles = useCallback(() => {
    const m = mode.current;
    const isSelect = m === "select";
    const isHack = m === "hack";
    const ringSize = isSelect ? 40 : isHack ? 48 : 32;
    const ringOffset = ringSize / 2;
    const scale = clicking.current ? 0.85 : 1;

    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ringPos.current.x - ringOffset}px, ${ringPos.current.y - ringOffset}px, 0) scale(${scale})`;
      ringRef.current.style.width = `${ringSize}px`;
      ringRef.current.style.height = `${ringSize}px`;
      ringRef.current.style.borderColor = `rgba(${isHack ? "168, 85, 247" : "0, 245, 255"}, ${isSelect || isHack ? 0.5 : 0.2})`;
      ringRef.current.style.background = `radial-gradient(circle, rgba(${isHack ? "168, 85, 247" : "0, 245, 255"}, ${isSelect ? 0.12 : isHack ? 0.1 : 0.06}), transparent 70%)`;
    }

    const dotScale = clicking.current ? 0.6 : 1;
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${dotPos.current.x - 2}px, ${dotPos.current.y - 2}px, 0) scale(${dotScale})`;
      dotRef.current.style.background = isHack ? "#a855f7" : "#00f5ff";
      dotRef.current.style.boxShadow = `0 0 8px ${isHack ? "rgba(168,85,247,0.8)" : "rgba(0,245,255,0.8)"}`;
    }

    if (crossHRef.current) {
      crossHRef.current.style.transform = `translate3d(${dotPos.current.x - 8}px, ${dotPos.current.y - 0.5}px, 0)`;
      crossHRef.current.style.opacity = m === "default" ? "1" : "0";
    }
    if (crossVRef.current) {
      crossVRef.current.style.transform = `translate3d(${dotPos.current.x - 0.5}px, ${dotPos.current.y - 8}px, 0)`;
      crossVRef.current.style.opacity = m === "default" ? "1" : "0";
    }

    if (labelRef.current) {
      const ringOffset2 = ringSize / 2;
      labelRef.current.style.transform = `translate3d(${ringPos.current.x + ringOffset2 + 4}px, ${ringPos.current.y - 4}px, 0)`;
      labelRef.current.style.opacity = isSelect || isHack ? "0.6" : "0";
      labelRef.current.style.color = isHack ? "#a855f7" : "#00f5ff";
      labelRef.current.style.textShadow = `0 0 4px ${isHack ? "rgba(168,85,247,0.5)" : "rgba(0,245,255,0.5)"}`;
      labelRef.current.textContent = isHack ? "HACK" : "SELECT";
    }
  }, []);

  const animate = useCallback(() => {
    ringPos.current.x = lerp(ringPos.current.x, target.current.x, LERP_RING);
    ringPos.current.y = lerp(ringPos.current.y, target.current.y, LERP_RING);
    dotPos.current.x = lerp(dotPos.current.x, target.current.x, LERP_DOT);
    dotPos.current.y = lerp(dotPos.current.y, target.current.y, LERP_DOT);

    updateStyles();
    rafId.current = requestAnimationFrame(animate);
  }, [updateStyles]);

  useEffect(() => {
    if (prefersReduced) return;

    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    mounted.current = true;

    // Hide default cursor globally
    document.documentElement.style.cursor = "none";

    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const handleDown = () => {
      clicking.current = true;
    };
    const handleUp = () => {
      clicking.current = false;
    };

    const handleEnterInteractive = () => { mode.current = "select"; };
    const handleEnterCard = () => { mode.current = "hack"; };
    const handleLeave = () => { mode.current = "default"; };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    // Bind interactive element listeners
    const bindListeners = () => {
      document.querySelectorAll("a, button, input, textarea, select, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterInteractive);
        el.addEventListener("mouseleave", handleLeave);
        (el as HTMLElement).style.cursor = "none";
      });

      document.querySelectorAll(".holo-card, .glass-card, [data-cursor='hack']").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterCard);
        el.addEventListener("mouseleave", handleLeave);
        (el as HTMLElement).style.cursor = "none";
      });
    };

    bindListeners();

    const observer = new MutationObserver(bindListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    return () => {
      mounted.current = false;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      observer.disconnect();
      cancelAnimationFrame(rafId.current);
      document.documentElement.style.cursor = "";
    };
  }, [prefersReduced, animate]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{ willChange: "transform", border: "1px solid rgba(0,245,255,0.2)" }}
      />

      {/* Crosshair lines */}
      <div
        ref={crossHRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          willChange: "transform",
          width: 16,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
        }}
      />
      <div
        ref={crossVRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          willChange: "transform",
          width: 1,
          height: 16,
          background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.4), transparent)",
        }}
      />

      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          willChange: "transform",
          width: 4,
          height: 4,
          background: "#00f5ff",
          boxShadow: "0 0 8px rgba(0,245,255,0.8)",
        }}
      />

      {/* Mode label */}
      <div
        ref={labelRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] font-mono text-[8px] tracking-[0.2em] uppercase"
        style={{ willChange: "transform", opacity: 0 }}
      />
    </>
  );
}
