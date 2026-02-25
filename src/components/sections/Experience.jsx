import { useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection.jsx";
import { GlassCard } from "../ui/GlassCard.jsx";
import { SectionHeader } from "../ui/SectionHeader.jsx";
import { Tag } from "../ui/Tag.jsx";
import { experience } from "../../data/experience.js";
import { useTimelineProgress } from "../../hooks/useTimelineProgress.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

// Derive unique years in descending order (most recent first)
const timelineYears = [
  ...new Set(experience.map((item) => item.startYear)),
].sort((a, b) => b - a);

// Map each year to a count of items for progress-to-year mapping
const yearItemCounts = new Map();
experience.forEach((item) => {
  yearItemCounts.set(
    item.startYear,
    (yearItemCounts.get(item.startYear) || 0) + 1,
  );
});

/* ── Year marker on the timeline ────────────────────────────────────────── */

function YearMarker({ year, isActive, onClick, prefersReduced }) {
  return (
    <AnimatedSection delay={0.05}>
      <div className="relative flex items-center mb-3 mt-2 first:mt-0">
        {/* Dot on the timeline line (desktop) */}
        <div
          className={`absolute -left-[1.97rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-colors duration-300 hidden md:block ${
            isActive
              ? "bg-accent-blue border-accent-blue shadow-glow-blue timeline-year-dot-active"
              : "bg-navy-950 border-slate-600"
          }`}
        />

        {/* Clickable year label */}
        <button
          onClick={onClick}
          className={`group flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2 rounded ${
            !prefersReduced ? "cursor-pointer" : ""
          }`}
          aria-label={`Jump to ${year} experiences`}
        >
          <span
            className={`text-sm font-mono font-bold tracking-wider transition-colors duration-300 ${
              isActive
                ? "text-accent-blue"
                : "text-slate-500 group-hover:text-slate-300"
            }`}
          >
            {year}
          </span>
          <div
            className={`h-px w-6 transition-all duration-300 ${
              isActive
                ? "bg-accent-blue"
                : "bg-slate-700 group-hover:bg-slate-500 group-hover:w-8"
            }`}
          />
        </button>
      </div>
    </AnimatedSection>
  );
}

/* ── Timeline item card ─────────────────────────────────────────────────── */

function TimelineItem({ item, index }) {
  return (
    <AnimatedSection delay={index * 0.07} id={`exp-${item.id}`}>
      <GlassCard padding="p-6" className="relative">
        {/* Timeline dot */}
        <div className="absolute -left-[1.85rem] top-7 w-3 h-3 rounded-full bg-accent-blue shadow-glow-blue hidden md:block" />

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
          <span className="font-bold text-slate-100">{item.org}</span>
          <span className="text-slate-400 text-sm">·</span>
          <span className="text-accent-blue text-sm font-medium">
            {item.role}
          </span>
          <span className="ml-auto text-xs font-mono text-slate-500">
            {item.dates}
          </span>
        </div>

        {item.location && (
          <p className="text-xs text-slate-600 mb-3 font-mono">
            {item.location}
          </p>
        )}

        <ul className="flex flex-col gap-1.5 mb-4">
          {item.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-slate-400"
            >
              <span className="text-accent-blue/60 mt-1 flex-shrink-0 text-xs">
                ▸
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </GlassCard>
    </AnimatedSection>
  );
}

/* ── Experience section ─────────────────────────────────────────────────── */

export function Experience() {
  const { containerRef, progress, scrollYProgress } = useTimelineProgress();
  const prefersReduced = useReducedMotion();
  const [activeYear, setActiveYear] = useState(timelineYears[0]);

  // Map scroll progress (0→1) to the active year
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalItems = experience.length;
    let cumulative = 0;
    for (const year of timelineYears) {
      const count = yearItemCounts.get(year) || 0;
      const rangeEnd = (cumulative + count) / totalItems;
      if (latest <= rangeEnd + 0.05) {
        setActiveYear(year);
        break;
      }
      cumulative += count;
    }
  });

  // Animated clip-path to reveal the gradient line top-down
  const clipPath = useTransform(
    progress,
    (v) => `inset(0 0 ${100 - v * 100}% 0)`,
  );

  const scrollToYear = (year) => {
    const firstItem = experience.find((item) => item.startYear === year);
    if (firstItem) {
      const el = document.getElementById(`exp-${firstItem.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 py-24">
      <AnimatedSection>
        <SectionHeader label="Experience" />
      </AnimatedSection>

      {/* Timeline track */}
      <div ref={containerRef} className="relative md:ml-8">
        {/* Static track line (background) */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

        {/* Animated fill line (reveals with scroll) */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-px origin-top hidden md:block"
          style={{
            clipPath,
            background:
              "linear-gradient(180deg, #38bdf8, #a855f7, #22d3ee)",
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-5 md:pl-8">
          {timelineYears.map((year) => (
            <div key={year}>
              {/* Year marker */}
              <YearMarker
                year={year}
                isActive={activeYear === year}
                onClick={() => scrollToYear(year)}
                prefersReduced={prefersReduced}
              />

              {/* Items for this year */}
              {experience
                .filter((item) => item.startYear === year)
                .map((item) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    index={experience.indexOf(item)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
