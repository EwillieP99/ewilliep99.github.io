import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ═══════════════════════════════════════════════════════════════════════════════
// DATA STREAM — Animated thin glowing vertical lines flowing downward
// Very low opacity, subtle ambient background effect
// ═══════════════════════════════════════════════════════════════════════════════

interface StreamLine {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  color: string;
  width: number;
}

const COLORS = [
  "0, 245, 255",   // cyan
  "168, 85, 247",  // purple
  "56, 189, 248",  // blue
];

export function DataStream({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<StreamLine[]>([]);
  const animRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const initLines = useCallback((width: number, height: number) => {
    const count = Math.floor(width / 80); // ~1 line per 80px
    linesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 2 - height,
      speed: Math.random() * 0.5 + 0.2,
      length: Math.random() * 80 + 40,
      opacity: Math.random() * 0.06 + 0.02,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      width: Math.random() * 0.8 + 0.3,
    }));
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initLines(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const line of linesRef.current) {
        line.y += line.speed;

        // Reset when off bottom
        if (line.y > rect.height + line.length) {
          line.y = -line.length;
          line.x = Math.random() * rect.width;
        }

        // Draw line with gradient fade
        const gradient = ctx.createLinearGradient(line.x, line.y, line.x, line.y + line.length);
        gradient.addColorStop(0, `rgba(${line.color}, 0)`);
        gradient.addColorStop(0.3, `rgba(${line.color}, ${line.opacity})`);
        gradient.addColorStop(0.7, `rgba(${line.color}, ${line.opacity})`);
        gradient.addColorStop(1, `rgba(${line.color}, 0)`);

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = line.width;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReduced, initLines]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-[1] ${className}`}
      aria-hidden="true"
    />
  );
}
