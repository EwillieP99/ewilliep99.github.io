import { type ReactNode, type CSSProperties, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  featured?: boolean;
  hover?: boolean;
  padding?: string;
}

/** Glassmorphism card with optional 3D tilt + cursor glow on hover */
export function Card({
  children,
  className = "",
  featured = false,
  hover = true,
  padding = "p-6",
}: CardProps) {
  const { onMouseMove, onMouseLeave, style: tiltStyle } = useTilt(hover);

  return (
    <motion.div
      className={cn(
        "glass-card relative overflow-hidden",
        featured && "glass-card-featured",
        padding,
        className,
      )}
      style={hover ? tiltStyle as CSSProperties : undefined}
      onMouseMove={hover ? (e: MouseEvent<HTMLDivElement>) => onMouseMove(e) : undefined}
      onMouseLeave={hover ? onMouseLeave : undefined}
      whileHover={hover ? { y: -3 } : {}}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Cursor-following glow */}
      {hover && (
        <div
          className="glass-card-glow"
          style={{
            "--glow-x": tiltStyle["--glow-x"],
            "--glow-y": tiltStyle["--glow-y"],
          } as CSSProperties}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}

/** Terminal-style card with dark background and neon border */
export function TerminalCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("terminal-card p-6", className)}>
      {/* Title bar dots */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
      </div>
      {children}
    </div>
  );
}
