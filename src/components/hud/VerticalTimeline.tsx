import { motion } from "framer-motion";
import { useNavigation, NAV_SECTIONS } from "./NavigationProvider";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// VERTICAL TIMELINE — Fixed right-edge navigation with glowing dots & progress
// ═══════════════════════════════════════════════════════════════════════════════

export function VerticalTimeline() {
  const { activeId, scrollTo, scrollProgress } = useNavigation();

  const activeIndex = NAV_SECTIONS.findIndex((s) => s.id === activeId);

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0"
      aria-label="Section navigation"
    >
      {/* Glowing vertical track line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-neon-cyan/12">
        {/* Progress fill */}
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-neon-cyan/55 to-neon-purple/35 origin-top"
          style={{ height: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {NAV_SECTIONS.map((section, i) => {
        const isActive = activeId === section.id;
        const isPast = i <= activeIndex;

        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="relative group flex items-center py-3 px-2"
            aria-label={`Navigate to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Dot */}
            <div className="relative flex items-center justify-center w-4 h-4">
              {/* Pulse ring for active */}
              {isActive && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-neon-cyan/50"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Dot core */}
              <span
                className={cn(
                  "relative z-10 block rounded-full transition-all duration-300",
                  isActive
                    ? "w-2.5 h-2.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.8)]"
                    : isPast
                      ? "w-2 h-2 bg-neon-cyan/50"
                      : "w-1.5 h-1.5 bg-slate-500/40 group-hover:bg-neon-cyan/40",
                )}
              />
            </div>

            {/* Label tooltip on hover */}
            <div
              className={cn(
                "absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none",
                "opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-navy-950/95 border border-neon-cyan/20 backdrop-blur-lg whitespace-nowrap">
                <span className="text-[10px] font-mono text-neon-cyan/60">{section.code}</span>
                <span
                  className={cn(
                    "text-[11px] font-mono font-semibold tracking-wider",
                    isActive ? "text-neon-cyan" : "text-slate-300",
                  )}
                >
                  {section.label}
                </span>
              </div>
              {/* Arrow pointing right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-1.5 h-1.5 rotate-45 bg-navy-950/95 border-r border-t border-neon-cyan/20" />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
