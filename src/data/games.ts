export interface GameLink {
  label: string;
  href: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  status: "live" | "coming-soon";
  tech: string[];
  links: GameLink[];
  highlight: string;
  // Extended data for full-screen game view
  controls?: string[];
  specs?: string[];
}

export const games: Game[] = [
  {
    id: "signal-breach",
    title: "Signal Breach",
    description:
      "Neon typing-defense arcade game with wave progression, combo scoring, and integrity decay. Built as a fast replay loop with cyber-terminal UI.",
    status: "live",
    tech: ["JavaScript", "Tailwind", "Arcade Loop"],
    links: [
      { label: "Play", href: "/games/signal-breach/" },
    ],
    highlight: "Live now · wave + accuracy + combo systems",
    controls: ["Type words to decode signals", "Accuracy builds combo multiplier", "ESC to pause"],
    specs: ["Wave progression system", "Combo scoring engine", "Integrity decay mechanic", "Cyber-terminal UI"],
  },
  {
    id: "aether-descent",
    title: "Aether Descent",
    description:
      "Physics-based precision lander with 12 planets, upgradeable probe, hazard systems, and endless mode. Land gently, collect shards, survive everything.",
    status: "live",
    tech: ["Phaser 3", "Matter.js", "Web Audio"],
    links: [
      { label: "Play", href: "/games/aether-descent/" },
    ],
    highlight: "Live now · 12 planets · upgrades · endless mode",
    controls: ["Arrow keys / WASD for thrust", "Land gently on platforms", "Collect energy shards"],
    specs: ["12 unique planets", "Probe upgrade system", "Hazard & weather systems", "Endless survival mode"],
  },
];
