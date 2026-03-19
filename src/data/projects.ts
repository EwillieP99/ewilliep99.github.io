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
    id: "resonate",
    title: "Resonate",
    description:
      "A full-stack campus mental wellness ecosystem for UF students. Adaptive AI-generated soundscapes, RPG-style quests grounded in evidence-based psychology, anonymous peer matching via VibeMatch, and journey mapping with PDF export for therapists.",
    tags: ["Next.js 16", "FastAPI", "Supabase", "MusicGen AI", "React 19"],
    type: "card",
    metrics: [
      { label: "AI Inference Servers", value: "3" },
      { label: "Quest Levels", value: "15" },
      { label: "Crisis Detection Tiers", value: "3" },
      { label: "Target Users", value: "57K+" },
    ],
    links: [],
    featured: true,
    impact: "Full-stack wellness ecosystem — AI music, RPG quests, peer matching for 57K+ UF students",
    category: "ai",
    status: "active",
    // githubUrl: private repo
    dossier: {
      fullDescription:
        "Resonate reimagines mental wellness for college students through four pillars: adaptive AI-generated soundscapes that respond to emotional state, RPG quests with evidence-based psychological techniques (CBT, ACT, positive psychology), anonymous peer connection (VibeMatch) with automatic crisis safeguards, and journey mapping to track emotional patterns.\n\nArchitecture: Next.js 16 App Router frontend with feature-based modules (features/sonic/, features/quests/, features/vibematch/, features/check-in/). Three parallel FastAPI inference servers — MusicGen text-to-audio on :8000, FLUX.2 Klein text-to-image on :8001, Wan2.1 text-to-video on :8002. Supabase handles PostgreSQL + Realtime + Auth + Storage with 5 migration files.\n\nAI stack includes OpenAI gpt-4o-mini for quest feedback, UF Navigator LLM proxy, Meta MusicGen via local GPU inference, and Anthropic Claude. Safety layer features 3-tier crisis detection: client-side keyword matching for instant UI response, server-side pre-AI screening, and routing to UF Counseling & Wellness Center, 988 Lifeline, or 911.\n\nKey features: magic link auth restricted to @ufl.edu, mood-reactive dashboard with XP system, 3 quest arcs x 5 levels each, Sonic Resonance Engine with 3 music modes (Quick Pick, Interactive Sliders, MusicGen AI), EchoVision audio visualizer with AI-morphing images, real-time VibeMatch peer chat, and Journey Map with PDF export for sharing with therapists. Privacy-first: no ads, no data selling, rate-limited at 10 req/min.",
      results: [
        { label: "AI Inference Servers", value: "3 parallel FastAPI" },
        { label: "Quest Levels", value: "15 (3 arcs x 5)" },
        { label: "Music Modes", value: "3 (Pick / Sliders / AI)" },
        { label: "Crisis Detection", value: "3-tier (client → server → emergency)" },
      ],
      debrief: [
        "Feature-based module architecture (features/sonic/, features/quests/) scales better than page-based organization for complex apps.",
        "Running 3 AI inference servers in parallel required careful port management and health checks — containerization is the next step.",
        "Crisis detection must be multi-layered: client-side catches obvious keywords instantly, but server-side catches what slips through before it reaches the LLM.",
        "Evidence-based psychology integrated into product design (not bolted on) makes the difference between a wellness app and a glorified mood tracker.",
      ],
    },
  },
  {
    id: "life-os",
    title: "Notion Life OS",
    description:
      "A personal operating system built entirely in Notion that turns \"trying harder\" into running the system. Mission Control is the front door. Underneath it, a connected set of databases powers daily execution, project throughput, goal direction, and habit compounding.",
    tags: ["Notion", "Systems Design", "Productivity Ops"],
    type: "terminal",
    metrics: [
      { label: "Daily Active Use", value: "365+ days" },
      { label: "Weekly Review Streak", value: "30+" },
      { label: "Projects Tracked", value: "25+" },
    ],
    links: [],
    featured: true,
    impact: "365+ days daily use powering execution across 25+ active projects",
    category: "systems",
    status: "classified",
    dossier: {
      fullDescription:
        "A personal operating system built entirely in Notion that turns \"trying harder\" into running the system. Mission Control is the front door. Underneath it, a connected set of databases powers daily execution (Life Engine + Schedule), project throughput (Active Missions), goal direction (Trajectory), and habit compounding (Protocols + Protocol Log + Captain's Log).\n\nThe core mechanic is routing + review: captures flow into Dispatch, get a Destination within 24 hours, and surface back up through Today's Dashboard and weekly reviews so nothing relies on memory.\n\nLive components include: Mission Control dashboard with Navigation + Today's Dashboard + Daily Orbit, Life Engine as the task backbone with linked views, Dispatch inbox routing station with a 24-hour routing rule, Protocols + Protocol Log for daily standing orders and streak tracking, Captain's Log for daily reflection + health metrics with trend views, and Schedule view for planning and time-blocking.",
      results: [
        { label: "Daily Active Use", value: "365+ days" },
        { label: "Active Projects Tracked", value: "25+" },
        { label: "Weekly Review Streak", value: "30+" },
        { label: "Top 3 + Orders", value: "Daily via Daily Orbit" },
      ],
      debrief: [
        "Systems win when they reduce choices. A good dashboard is a decision filter, not a feature showcase.",
        "Relations turn Notion into an operating system: one capture can become a task, mission, goal, or log entry without duplication.",
        "Compounding becomes real when you can see it: streaks + daily logs + trend views make progress measurable and motivating.",
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
