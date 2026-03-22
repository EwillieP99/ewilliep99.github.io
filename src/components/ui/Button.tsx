import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "neon" | "ghost";
  href?: string;
  download?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

/** Neon-styled CTA button (link or button element) */
export function Button({
  children,
  variant = "neon",
  href,
  download = false,
  onClick,
  icon,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const cls = cn(
    variant === "neon" ? "btn-neon" : "btn-ghost",
    disabled && "opacity-50 cursor-not-allowed",
    className,
  );

  // Render as anchor tag if href is provided
  if (href) {
    return (
      <Magnetic className="inline-flex" innerClassName="inline-flex">
        <motion.a
          href={href}
          download={download || undefined}
          target={!download && href.startsWith("http") ? "_blank" : undefined}
          rel={!download && href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={cls}
          onClick={onClick}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.15 }}
        >
          {icon && <span className="text-base">{icon}</span>}
          {children}
        </motion.a>
      </Magnetic>
    );
  }

  return (
    <Magnetic className="inline-flex" innerClassName="inline-flex">
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cls}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        transition={{ duration: 0.15 }}
      >
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </motion.button>
    </Magnetic>
  );
}
