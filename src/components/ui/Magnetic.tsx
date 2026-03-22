import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { cn } from "@/lib/utils";

export function Magnetic({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagneticButton();

  return (
    <div
      ref={ref}
      className={cn(className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div style={style} className={cn(innerClassName)}>
        {children}
      </motion.div>
    </div>
  );
}
