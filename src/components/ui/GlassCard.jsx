import { motion } from "framer-motion";

/**
 * The core frosted-glass container used throughout the site.
 * Pass featured={true} for the glowing accent border variant.
 */
export function GlassCard({
  children,
  className = "",
  featured = false,
  hover = true,
  padding = "p-6",
}) {
  return (
    <motion.div
      className={`glass-card ${featured ? "glass-card-featured" : ""} ${padding} ${className}`}
      whileHover={
        hover ? { y: -3, boxShadow: "0 10px 48px rgba(56,189,248,0.14)" } : {}
      }
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
