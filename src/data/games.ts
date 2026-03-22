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
  controls?: string[];
  specs?: string[];
}

export const games: Game[] = [
  {
    id: "signal-breach",
    title: "Signal Breach",
    description:
      "Typing-defense terminal sim: Freeplay for endless waves and high-score runs, or Ramp Up — eight steps with 1·3·5·8·13·21·34·50 words each; the whole step shows as one on-screen block (paragraph) you type through in order, with per-word breach windows.",
    status: "live",
    tech: ["JavaScript", "Tailwind CDN", "Web Audio"],
    links: [
      { label: "Play", href: "/games/signal-breach/" },
    ],
    highlight: "Freeplay benchmark · Ramp Up (Fibonacci-style block) · expanded lexicon",
    controls: [
      "Type the target word; auto-locks on full match",
      "Freeplay: waves scale every 3 words; integrity drains over time",
      "Ramp Up: full step visible as a block; type each word in sequence",
      "ESC pause · Ramp Up needs a desktop keyboard",
    ],
    specs: [
      "Dual mode: endless benchmark vs. 8-step ramp with on-screen word blocks",
      "Per-step pools, timers, and narrative interstitials",
      "Combo decay, accuracy tracking, local run history",
    ],
  },
];
