
// ─── PROJECTS ─────────────────────────────────────────────────────────────────
// type: "terminal" renders as a dark metrics card; "card" renders as glass card.
// Add links: [] if there are no live links.

export const projects = [
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
  },
  {
    id: "campus-playbook",
    title: "Campus GTM Playbook",
    description:
      "A documented, repeatable playbook for launching and scaling a campus ambassador program — from zero to 15+ ambassadors across 5 universities. Covers recruiting scripts, onboarding workflows, weekly cadences, and documented KPIs that drove 67% conversion rates.",
    tags: ["GTM", "Documentation", "Community", "Playbook"],
    type: "card",
    links: [],
    featured: false,
  },
  {
    id: "ai-workflows",
    title: "AI-Augmented Workflow Stack",
    description:
      "A personal stack of AI-powered automations and prompt systems I use daily — from outreach drafting and research synthesis to meeting prep and retrospective analysis. The goal: remove 80% of rote cognitive load so I can focus on judgment.",
    tags: ["AI", "Automation", "Prompting", "Workflows"],
    type: "card",
    links: [],
    featured: false,
  },
];

// ─── PLAYS ────────────────────────────────────────────────────────────────────
// Tactical sub-entries — short, skimmable for a hiring manager.

export const plays = [
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
