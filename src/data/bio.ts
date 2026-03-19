// ═══════════════════════════════════════════════════════════════════════════════
// NEON NEXUS — Bio & Site Metadata
// ═══════════════════════════════════════════════════════════════════════════════

export const bio = {
  name: "Ethan Pecora",
  firstName: "Ethan",
  initials: "EP",

  // Hero
  headline: "Neon Operator",
  tagline: "Closing Tomorrow's Deals Today",
  heroOneLiner:
    "I build communities, close deals, and make AI make sense.",
  heroSub:
    "Business Administration @ UF · Graduating Fall 2026 · AI Certificate · Tech sales & GTM operator.",

  // Recruiter-facing blurb
  recruiterBlurb:
    "Generated $110K ARR in B2B SaaS sales, drove 400+ new users at Perplexity AI with a 67% conversion rate, and organized a 500+ attendee AI mixer. Graduating Fall 2026 with an AI Certificate from the University of Florida. Open to full-time roles in tech sales, GTM, and AI strategy.",

  // About / origin story
  originStory: `I went from real estate to computer science to entrepreneurship to professional selling — and chose Mass Communications because every pivot added a tool to the kit. Each one taught me something: how products get built, how they get sold, and how complex ideas become stories that move people to action.`,

  originStory2: `I sell, I build systems, and I get things across the finish line.\n\nThat's not a tagline — it's what the numbers show. $110K in ARR as a sales development intern at Geotarget. 400+ new users at Perplexity AI with a 67% conversion rate across 15 workshops. A 500+ attendee AI mixer that brought together 8 student orgs, 12 campus partners, and 5 industry sponsors.`,

  traits: [
    "Solution Seller — I listen first, then prescribe",
    "Public Speaker — 15 workshops, 600+ students, comfortable on stage",
    "AI-Fluent — I ship with it daily, from prompt chains to automated workflows",
    "Systems Builder — I create repeatable processes before I scale effort",
  ],

  // Education
  education: {
    degree: "B.S. Business Administration",
    university: "University of Florida",
    gradDate: "Fall 2026",
    certificate: "Artificial Intelligence Certificate",
    certCourses: ["AI Fundamentals", "Business Analytics & AI", "AI Ethics"],
  },

  // Contact & links
  email: "ethan.pecora@ufl.edu",
  phone: "6303346574",
  linkedinUrl: "https://linkedin.com/in/ethan-pecora",
  githubUrl: "https://github.com/ewilliep99",
  twitterUrl: "https://twitter.com/EwillieP",
  calendlyUrl: "https://calendly.com/pecoraethan/30min",

  // Assets
  resumePdf: "/resume.pdf",
  avatar: "/assets/IMG_5245.jpeg",

  // Location
  university: "University of Florida",
  major: "Business Administration",
  location: "Gainesville, FL",
} as const;

// Floating stats displayed on the holographic photo card
export const holoStats = [
  { label: "Years in Sales", value: "5+" },
  { label: "AI Club", value: "Director" },
  { label: "ARR Generated", value: "$110K" },
  { label: "Users Driven", value: "400+" },
] as const;
