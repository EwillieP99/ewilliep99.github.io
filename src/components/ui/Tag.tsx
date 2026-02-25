import { cn } from "@/lib/utils";

interface TagProps {
  label: string;
  color?: "cyan" | "purple" | "pink" | "default";
}

/** Small inline tag pill with neon styling */
export function Tag({ label, color = "default" }: TagProps) {
  const colorClasses = {
    cyan: "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan",
    purple: "bg-neon-purple/10 border-neon-purple/30 text-neon-purple",
    pink: "bg-neon-pink/10 border-neon-pink/30 text-neon-pink",
    default: "bg-white/5 border-white/10 text-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border",
        "transition-transform hover:-translate-y-0.5",
        colorClasses[color],
      )}
    >
      {label}
    </span>
  );
}
