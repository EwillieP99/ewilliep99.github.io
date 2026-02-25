import { useState, useCallback, type CSSProperties, type MouseEvent } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface TiltReturn {
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  style: CSSProperties & Record<string, string>;
}

/** Subtle 3D tilt effect on mouse hover + glow position tracking */
export function useTilt(enabled = true): TiltReturn {
  const prefersReduced = useReducedMotion();
  const [style, setStyle] = useState<CSSProperties & Record<string, string>>({
    transform: "perspective(600px) rotateX(0deg) rotateY(0deg)",
    "--glow-x": "50%",
    "--glow-y": "50%",
  });

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!enabled || prefersReduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;

      setStyle({
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
        "--glow-x": `${x * 100}%`,
        "--glow-y": `${y * 100}%`,
      });
    },
    [enabled, prefersReduced]
  );

  const onMouseLeave = useCallback(() => {
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.4s ease-out",
      "--glow-x": "50%",
      "--glow-y": "50%",
    });
  }, []);

  return { onMouseMove, onMouseLeave, style };
}
