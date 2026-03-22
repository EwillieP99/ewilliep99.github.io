// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Skills (Augmentations)
// 5 consolidated categories with proficiency + usage context
// ═══════════════════════════════════════════════════════════════════════════════

export type SkillDomain = "gtm" | "ai" | "technical" | "leadership";

/** Row order for matrix / terminal summaries */
export const SKILL_DOMAIN_ORDER: SkillDomain[] = ["gtm", "ai", "technical", "leadership"];

export interface SkillCapability {
  id: string;
  title: string;
  domain: SkillDomain;
  strength: "core" | "strong" | "working";
  summary: string;
  tools: string[];
  evidence: string;
  recentUse: string;
}

export const SKILL_DOMAIN_META: Record<
  SkillDomain,
  { label: string; color: string; icon: "TrendingUp" | "Brain" | "Monitor" | "Megaphone" }
> = {
  gtm: { label: "GTM & Sales", color: "#f472b6", icon: "TrendingUp" },
  ai: { label: "AI Adoption", color: "#a855f7", icon: "Brain" },
  technical: { label: "Technical Build", color: "#00f5ff", icon: "Monitor" },
  leadership: { label: "Leadership", color: "#22c55e", icon: "Megaphone" },
};

export const skillCapabilities: SkillCapability[] = [
  {
    id: "pipeline-design",
    title: "Pipeline Architecture",
    domain: "gtm",
    strength: "core",
    summary: "Design outbound systems that consistently create qualified meetings.",
    tools: ["HubSpot", "Salesforce", "Apollo", "Notion"],
    evidence: "$110K ARR generated in one semester at Geotarget.",
    recentUse: "Built segmented outreach and qualification loops for B2B SaaS accounts.",
  },
  {
    id: "sales-messaging",
    title: "Sales Messaging and Objection Handling",
    domain: "gtm",
    strength: "strong",
    summary: "Translate technical value into clear buyer outcomes and risk reduction.",
    tools: ["Discovery scripts", "Call frameworks", "Demo narratives"],
    evidence: "Maintained strong conversion and response quality across multiple channels.",
    recentUse: "Iterated messaging for technical and non-technical stakeholders.",
  },
  {
    id: "workshop-growth",
    title: "Workshop-Driven Growth",
    domain: "ai",
    strength: "core",
    summary: "Use live education events to convert interest into active usage.",
    tools: ["Live demos", "Prompt templates", "Follow-up sequences"],
    evidence: "400+ users activated at a 67% conversion rate across 15 workshops.",
    recentUse: "Ran AI training sessions for mixed audiences at UF.",
  },
  {
    id: "ai-translation",
    title: "AI Use-Case Translation",
    domain: "ai",
    strength: "strong",
    summary: "Turn abstract model capabilities into practical workflows for teams.",
    tools: ["Prompt chains", "Automation maps", "Task decomposition"],
    evidence: "Helped cross-discipline audiences adopt AI with immediate practical wins.",
    recentUse: "Built role-based playbooks for students and operators.",
  },
  {
    id: "frontend-systems",
    title: "Frontend Systems",
    domain: "technical",
    strength: "strong",
    summary: "Build polished interfaces with maintainable React and TypeScript architecture.",
    tools: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    evidence: "Designed and shipped this portfolio with custom UI systems and interactions.",
    recentUse: "Refactored navigation, themes, and interactive terminal/chat experiences.",
  },
  {
    id: "backend-systems",
    title: "Backend Systems",
    domain: "technical",
    strength: "strong",
    summary: "Ship Supabase backends with auth, storage, and realtime; structure day-to-day execution in linked Notion databases.",
    tools: ["Supabase", "PostgreSQL", "Notion databases", "FastAPI"],
    evidence: "Resonate: Supabase Postgres, Auth, Storage, Realtime, and migrations. Notion Life OS: linked DBs for missions, goals, and reviews.",
    recentUse: "Schema design, RLS-minded access patterns, and keeping app state aligned with durable stores.",
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    domain: "technical",
    strength: "working",
    summary: "Automate repetitive operations using scripts and AI-assisted workflows.",
    tools: ["Python", "Node", "Notion", "LLM APIs"],
    evidence: "Reduced cognitive overhead through repeatable workflow templates.",
    recentUse: "Automating prompt-based research and communication tasks.",
  },
  {
    id: "community-ops",
    title: "Community Program Operations",
    domain: "leadership",
    strength: "core",
    summary: "Coordinate multi-team programs with clear ownership and execution rhythms.",
    tools: ["Program briefs", "Partner syncs", "Event operating plans"],
    evidence: "Led 500+ attendee AI mixer with 8 orgs, 12 partners, and 5 sponsors.",
    recentUse: "Scaling cross-org initiatives through clearer operational cadences.",
  },
  {
    id: "public-speaking",
    title: "Public Speaking and Facilitation",
    domain: "leadership",
    strength: "strong",
    summary: "Present technical topics in practical language for broad audiences.",
    tools: ["Workshop decks", "Live Q&A", "Narrative framing"],
    evidence: "Consistently delivered high-attendance workshops and panel sessions.",
    recentUse: "Facilitating AI education sessions with recruiter and student audiences.",
  },
];
