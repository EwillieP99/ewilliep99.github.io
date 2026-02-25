import { useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { Briefcase, GraduationCap, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { timeline, type TimelineEntry } from "@/data/timeline";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Unique years in descending order
const timelineYears = [...new Set(timeline.map((e) => e.startYear))].sort((a, b) => b - a);

// Icon for entry type
function EntryIcon({ type }: { type: TimelineEntry["type"] }) {
  const icons = { work: Briefcase, education: GraduationCap, leadership: Users };
  const Icon = icons[type];
  return <Icon size={14} />;
}

function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <AnimatedSection delay={index * 0.06} id={`tl-${entry.id}`}>
      <Card padding="p-6" className="relative ml-0 md:ml-4">
        {/* Timeline dot (desktop) */}
        <div className="absolute -left-[1.6rem] top-7 w-3 h-3 rounded-full bg-neon-cyan glow-cyan hidden md:block" />

        {/* Header */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-neon-cyan/60">
              <EntryIcon type={entry.type} />
            </span>
            <span className="font-bold text-slate-100">{entry.org}</span>
          </div>
          <span className="text-slate-500 text-sm hidden sm:inline">·</span>
          <span className="text-neon-cyan text-sm font-medium">{entry.role}</span>
          <span className="ml-auto text-xs font-mono text-slate-500">{entry.dates}</span>
        </div>

        {/* Impact badge */}
        {entry.impact && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-full bg-neon-cyan/8 border border-neon-cyan/20 text-xs font-mono text-neon-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-[glowPulse_2s_ease-in-out_infinite]" />
            {entry.impact}
          </div>
        )}

        {entry.location && (
          <p className="text-xs text-slate-600 mb-3 font-mono">{entry.location}</p>
        )}

        {/* Bullets */}
        <ul className="flex flex-col gap-1.5 mb-4" role="list">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="text-neon-cyan/40 mt-1 flex-shrink-0 text-xs">&gt;</span>
              {b}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </Card>
    </AnimatedSection>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeYear, setActiveYear] = useState(timelineYears[0]);

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

  return (
    <section id="timeline" className="max-w-6xl mx-auto px-6 py-24" aria-label="Timeline section">
      <AnimatedSection>
        <SectionHeader codename="// 02" label="Chrono Log" sub="Experience & education timeline" />
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

        <div className="flex flex-col gap-5 md:pl-8">
          {timelineYears.map((year) => (
            <div key={year}>
              {/* Year marker */}
              <AnimatedSection delay={0.05}>
                <div className="relative flex items-center mb-3 mt-2 first:mt-0">
                  <div
                    className={`absolute -left-[1.97rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-300 hidden md:block ${
                      activeYear === year
                        ? "bg-neon-cyan border-neon-cyan glow-cyan"
                        : "bg-navy-950 border-slate-600"
                    }`}
                  />
                  <button
                    onClick={() => scrollToYear(year)}
                    className="group flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
                    aria-label={`Jump to ${year} experiences`}
                  >
                    <span
                      className={`text-sm font-mono font-bold tracking-wider transition-colors duration-300 ${
                        activeYear === year
                          ? "text-neon-cyan text-glow-cyan"
                          : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    >
                      {year}
                    </span>
                    <div
                      className={`h-px w-6 transition-all duration-300 ${
                        activeYear === year
                          ? "bg-neon-cyan"
                          : "bg-slate-700 group-hover:bg-slate-500 group-hover:w-8"
                      }`}
                    />
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
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
