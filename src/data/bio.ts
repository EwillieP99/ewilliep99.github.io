// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Bio & Site Metadata
// ═══════════════════════════════════════════════════════════════════════════════

export const bio = {
  name: "Ethan Pecora",
  firstName: "Ethan",
  initials: "EP",

  // Hero — featured spotlight (scroll target must match a real section id)
  featuredSpotlight: {
    badge: "Live build",
    title: "Resonate",
    /** Short hook under the title */
    tagline: "Mental wellness platform for the UF campus",
    /** One readable paragraph — who it’s for and what ships */
    description:
      "Students get mood-aware sound, RPG-style quests grounded in evidence-based psychology, anonymous peer matching with safeguards, and journey timelines they can share with counselors.",
    /** Scannable proof chips (shown as pills in the banner) */
    highlights: ["~57K students in scope", "3-tier crisis routing", "UF-gated access + safeguards"] as const,
    tags: ["Next.js", "FastAPI", "Supabase", "React 19"] as const,
    scrollToId: "projects" as const,
    ctaLabel: "Open mission dossier",
    ctaHint: "Full write-up, metrics, and stack in the archive",
  },

  // Hero
  headline: "GTM + AI Operator",
  tagline: "Building Revenue Systems That Compound",
  heroOneLiner:
    "I turn AI products into real adoption through sales execution, workshops, and repeatable playbooks.",
  heroSub:
    "B.S. Business Administration @ UF · Fall 2026 · AI Certificate · Open to GTM, sales, and AI strategy roles.",

  // Recruiter-facing blurb
  recruiterBlurb:
    "I blend quota-carrying execution with technical fluency. Recent outcomes include $110K ARR generated in B2B SaaS, 400+ new users driven for Perplexity AI at a 67% conversion rate, and a 500+ attendee multi-org AI event at UF.",

  // About / profile content model
  profileIntro:
    "I am a business operator focused on GTM and AI adoption. My edge is moving across strategy, execution, and communication without handoff friction.",
  profileNarrative:
    "My path moved through real estate, CS, entrepreneurship, and sales. Each chapter added a practical skill: product intuition, technical literacy, persuasion, and systems thinking. That mix helps me translate complex AI capabilities into outcomes teams can measure.",
  specializations: [
    "Technical sales and pipeline creation for B2B tools",
    "Campus and community-led growth programs",
    "AI workflow design for teams and individual operators",
    "Executive-ready storytelling and workshop facilitation",
  ],
  achievements: [
    { label: "ARR Generated", value: "$110K", context: "SDR internship at Geotarget" },
    { label: "Users Driven", value: "400+", context: "Perplexity AI activation campaigns" },
    { label: "Conversion Rate", value: "67%", context: "Workshop-to-signup program performance" },
    { label: "AI Mixer Attendance", value: "500+", context: "Cross-campus event leadership" },
  ],
  currentFocus: [
    "Building scalable GTM systems for AI products",
    "Expanding practical AI literacy through workshops",
    "Shipping productized workflows that reduce decision friction",
  ],

  // Education
  education: {
    degree: "B.S. Business Administration",
    university: "University of Florida",
    gradDate: "Fall 2026",
    certificate: "Artificial Intelligence Certificate",
    certCourses: ["AI Fundamentals", "Business Analytics & AI", "AI Ethics"],
  },

  // Contact & links (email + Calendly are primary on-site; phone available on resume)
  email: "ethan.pecora@ufl.edu",
  linkedinUrl: "https://linkedin.com/in/ethan-pecora",
  githubUrl: "https://github.com/ewilliep99",
  twitterUrl: "https://x.com/EwillieP",
  calendlyUrl: "https://calendly.com/pecoraethan/30min",

  // Assets
  resumePdf: "/resume.pdf",
  avatar: "/assets/IMG_5245.jpeg",

  // Location (school name lives under education.university — keep in sync there)
  major: "Business Administration",
  location: "Gainesville, FL",
} as const;

// Floating stats displayed on the holographic photo card
export const holoStats = [
  { label: "Years in Sales", value: "5+" },
  { label: "UF AI Club", value: "Director · Connections" },
  { label: "ARR Generated", value: "$110K" },
  { label: "Users Driven", value: "400+" },
] as const;
