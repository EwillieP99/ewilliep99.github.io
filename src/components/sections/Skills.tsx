import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
} from "framer-motion";
import { Monitor, Brain, TrendingUp, Megaphone, X } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { HoloCard } from "@/components/ui/HoloCard";
import { Magnetic } from "@/components/ui/Magnetic";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  skillCapabilities,
  SKILL_DOMAIN_META,
  SKILL_DOMAIN_ORDER,
  type SkillCapability,
  type SkillDomain,
} from "@/data/skills";
import { navCodename } from "@/data/navSections";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { filterChipClass, hudType } from "@/lib/sectionTypography";

const neonEase = [0.22, 1, 0.36, 1] as const;

/** Grid list: stagger children on enter; quick blur fade on filter exit */
function skillsListVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { duration: 0 } },
      listExit: { opacity: 1, transition: { duration: 0 } },
    };
  }
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.06 },
    },
    listExit: {
      opacity: 0,
      y: -8,
      filter: "blur(4px)",
      transition: { duration: 0.2, ease: neonEase },
    },
  };
}

/** Single card: “signal lock” blur resolve */
function skillsCardVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: neonEase },
    },
  };
}

function modalStaggerRootVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: {},
      visible: { transition: { duration: 0 } },
    };
  }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.12 },
    },
  };
}

function modalSectionVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0 } },
    };
  }
  return {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: neonEase },
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKILLS — strongest capabilities (core + strong) with optional domain filter
// ═══════════════════════════════════════════════════════════════════════════════

const iconMap: Record<string, typeof Monitor> = {
  Monitor,
  Brain,
  TrendingUp,
  Megaphone,
};

const STRENGTH_ORDER = { core: 0, strong: 1, working: 2 } as const;

/** Skill cards + modal (shares HUD scale with Mission Archive) */
const skillType = {
  overline: hudType.overline,
  pill: `${hudType.monoPill} text-slate-400`,
  title: hudType.cardTitle,
  summary: hudType.cardBody,
  evidence: hudType.cardMeta,
  toolChip: hudType.toolChip,
} as const;

function CapabilityModal({
  capability,
  onClose,
}: {
  capability: SkillCapability | null;
  onClose: () => void;
}) {
  const trapRef = useFocusTrap<HTMLDivElement>(capability !== null);
  const prefersReduced = useReducedMotion();
  const color = capability ? SKILL_DOMAIN_META[capability.domain].color : "#00f5ff";
  const modalRoot = useMemo(
    () => modalStaggerRootVariants(prefersReduced),
    [prefersReduced],
  );
  const modalSection = useMemo(
    () => modalSectionVariants(prefersReduced),
    [prefersReduced],
  );

  useEffect(() => {
    if (!capability) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [capability, onClose]);

  return (
    <AnimatePresence>
      {capability && (
        <motion.div
          ref={trapRef}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-detail-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-xl border bg-navy-950/95 backdrop-blur-2xl overflow-hidden"
            style={{ borderColor: `${SKILL_DOMAIN_META[capability.domain].color}30` }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
            />

            <div className="p-6 relative">
              <Magnetic
                className="absolute top-3 right-3 z-20 inline-flex"
                innerClassName="inline-flex"
              >
                <button
                  onClick={onClose}
                  autoFocus
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </Magnetic>

              <motion.div
                key={capability.id}
                className="relative"
                initial="hidden"
                animate="visible"
                variants={modalRoot}
              >
                <motion.div variants={modalSection} className="flex items-center gap-4 mb-5 pr-10">
                  <span
                    className={`px-2 py-1 rounded-full border border-white/10 shrink-0 ${skillType.pill}`}
                  >
                    {capability.strength}
                  </span>
                  <div className="min-w-0">
                    <h3 id="skill-detail-title" className={skillType.title}>
                      {capability.title}
                    </h3>
                    <p className={`mt-1 ${skillType.overline}`}>
                      {SKILL_DOMAIN_META[capability.domain].label}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={modalSection} className="mb-4 space-y-2">
                  <p className={skillType.overline}>Summary</p>
                  <p className={skillType.summary}>{capability.summary}</p>
                </motion.div>

                <motion.div variants={modalSection} className="space-y-2">
                  <p className={skillType.overline}>Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {capability.tools.map((tool) => (
                      <span key={tool} className={skillType.toolChip}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={modalSection} className="mt-4 space-y-2">
                  <p className={skillType.evidence}>
                    <span className="text-neon-cyan font-medium">Evidence: </span>
                    {capability.evidence}
                  </p>
                  <p className={skillType.evidence}>{capability.recentUse}</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CapabilityCard({
  capability,
  onClick,
  cardVariants,
}: {
  capability: SkillCapability;
  onClick: () => void;
  cardVariants: Variants;
}) {
  const meta = SKILL_DOMAIN_META[capability.domain];
  const Icon = iconMap[meta.icon] || Monitor;

  return (
    <motion.div className="h-full min-h-0" variants={cardVariants}>
      <HoloCard padding="p-6" className="h-full min-h-0 cursor-pointer" glowColor={hexToRgb(meta.color)}>
        <Magnetic
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
          innerClassName="flex min-h-0 w-full min-w-0 flex-1 flex-col"
        >
        <button
          type="button"
          className="flex min-h-0 w-full flex-1 flex-col gap-4 text-left"
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            <div
              className="shrink-0 rounded-lg p-2"
              style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
            >
              <Icon size={16} style={{ color: meta.color }} />
            </div>
            <p className={`min-w-0 flex-1 ${skillType.overline}`}>{meta.label}</p>
            <span
              className={`ml-auto shrink-0 rounded-full border border-white/10 px-2 py-1 ${skillType.pill}`}
            >
              {capability.strength}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <h3 className={skillType.title}>{capability.title}</h3>
            <p className={skillType.summary}>{capability.summary}</p>
            <p className={skillType.evidence}>{capability.evidence}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {capability.tools.slice(0, 4).map((tool) => (
              <span key={tool} className={skillType.toolChip}>
                {tool}
              </span>
            ))}
          </div>
        </button>
        </Magnetic>
      </HoloCard>
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

/** Filter-keyed grid: in-view stagger enter, AnimatePresence exit on domain change */
function SkillsFilteredGrid({
  domain,
  capabilities,
  onSelect,
}: {
  domain: SkillDomain | "all";
  capabilities: SkillCapability[];
  onSelect: (c: SkillCapability) => void;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });
  const listVar = useMemo(() => skillsListVariants(prefersReduced), [prefersReduced]);
  const cardVar = useMemo(() => skillsCardVariants(prefersReduced), [prefersReduced]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        key={domain}
        className="section-card-grid md:grid-cols-2"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="listExit"
        variants={listVar}
      >
        {capabilities.map((capability) => (
          <CapabilityCard
            key={capability.id}
            capability={capability}
            onClick={() => onSelect(capability)}
            cardVariants={cardVar}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/** Surface core + strong only; drop “working” depth from the grid */
function strongestCapabilities(): SkillCapability[] {
  return skillCapabilities
    .filter((c) => c.strength === "core" || c.strength === "strong")
    .sort((a, b) => {
      const da = STRENGTH_ORDER[a.strength];
      const db = STRENGTH_ORDER[b.strength];
      if (da !== db) return da - db;
      const oa = SKILL_DOMAIN_ORDER.indexOf(a.domain);
      const ob = SKILL_DOMAIN_ORDER.indexOf(b.domain);
      if (oa !== ob) return oa - ob;
      return a.title.localeCompare(b.title);
    });
}

export function Skills() {
  const [domain, setDomain] = useState<SkillDomain | "all">("all");
  const [selected, setSelected] = useState<SkillCapability | null>(null);

  const base = useMemo(() => strongestCapabilities(), []);

  const visible = useMemo(() => {
    if (domain === "all") return base;
    return base.filter((c) => c.domain === domain);
  }, [base, domain]);

  return (
    <>
      <section id="augmentations" className="section-shell" aria-label="Skills section">
        <AnimatedSection>
          <SectionHeader
            codename={navCodename("augmentations")}
            label="Skills"
            sub="Where I’m strongest — core capabilities with proof"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <p className="type-overline">Filter</p>
          <div className="flex flex-wrap gap-2 section-toolbar-gap">
            <Magnetic className="inline-flex" innerClassName="inline-flex">
              <button
                type="button"
                onClick={() => setDomain("all")}
                className={filterChipClass(domain === "all")}
              >
                All
              </button>
            </Magnetic>
            {SKILL_DOMAIN_ORDER.map((id) => {
              const meta = SKILL_DOMAIN_META[id];
              return (
                <Magnetic key={id} className="inline-flex" innerClassName="inline-flex">
                  <button
                    type="button"
                    onClick={() => setDomain(id)}
                    className={filterChipClass(domain === id)}
                  >
                    {meta.label}
                  </button>
                </Magnetic>
              );
            })}
          </div>
        </AnimatedSection>

        <SkillsFilteredGrid
          domain={domain}
          capabilities={visible}
          onSelect={setSelected}
        />
      </section>

      <CapabilityModal capability={selected} onClose={() => setSelected(null)} />
    </>
  );
}
