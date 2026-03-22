// Site navigation — single source of truth for section IDs, HUD codes, and labels.
// Order matches scroll order in App.tsx.

export const NAV_SECTIONS = [
  { id: "home", code: "01", label: "HOME" },
  { id: "about", code: "02", label: "PROFILE" },
  { id: "timeline", code: "03", label: "WORK" },
  { id: "augmentations", code: "04", label: "SKILLS" },
  { id: "projects", code: "05", label: "MISSIONS" },
  { id: "games", code: "06", label: "PLAY" },
  { id: "contact", code: "07", label: "CONTACT" },
  { id: "ai", code: "08", label: "ECHO" },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]["id"];

/** Section header codename, e.g. "// 05" — matches top nav / rail */
export function navCodename(id: SectionId): string {
  const s = NAV_SECTIONS.find((n) => n.id === id);
  return s ? `// ${s.code}` : "// —";
}
