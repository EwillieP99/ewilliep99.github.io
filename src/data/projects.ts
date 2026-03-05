// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Projects (Mission Archive)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: "terminal" | "card";
  metrics?: ProjectMetric[];
  links: ProjectLink[];
  featured: boolean;
  impact: string; // One-line impact statement
  category: "sales" | "ai" | "systems" | "community";
  status?: "classified" | "active"; // Badge style
  // Direct action links
  notionUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  // Dossier modal content
  dossier?: {
    fullDescription: string;
    results: ProjectMetric[];
    debrief: string[];
  };
}

export const projects: Project[] = [
  {
    id: "life-os",
    title: "Notion Life OS",
    description:
      "A modular personal operating system built in Notion. Covers goal-setting, weekly reviews, project pipeline, habit loops, and an outreach tracker. Designed around the principle that a good system removes the need to remember — you just execute.",
    tags: ["Notion", "Systems Design", "Productivity", "Ops"],
    type: "terminal",
    metrics: [
      { label: "Templates Active", value: "12" },
      { label: "Weekly Review Streak", value: "30+ wks" },
      { label: "Projects Tracked", value: "25+" },
    ],
    links: [],
    featured: true,
    impact: "Built repeatable OS used daily across 25+ active projects",
    category: "systems",
    status: "classified",
    dossier: {
      fullDescription:
        "A comprehensive personal operating system built entirely in Notion, designed around the principle that good systems eliminate the need for willpower. The Life OS covers goal-setting with OKR cascades, weekly review rituals, project pipeline management with Kanban + timeline views, habit tracking loops, and an outreach CRM for networking. Every template is interconnected — a weekly review surfaces incomplete tasks, upcoming deadlines, and habit streaks automatically.",
      results: [
        { label: "Templates Active", value: "12" },
        { label: "Weekly Review Streak", value: "30+" },
        { label: "Projects Tracked", value: "25+" },
        { label: "Daily Active Use", value: "365+ days" },
      ],
      debrief: [
        "The best system is one you actually use — simplicity beats feature-completeness every time.",
        "Connecting databases via relations turns Notion from a note app into a real operating system.",
        "Weekly reviews are the single highest-leverage habit for staying on course.",
      ],
    },
  },
  {
    id: "comet-dashboards",
    title: "Comet Analytics Dashboards",
    description:
      "Custom dashboards tracking ambassador performance and campus engagement metrics across the Perplexity campus network. Tracked 400+ user activations, surfacing the data needed to coach individuals and prioritize school-level resources.",
    tags: ["Analytics", "GTM", "Data Visualization", "Comet"],
    type: "card",
    links: [],
    featured: true,
    impact: "Tracked 400+ activations → drove data-backed campus decisions",
    category: "ai",
    status: "classified",
    dossier: {
      fullDescription:
        "Built custom analytics dashboards on the Comet platform to track ambassador performance metrics across Perplexity's campus network. The system tracked individual ambassador activity, workshop attendance, trial-to-signup conversion funnels, and school-level engagement over time. Data was used to identify top performers for recognition, coach underperformers with specific action items, and make resource allocation decisions about which campuses to double down on.",
      results: [
        { label: "Users Tracked", value: "400+" },
        { label: "Conversion Rate", value: "67%" },
        { label: "Campuses Monitored", value: "5" },
        { label: "Ambassadors Managed", value: "15+" },
      ],
      debrief: [
        "You can't improve what you don't measure — dashboards turned gut feelings into coaching conversations.",
        "Conversion rate matters more than raw signups; focusing on quality workshops beat mass flyering.",
        "Sharing dashboards with the team created healthy competition and accountability.",
      ],
    },
  },
  {
    id: "campus-playbook",
    title: "Campus GTM Playbook",
    description:
      "A documented, repeatable playbook for launching and scaling a campus ambassador program — from zero to 15+ ambassadors across 5 universities. Covers recruiting scripts, onboarding workflows, weekly cadences, and documented KPIs that drove 67% conversion rates.",
    tags: ["GTM", "Documentation", "Community", "Playbook"],
    type: "card",
    links: [],
    featured: true,
    impact: "Scaled ambassador program 0→15 across 5 universities",
    category: "sales",
    status: "classified",
    dossier: {
      fullDescription:
        "Created a documented, repeatable go-to-market playbook for launching campus ambassador programs from scratch. The playbook covers end-to-end: sourcing and recruiting ambassadors via cold DMs and org partnerships, structured onboarding with role expectations and tool setup, weekly cadences with activity targets and check-ins, and KPI tracking frameworks. Used at Perplexity AI to scale from 0 to 15+ ambassadors across 5 universities, driving 400+ user activations with a 67% trial-to-signup conversion rate.",
      results: [
        { label: "Ambassadors Recruited", value: "15+" },
        { label: "Universities", value: "5" },
        { label: "User Activations", value: "400+" },
        { label: "Conversion Rate", value: "67%" },
      ],
      debrief: [
        "Documentation is a force multiplier — a good playbook lets new ambassadors ramp in days, not weeks.",
        "The recruiting script matters less than the follow-up cadence; persistence beats polish.",
        "Setting clear weekly activity targets (workshops/week, signups/workshop) made coaching specific and actionable.",
      ],
    },
  },
  {
    id: "ai-workflows",
    title: "AI-Augmented Workflow Stack",
    description:
      "A personal stack of AI-powered automations and prompt systems used daily — from outreach drafting and research synthesis to meeting prep and retrospective analysis. The goal: remove 80% of rote cognitive load to focus on judgment.",
    tags: ["AI", "Automation", "Prompting", "Workflows"],
    type: "card",
    links: [],
    featured: false,
    impact: "Eliminated 80% of repetitive cognitive work with AI tooling",
    category: "ai",
    status: "active",
    dossier: {
      fullDescription:
        "A curated stack of AI-powered tools and custom prompt systems used daily across sales, research, and communication workflows. Includes templated prompt chains for outreach email drafting, meeting prep research briefs, post-call retrospective analysis, and content synthesis from long-form sources. Built with the philosophy that AI should handle the 80% of rote cognitive work so human judgment can focus on the 20% that actually matters.",
      results: [
        { label: "Cognitive Load Reduced", value: "~80%" },
        { label: "Prompt Templates", value: "15+" },
        { label: "Daily Active Use", value: "Yes" },
        { label: "Time Saved/Week", value: "5+ hrs" },
      ],
      debrief: [
        "The best AI workflows are invisible — they should feel like thinking faster, not using a tool.",
        "Prompt engineering is really just clear communication; the skill transfers directly to sales.",
        "Automation without quality checks creates confident garbage — always verify AI output.",
      ],
    },
  },
];

// Filter categories for the project grid
export const projectCategories = [
  { id: "all", label: "All Missions" },
  { id: "sales", label: "Sales & GTM" },
  { id: "ai", label: "AI & Data" },
  { id: "systems", label: "Systems" },
  { id: "community", label: "Community" },
] as const;

// Tactical plays — the "Playbook" section
export interface Play {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export const plays: Play[] = [
  {
    id: "play-career-fair",
    title: "Career Fair Play",
    description:
      "A pre-event research + target list framework for maximizing meaningful conversations per hour at career fairs.",
    tags: ["Sales", "Prep"],
  },
  {
    id: "play-campus-growth",
    title: "Campus Growth Play",
    description:
      "Cold outreach → event collab → ambassador conversion sequence for growing a campus program from scratch.",
    tags: ["GTM", "Outreach"],
  },
  {
    id: "play-ai-audit",
    title: "AI Tool Audit Play",
    description:
      "Framework for evaluating and prioritizing AI tool adoption for a student org or small team.",
    tags: ["AI", "Strategy"],
  },
  {
    id: "play-outreach",
    title: "Warm Intro Outreach Play",
    description:
      "Template + follow-up sequence that converts a mutual connection into a 30-minute informational call.",
    tags: ["Sales", "Networking"],
  },
];
