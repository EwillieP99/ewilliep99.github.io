// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Static mission archive (fallback when Notion sync is empty / skipped)
// ═══════════════════════════════════════════════════════════════════════════════

import type { Project } from "./projectTypes";

export const staticProjects: Project[] = [
  {
    id: "resonate",
    title: "Resonate",
    description:
      "A full-stack campus mental wellness ecosystem for UF students. Adaptive AI-generated soundscapes, RPG-style quests grounded in evidence-based psychology, anonymous peer matching via VibeMatch, and journey mapping with PDF export for therapists.",
    tags: ["Next.js", "FastAPI", "Supabase", "MusicGen", "React 19"],
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
    dossier: {
      fullDescription:
        "Resonate reimagines mental wellness for college students through four pillars: adaptive AI-generated soundscapes that respond to emotional state, RPG quests with evidence-based psychological techniques (CBT, ACT, positive psychology), anonymous peer connection (VibeMatch) with automatic crisis safeguards, and journey mapping to track emotional patterns.\n\nArchitecture: Next.js App Router frontend with feature-based modules (features/sonic/, features/quests/, features/vibematch/, features/check-in/). Three parallel FastAPI inference servers — MusicGen text-to-audio on :8000, FLUX.2 Klein text-to-image on :8001, Wan2.1 text-to-video on :8002. Supabase handles PostgreSQL + Realtime + Auth + Storage with 5 migration files.\n\nAI stack includes OpenAI gpt-4o-mini for quest feedback, UF Navigator LLM proxy, Meta MusicGen via local GPU inference, and Anthropic Claude. Safety layer features 3-tier crisis detection: client-side keyword matching for instant UI response, server-side pre-AI screening, and routing to UF Counseling & Wellness Center, 988 Lifeline, or 911.\n\nKey features: magic link auth restricted to @ufl.edu, mood-reactive dashboard with XP system, 3 quest arcs x 5 levels each, Sonic Resonance Engine with 3 music modes (Quick Pick, Interactive Sliders, MusicGen AI), EchoVision audio visualizer with AI-morphing images, real-time VibeMatch peer chat, and Journey Map with PDF export for sharing with therapists. Privacy-first: no ads, no data selling, rate-limited at 10 req/min.",
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
      "Custom dashboards on Perplexity’s Comet platform for ambassador performance and campus engagement. Surfaced funnel and activity data that supported coaching 15+ ambassadors and prioritizing school-level resources — aligned with 400+ user activations from the campus program.",
    tags: ["Analytics", "GTM", "Data Visualization", "Comet"],
    type: "card",
    links: [],
    featured: true,
    impact: "Tracked 400+ activations → drove data-backed campus decisions",
    category: "sales",
    status: "classified",
    dossier: {
      fullDescription:
        "Built custom analytics dashboards on the Comet platform to track ambassador performance across Perplexity’s campus network: individual ambassador activity, workshop attendance, trial-to-signup conversion, and school-level engagement over time. Workshop programming reached 600+ students; the program attributed 400+ net new user activations with a 67% trial-to-signup conversion rate. Dashboards supported identifying top performers, coaching with specific action items, and deciding where to double down geographically.",
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
      "A personal stack of AI-powered automations and prompt systems used daily — outreach drafting, research synthesis, meeting prep, and post-call retros. Built so repetitive prep runs through templates and checks, and judgment stays on the buyer.",
    tags: ["AI", "Automation", "Prompting", "Workflows"],
    type: "card",
    links: [],
    featured: false,
    impact: "Cuts rote prep across outreach, research, and meetings",
    category: "ai",
    status: "active",
    dossier: {
      fullDescription:
        "A curated stack of AI-powered tools and custom prompt systems used daily across sales, research, and communication workflows: templated prompt chains for outreach drafting, meeting prep briefs, post-call retrospective notes, and synthesis from long-form sources. Design goal: automate structured, repeatable steps so time goes to discovery, positioning, and follow-through — with human review on anything customer-facing.",
      results: [
        { label: "Prompt / workflow templates", value: "15+" },
        { label: "Primary use cases", value: "Outreach · Research · Prep" },
        { label: "Operating rule", value: "Verify before send" },
      ],
      debrief: [
        "The best AI workflows feel like thinking faster, not like “using a tool.”",
        "Clear prompts mirror clear discovery questions — the same skill shows up in sales calls.",
        "Automation without quality checks produces confident garbage; always verify customer-facing output.",
      ],
    },
  },
  {
    id: "neural-nexus-vault",
    title: "Neural Nexus Vault (Obsidian + WSL)",
    description:
      "A living second brain in Obsidian — numbered project zones, Mission Control dashboards, a changelog database, and templates that turn notes into an operating system. Paired with WSL2 for a Linux-native dev loop on Windows: smoother tooling, fewer path surprises, and a single environment for shipping this portfolio and adjacent repos.",
    tags: ["Obsidian", "WSL2", "Markdown", "Dataview", "PKM", "Systems"],
    type: "card",
    metrics: [
      { label: "Vault zones", value: "8+" },
      { label: "Dev environment", value: "WSL2" },
      { label: "Ops layer", value: "Changelog DB" },
    ],
    links: [{ label: "Live portfolio", href: "https://ethanpecora.com" }],
    featured: true,
    impact: "PKM + infra practice — show how I structure work and level up the toolchain",
    category: "systems",
    status: "active",
    liveUrl: "https://ethanpecora.com",
    dossier: {
      fullDescription:
        "Neural Nexus is my Obsidian vault for execution: daily and weekly rhythms, active projects under 03_Projects, a knowledge base, and AI-facing context so agents stay aligned. Recent work includes a **changelog database** (atomic entries + Dataview + per-project registry), **Project Hub** templates, and scaffolding so every mission has a hub note and filtered history. It’s where I practice *systems thinking as software* — structured frontmatter, wikilinks, and queries instead of ad-hoc docs.\n\nOn the **WSL** side, the breakthrough is treating Windows as the shell and Linux as the engine: Node, npm, git, and builds run in a consistent Linux toolchain while files sync cleanly across drives. That cut friction for this portfolio (Vite + Vercel), multi-repo layouts, and terminal-first workflows — closer to what production Linux CI expects.\n\nTogether, Obsidian + WSL is a visible **SWE progression** story: not just shipping features, but tightening the loop between planning, execution, and shipping — the same habits I bring to product teams.",
      results: [
        { label: "Vault structure", value: "Zones + Mission Control" },
        { label: "Changelog", value: "Atomic + Dataview" },
        { label: "Tooling", value: "WSL2 + Linux dev loop" },
        { label: "Through-line", value: "Portfolio ↔ vault" },
      ],
      debrief: [
        "A second brain only works when it’s easier than memory — templates and queries lower the cost of staying honest.",
        "WSL isn’t just convenience; it’s alignment with how servers and CI run your code.",
        "Showing the vault + toolchain on the portfolio proves I can document and ship in the same breath.",
      ],
    },
  },
  {
    id: "neon-nexus",
    title: "Neon Nexus (Portfolio OS)",
    description:
      "This site — a React 19 + Vite 6 operator portfolio with Tailwind v4, Framer Motion, Three.js hero, SSE-backed Echo AI (Llama 3.1 70B via UF Navigator), and an arcade launcher for Signal Breach. Includes a private Operator Panel (GitHub OAuth) for integrations, env checks, and Notion-backed workflows.",
    tags: ["React 19", "TypeScript", "R3F", "Tailwind v4", "Vercel"],
    type: "card",
    metrics: [
      { label: "Mission archive", value: "7" },
      { label: "Echo AI", value: "SSE stream" },
      { label: "3D hero", value: "R3F + drei" },
    ],
    links: [{ label: "Source", href: "https://github.com/ewilliep99" }],
    featured: true,
    impact: "Full-stack marketing surface + interactive Echo + playable arcade",
    category: "systems",
    status: "active",
    liveUrl: "https://ewilliep99.github.io",
    githubUrl: "https://github.com/ewilliep99",
    dossier: {
      fullDescription:
        "Neon Nexus is the live portfolio and product demo: sectioned narrative (hero, timeline, mission archive, skills, contact), persistent HUD navigation, theme modes (neon default, matrix, clean, ember), and a terminal-inspired command layer. The 3D hero uses React Three Fiber with adaptive quality and scroll-linked camera evolution. Echo AI streams assistant replies over SSE from a Vercel serverless route to UF’s Navigator API (Llama 3.1 70B), with client-side history and context-aware prompts by section. The arcade embeds Signal Breach (Phaser) behind a CRT launcher with shared layout transitions. The Operator Panel (private /operator-panel) centralizes env visibility, route checks, and server-side Notion + Navigator orchestration. Built to read as both recruiter-ready proof and an honest snapshot of how I ship interfaces, motion, and light backend glue.",
      results: [
        { label: "Front-end stack", value: "React 19 · TS 5.7 · Vite 6" },
        { label: "Visual systems", value: "Tailwind v4 · Framer Motion 12" },
        { label: "3D", value: "R3F 9 · drei · postprocessing" },
        { label: "AI + deploy", value: "SSE · Vercel · Navigator API" },
      ],
      debrief: [
        "Lazy-loading heavy chunks (hero scene, modals, games) kept first paint acceptable while still showing depth.",
        "CSS-variable-first Tailwind v4 made theme modes maintainable without parallel style systems.",
        "Echo proves I can wire real auth-adjacent constraints (rate limits, streaming UX) — not just static marketing pages.",
      ],
    },
  },
];

export const projectCategories = [
  { id: "all", label: "All Missions" },
  { id: "sales", label: "Sales & GTM" },
  { id: "ai", label: "AI & Data" },
  { id: "systems", label: "Systems" },
] as const;
