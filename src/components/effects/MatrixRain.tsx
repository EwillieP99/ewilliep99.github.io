import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MatrixRainProps {
  /** Color of the matrix characters */
  color?: string;
  /** Character density — higher = more columns */
  density?: number;
  className?: string;
}

/**
 * Canvas-based Matrix digital rain effect.
 * Activated in Matrix theme mode.
 */
export function MatrixRain({
  color = "#22c55e",
  density = 0.6,
  className = "",
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
    const fontSize = 14;
    let columns: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const colCount = Math.floor(canvas.width / fontSize);
      columns = Array.from({ length: colCount }, () =>
        Math.floor(Math.random() * canvas.height / fontSize)
      );
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 15, 30, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns.length; i++) {
        if (Math.random() > density) continue;
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        // Brighter lead character
        ctx.globalAlpha = columns[i] > 0 ? 0.8 : 0.3;
        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        }
        columns[i]++;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, density, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[1] opacity-30 ${className}`}
      aria-hidden="true"
    />
  );
}
