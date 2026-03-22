import { useState, useCallback, useEffect } from "react";
import {
  skillCapabilities,
  SKILL_DOMAIN_META,
  SKILL_DOMAIN_ORDER,
} from "@/data/skills";

const HISTORY_STORAGE_KEY = "neon-nexus-terminal-history";
const MAX_HISTORY = 40;

export interface TerminalLine {
  type: "input" | "output" | "system";
  text: string;
  /** Show “Open Echo” affordance after truncated echo reply */
  openEchoHint?: boolean;
}

interface TerminalReturn {
  lines: TerminalLine[];
  input: string;
  setInput: (val: string) => void;
  handleCommand: (cmd: string) => Promise<void>;
  applyHistory: (direction: "up" | "down") => void;
  autocomplete: () => void;
  clearTerminal: () => void;
}

function buildSkillsCommandLines(): string[] {
  const lines: string[] = [
    "╔═ TOP CAPABILITIES BY DOMAIN ═══════════════════╗",
  ];
  for (const d of SKILL_DOMAIN_ORDER) {
    const label = SKILL_DOMAIN_META[d].label.toUpperCase();
    lines.push(`║ ► ${label}`);
    const top = skillCapabilities.filter((c) => c.domain === d).slice(0, 3);
    for (let i = 0; i < top.length; i++) {
      lines.push(`║   ${i + 1}. ${top[i].title} (${top[i].strength})`);
    }
    if (top.length === 0) lines.push("║   —");
  }
  lines.push("╚════════════════════════════════════════════════╝", "", "Scrolling to Skills…");
  return lines;
}

// Available terminal commands and their responses
const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help      — Show this help menu",
    "  about     — Learn about Ethan",
    "  skills    — Top capabilities by domain + scroll to Skills",
    "  work      — Open mission archive (projects grid)",
    "  timeline  — Open Chrono Log (experience & education)",
    "  play      — Open arcade",
    "  contact   — Get in touch",
    "  ai        — Open Echo AI",
    "  resume    — Download resume",
    "  clear     — Clear terminal",
    "  matrix    — Toggle Matrix ↔ Neon",
    "  theme     — Cycle themes, or: theme neon|matrix|clean|gator|ember",
    "  echo ...  — Ask Echo from terminal (long replies truncated)",
  ],
  about: [
    "┌─ OPERATOR PROFILE ─────────────────────────┐",
    "│ Name:     Ethan Pecora                      │",
    "│ Base:     University of Florida              │",
    "│ Degree:   B.S. Business Administration       │",
    "│ Cert:     Artificial Intelligence             │",
    "│ Status:   Graduating Fall 2026                │",
    "│                                               │",
    "│ Sales results meet AI fluency.                │",
    "│ $110K ARR · 400+ users · 67% conversion       │",
    "└───────────────────────────────────────────────┘",
  ],
  skills: buildSkillsCommandLines(),
  work: [
    "Loading mission archive…",
    "",
    "Open the grid below for full dossiers, metrics, and tags.",
    "",
    "Preview:",
    "  · Resonate — wellness stack for UF",
    "  · Notion Life OS — personal operating system",
    "  · Comet dashboards — campus GTM analytics",
    "",
    "Scrolling to MISSIONS…",
  ],
  timeline: [
    "Loading Chrono Log…",
    "",
    "Experience, education, and leadership — expandable entries by year.",
    "",
    "Scrolling to WORK…",
  ],
  play: [
    "Booting arcade deck...",
    "",
    "[01] Signal Breach        — Typing-defense (browser)",
    "[02] Next module          — Slot reserved (coming soon)",
    "",
    "Scroll to PLAY — launch from CRT cards.",
  ],
  contact: [
    "┌─ UPLINK CHANNELS ────────────────────────┐",
    "│ Email:    ethan.pecora@ufl.edu            │",
    "│ LinkedIn: linkedin.com/in/ethan-pecora    │",
    "│ GitHub:   github.com/ewilliep99           │",
    "└───────────────────────────────────────────┘",
    "",
    "Or scroll to the contact section below.",
  ],
  resume: [
    "Initiating download sequence...",
    "► resume.pdf — deploying to your system...",
  ],
  ai: [
    "Opening Echo…",
    "Tip: ` toggles chat · ⌘/Ctrl+K opens from anywhere.",
  ],
  echo: [
    "Echo AI bridge online.",
    "",
    "I can tell you about Ethan's experience,",
    "projects, and what makes him tick.",
    "",
    "Try: 'echo tell me about perplexity'",
    "     'echo what are your strengths'",
    "",
    "Long answers are truncated here — use Echo for full text.",
  ],
};

const BOOT_SEQUENCE: TerminalLine[] = [
  { type: "system", text: "NEON NEXUS Terminal v2.0" },
  { type: "system", text: "System initialized. Welcome, Operator." },
  { type: "system", text: 'Type "help" for available commands.' },
  { type: "system", text: "" },
];

function loadHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
        return parsed.slice(-MAX_HISTORY);
      }
    }
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(entries: string[]) {
  try {
    sessionStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(entries.slice(-MAX_HISTORY)),
    );
  } catch {
    // ignore
  }
}

const ECHO_TERMINAL_MAX = 480;

/** Interactive terminal hook with command processing */
export function useTerminal(): TerminalReturn {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_SEQUENCE);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const commandKeys = Object.keys(COMMANDS).concat([
    "theme",
    "matrix",
    "neon",
    "clean",
    "ember",
    "gator",
  ]);

  const applyHistory = useCallback(
    (direction: "up" | "down") => {
      if (history.length === 0) return;

      if (direction === "up") {
        const nextIndex =
          historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex] ?? "");
        return;
      }

      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setInput(history[history.length - 1 - nextIndex] ?? "");
    },
    [history, historyIndex],
  );

  const autocomplete = useCallback(() => {
    const value = input.trim().toLowerCase();
    if (!value || value.includes(" ")) return;
    const matches = commandKeys.filter((cmd) => cmd.startsWith(value));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      setLines((prev) => [
        ...prev,
        { type: "output", text: `Matches: ${matches.join(", ")}` },
      ]);
    }
  }, [commandKeys, input]);

  const handleCommand = useCallback(async (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const newLines: TerminalLine[] = [{ type: "input", text: `> ${rawCmd}` }];
    setHistory((prev) => {
      const next = [...prev, rawCmd];
      saveHistory(next);
      return next;
    });
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setLines(BOOT_SEQUENCE);
      setInput("");
      return;
    }

    if (cmd === "resume") {
      newLines.push(
        ...COMMANDS.resume.map((text) => ({ type: "output" as const, text })),
      );
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = "/resume.pdf";
        link.download = "Ethan_Pecora_Resume.pdf";
        link.click();
      }, 500);
    } else if (cmd === "matrix") {
      newLines.push({ type: "system", text: "Toggling Matrix mode..." });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggle-theme", { detail: "toggle-matrix" }));
      }, 300);
    } else if (cmd === "neon" || cmd === "ember") {
      newLines.push({ type: "system", text: `Applying ${cmd} theme...` });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggle-theme", { detail: `set:${cmd}` }));
      }, 200);
    } else if (cmd === "clean") {
      newLines.push({ type: "system", text: "Applying clean theme..." });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggle-theme", { detail: "set:clean" }));
      }, 200);
    } else if (cmd === "gator") {
      newLines.push({ type: "system", text: "Applying Gator theme (UF orange & blue)..." });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("toggle-theme", { detail: "set:gator" }));
      }, 200);
    } else if (cmd.startsWith("theme")) {
      const rest = cmd.slice(5).trim();
      if (rest === "" || rest === "cycle") {
        newLines.push({ type: "system", text: "Cycling theme..." });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("toggle-theme", { detail: "cycle" }));
        }, 300);
      } else if (
        rest === "neon" ||
        rest === "matrix" ||
        rest === "clean" ||
        rest === "ember" ||
        rest === "gator"
      ) {
        newLines.push({ type: "system", text: `Applying ${rest} theme...` });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("toggle-theme", { detail: `set:${rest}` }));
        }, 200);
      } else {
        newLines.push({
          type: "output",
          text: 'Unknown theme. Use: theme neon | matrix | clean | gator | ember — or "theme" to cycle.',
        });
      }
    } else if (cmd in COMMANDS) {
      newLines.push(
        ...COMMANDS[cmd].map((text) => ({ type: "output" as const, text })),
      );
      if (cmd === "ai") {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-echo"));
        }, 200);
      }
    } else if (cmd.startsWith("echo ")) {
      const query = rawCmd.trim().slice(5);
      newLines.push({ type: "system", text: `Echo bridge: ${query}` });
      try {
        const response = await fetch("/api/echo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stream: false,
            messages: [{ role: "user", content: query }],
          }),
        });
        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
        const data = await response.json();
        const text = typeof data.message === "string" ? data.message : "No response.";
        const truncated = text.length > ECHO_TERMINAL_MAX;
        const visible = truncated
          ? `${text.slice(0, ECHO_TERMINAL_MAX).trimEnd()}…`
          : text;
        newLines.push({ type: "output", text: visible });
        if (truncated) {
          newLines.push({
            type: "system",
            text: `[${text.length - ECHO_TERMINAL_MAX} more characters — open Echo for full reply]`,
            openEchoHint: true,
          });
        }
      } catch {
        newLines.push({
          type: "output",
          text: "Echo link unavailable. Use Ask Echo in the header or open Echo with ⌘/Ctrl+K.",
        });
      }
    } else {
      newLines.push({
        type: "output",
        text: `Command not found: "${cmd}". Type "help" for available commands.`,
      });
    }

    const navTarget: Record<string, string> = {
      work: "projects",
      timeline: "timeline",
      play: "games",
      contact: "contact",
      skills: "augmentations",
    };
    if (navTarget[cmd]) {
      setTimeout(() => {
        const el = document.getElementById(navTarget[cmd]);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput("");
  }, []);

  const clearTerminal = useCallback(() => {
    setLines(BOOT_SEQUENCE);
  }, []);

  return { lines, input, setInput, handleCommand, applyHistory, autocomplete, clearTerminal };
}
