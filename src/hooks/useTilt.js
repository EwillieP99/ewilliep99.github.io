import { useState, useCallback } from "react";

const MAX_DEG = 4;

/**
 * Returns mouse handlers and a style object that applies a subtle 3D tilt
 * and exposes --glow-x / --glow-y CSS custom properties for a cursor glow.
 */
export function useTilt(enabled = true) {
  const [style, setStyle] = useState({
    transform: "perspective(600px) rotateX(0deg) rotateY(0deg)",
    "--glow-x": "50%",
    "--glow-y": "50%",
    transition: "transform 0.35s ease",
  });

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * MAX_DEG;
      const rotateX = ((midY - y) / midY) * MAX_DEG;

      const glowX = ((x / rect.width) * 100).toFixed(1) + "%";
      const glowY = ((y / rect.height) * 100).toFixed(1) + "%";

      setStyle({
        transform: `perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
        "--glow-x": glowX,
        "--glow-y": glowY,
        transition: "transform 0.08s ease",
      });
    },
    [enabled],
  );

  const onMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg)",
      "--glow-x": "50%",
      "--glow-y": "50%",
      transition: "transform 0.35s ease",
    });
  }, []);

  return { onMouseMove, onMouseLeave, style };
}
