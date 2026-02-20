import { useState, useEffect } from "react";

/**
 * Tracks the current mouse position, throttled via requestAnimationFrame.
 * Returns { x, y } in viewport coordinates.
 */
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frameId = null;

    function onMouseMove(e) {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        frameId = null;
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return pos;
}
