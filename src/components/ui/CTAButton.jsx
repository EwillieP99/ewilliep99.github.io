import { motion } from "framer-motion";

/**
 * Primary (gradient fill) or secondary (ghost) call-to-action button.
 */
export function CTAButton({
  label,
  href,
  variant = "primary",
  icon,
  download = false,
  onClick,
}) {
  const cls = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <motion.a
      href={href}
      download={download || undefined}
      target={!download && href?.startsWith("http") ? "_blank" : undefined}
      rel={!download && href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cls}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </motion.a>
  );
}
