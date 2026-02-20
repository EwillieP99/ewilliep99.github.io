import { motion } from "framer-motion";
import { useTilt } from "../../hooks/useTilt.js";

/**
 * The core frosted-glass container used throughout the site.
 * Pass featured={true} for the glowing accent border variant.
 * When hover={true} (default), applies subtle 3D tilt and cursor glow on hover.
 */
export function GlassCard({
  children,
  className = "",
  featured = false,
  hover = true,
  padding = "p-6",
}) {
  const { onMouseMove, onMouseLeave, style: tiltStyle } = useTilt(hover);

  return (
    <motion.div
      className={`glass-card ${featured ? "glass-card-featured" : ""} ${padding} ${className} relative overflow-hidden`}
      style={hover ? tiltStyle : undefined}
      onMouseMove={hover ? onMouseMove : undefined}
      onMouseLeave={hover ? onMouseLeave : undefined}
      whileHover={hover ? { y: -3 } : {}}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Cursor-following glow overlay */}
      {hover && (
        <div
          className="glass-card-glow"
          style={{
            "--glow-x": tiltStyle["--glow-x"],
            "--glow-y": tiltStyle["--glow-y"],
          }}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
