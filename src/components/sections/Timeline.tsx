import { useState, useRef, useCallback } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Users, ChevronDown, Sparkles } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { timeline, type TimelineEntry } from "@/data/timeline";
import { navCodename } from "@/data/navSections";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// CHRONO LOG — Interactive vertical timeline with expandable accordion entries
// ═══════════════════════════════════════════════════════════════════════════════

// Unique years in descending order
const timelineYears = [...new Set(timeline.map((e) => e.startYear))].sort((a, b) => b - a);

// Icon for entry type
function EntryIcon({ type }: { type: TimelineEntry["type"] }) {
  const icons = { work: Briefcase, education: GraduationCap, leadership: Users };
  const Icon = icons[type];
  return <Icon size={14} />;
}

/** Spark particles that burst on accordion expand */
function SparkBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute -left-2 top-4 pointer-events-none" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-neon-cyan"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 40,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, delay: i * 0.03, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 4px rgba(0, 245, 255, 0.8)",
          }}
        />
      ))}
    </div>
  );
}

function TimelineItem({
  entry,
  index,
  isExpanded,
  onToggle,
}: {
  entry: TimelineEntry;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [justExpanded, setJustExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    if (!isExpanded) {
      setJustExpanded(true);
      setTimeout(() => setJustExpanded(false), 600);
    }
    onToggle();
  }, [isExpanded, onToggle]);

  // Show first bullet as preview when collapsed
  const previewBullet = entry.bullets[0];
  const hasMoreBullets = entry.bullets.length > 1;

  return (
    <AnimatedSection delay={index * 0.06} id={`tl-${entry.id}`}>
      <HoloCard
        padding="p-0"
        className={cn(
          "relative ml-0 md:ml-4 transition-all duration-300",
          isExpanded && "shadow-[0_0_20px_rgba(0,245,255,0.06)]",
        )}
        glowColor={entry.type === "education" ? "168, 85, 247" : "0, 245, 255"}
      >
        {/* Timeline dot (desktop) */}
        <div className="absolute -left-[1.6rem] top-7 hidden md:block">
          <SparkBurst active={justExpanded} />
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              isExpanded
                ? "bg-neon-cyan glow-cyan scale-125"
                : "bg-neon-cyan/60 hover:bg-neon-cyan",
            )}
          />
        </div>

        {/* Clickable header area */}
        <button
          onClick={handleToggle}
          className="w-full text-left p-6 pb-3 group"
          aria-expanded={isExpanded}
          aria-controls={`tl-content-${entry.id}`}
        >
          {/* Header row */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-neon-cyan/60">
                <EntryIcon type={entry.type} />
              </span>
              <span className="font-bold text-slate-100 group-hover:text-neon-cyan transition-colors">
                {entry.org}
              </span>
            </div>
            <span className="text-slate-500 text-sm hidden sm:inline">·</span>
            <span className="text-neon-cyan text-sm font-medium">{entry.role}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">{entry.dates}</span>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-neon-cyan/40 group-hover:text-neon-cyan/70 transition-colors"
              >
                <ChevronDown size={14} />
              </motion.span>
            </div>
          </div>

          {/* Impact badge */}
          {entry.impact && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-full bg-neon-cyan/8 border border-neon-cyan/20 text-xs font-mono text-neon-cyan group-hover:border-neon-cyan/40 group-hover:shadow-[0_0_10px_rgba(0,245,255,0.1)] transition-all">
              <Sparkles size={10} className="animate-[glowPulse_2s_ease-in-out_infinite]" />
              {entry.impact}
            </div>
          )}

          {entry.location && (
            <p className="text-xs text-slate-600 font-mono">{entry.location}</p>
          )}

          {/* Preview bullet (collapsed) */}
          {!isExpanded && previewBullet && (
            <p className="text-sm text-slate-400 mt-2 line-clamp-1">
              <span className="text-neon-cyan/40 mr-1">&gt;</span>
              {previewBullet}
              {hasMoreBullets && (
                <span className="text-neon-cyan/50 ml-1 text-xs">+{entry.bullets.length - 1} more</span>
              )}
            </p>
          )}
        </button>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`tl-content-${entry.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-neon-cyan/20 via-neon-cyan/10 to-transparent mb-4" />

                {/* Full bullets */}
                <ul className="flex flex-col gap-2 mb-4" role="list">
                  {entry.bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="text-neon-cyan/40 mt-1 flex-shrink-0 text-xs">&gt;</span>
                      {b}
                    </motion.li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                    >
                      <Tag
                        label={tag}
                        color={entry.type === "education" ? "purple" : entry.type === "leadership" ? "pink" : "cyan"}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HoloCard>
    </AnimatedSection>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeYear, setActiveYear] = useState(timelineYears[0]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.65"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progress = prefersReduced ? scrollYProgress : smoothProgress;

  const clipPath = useTransform(
    progress,
    (v: number) => `inset(0 0 ${100 - v * 100}% 0)`
  );

  // Map scroll progress to active year
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const totalItems = timeline.length;
    let cumulative = 0;
    for (const year of timelineYears) {
      const count = timeline.filter((e) => e.startYear === year).length;
      const rangeEnd = (cumulative + count) / totalItems;
      if (latest <= rangeEnd + 0.05) {
        setActiveYear(year);
        break;
      }
      cumulative += count;
    }
  });

  const scrollToYear = (year: number) => {
    const firstItem = timeline.find((e) => e.startYear === year);
    if (firstItem) {
      const el = document.getElementById(`tl-${firstItem.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleEntry = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <section id="timeline" className="section-shell" aria-label="Timeline section">
      <AnimatedSection>
        <SectionHeader codename={navCodename("timeline")} label="Chrono Log" sub="Experience & education timeline" />
      </AnimatedSection>

      {/* Expand/collapse all control */}
      <AnimatedSection delay={0.05}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              if (expandedIds.size === timeline.length) {
                setExpandedIds(new Set());
              } else {
                setExpandedIds(new Set(timeline.map((e) => e.id)));
              }
            }}
            className="text-xs font-mono text-neon-cyan/50 hover:text-neon-cyan transition-colors"
          >
            {expandedIds.size === timeline.length ? "[ Collapse All ]" : "[ Expand All ]"}
          </button>
        </div>
      </AnimatedSection>

      <div ref={containerRef} className="relative md:ml-8">
        {/* Track line background */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
        {/* Animated fill line */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-px origin-top hidden md:block"
          style={{
            clipPath,
            background: "linear-gradient(180deg, #00f5ff, #a855f7, #f472b6)",
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-6 md:pl-8">
          {timelineYears.map((year) => (
            <div key={year}>
              {/* Year marker */}
              <AnimatedSection delay={0.05}>
                <div className="relative flex items-center mb-3 mt-2 first:mt-0">
                  <div
                    className={cn(
                      "absolute -left-[1.97rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 hidden md:block",
                      activeYear === year
                        ? "bg-neon-cyan border-neon-cyan glow-cyan"
                        : "bg-navy-950 border-slate-600",
                    )}
                  />
                  <button
                    onClick={() => scrollToYear(year)}
                    className="group flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
                    aria-label={`Jump to ${year} experiences`}
                  >
                    <span
                      className={cn(
                        "text-sm font-mono font-bold tracking-wider transition-all duration-300",
                        activeYear === year
                          ? "text-neon-cyan text-glow-cyan"
                          : "text-slate-500 group-hover:text-slate-300",
                      )}
                    >
                      {year}
                    </span>
                    <div
                      className={cn(
                        "h-px transition-all duration-300",
                        activeYear === year
                          ? "w-8 bg-neon-cyan"
                          : "w-6 bg-slate-700 group-hover:bg-slate-500 group-hover:w-8",
                      )}
                    />
                    {/* Year entry count badge */}
                    <span className="text-[10px] font-mono text-slate-600">
                      {timeline.filter((e) => e.startYear === year).length} entries
                    </span>
                  </button>
                </div>
              </AnimatedSection>

              {/* Entries for this year */}
              {timeline
                .filter((e) => e.startYear === year)
                .map((entry) => (
                  <TimelineItem
                    key={entry.id}
                    entry={entry}
                    index={timeline.indexOf(entry)}
                    isExpanded={expandedIds.has(entry.id)}
                    onToggle={() => toggleEntry(entry.id)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
