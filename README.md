# Neon Nexus — Personal Portfolio

Cyberpunk-themed portfolio site for Ethan Pecora. Built with React 19, TypeScript, Vite 6, and Tailwind CSS v4.

## Tech Stack

- **Frontend**: React 19 + TypeScript (strict) + Vite 6
- **Styling**: Tailwind CSS v4 with custom theme system (Neon / Matrix / Clean)
- **Animation**: Framer Motion 12 for UI, Three.js + React Three Fiber for 3D hero
- **AI Chat**: Echo AI v2 — streaming chat powered by UF Navigator API (Llama 3.1 70B)
- **Forms**: react-hook-form + Zod validation, EmailJS for contact
- **Deployment**: Vercel (serverless functions for Echo API)
- **Games**: 2 browser games served from `/public/games/` (Signal Breach, Aether Descent)

## Project Structure

```
src/
├── components/
│   ├── 3d/              # Three.js hero scene
│   ├── echo/            # Echo AI chat (orchestrator, chat, input, orb)
│   ├── effects/         # DataStream, CircuitGrid, GlitchText, MatrixRain, etc.
│   ├── hud/             # NavigationProvider, TopCommandBar, VerticalTimeline
│   ├── modals/          # MissionDossierModal, GameLauncherModal
│   ├── sections/        # Hero, About, Timeline, Skills, Projects, Games, Contact, Footer
│   └── ui/              # HoloCard, Card, Button, NeonCursor, AnimatedSection, etc.
├── data/                # bio.ts, projects.ts, games.ts, skills.ts, timeline.ts, echoKnowledge.ts
├── hooks/               # useMousePosition, useReducedMotion, useFocusTrap
└── lib/                 # animations.ts, utils.ts
api/
└── echo.ts              # Vercel serverless function — Navigator API proxy with SSE streaming
public/
└── games/               # Signal Breach, Aether Descent (static Phaser games)
```

## Themes

Three visual modes, cycled via the top command bar:

- **Neon** (default) — Cyan/purple cyberpunk with scanlines and circuit grid
- **Matrix** — Green terminal aesthetic with matrix rain
- **Clean** — Soft light mode with blue cursor glow, 


## Running Locally

```bash
npm install
npm run dev
```

The dev server includes a middleware that proxies `/api/*` requests to the Vercel serverless functions, so Echo AI works locally without `vercel dev`.

Requires a `.env.local` with `NAVIGATOR_API_KEY` for Echo AI to function.

## Building

```bash
npm run build
```

Output goes to `dist/` for the frontend and `.vercel/output/functions/` for serverless functions.

## Key Features

- **3D Hero** — Interactive Three.js scene with particle field fallback on mobile
- **Echo AI v2** — Streaming responses, sessionStorage persistence, keyboard shortcuts (backtick / Ctrl+K), context-aware prompts, retry on failure
- **NeonCursor** — GPU-accelerated custom cursor with theme-aware colors, mode labels (SELECT/HACK), lerp-smoothed animation
- **Skills** — 33 skills across 5 domains with animated bar charts and detail modals
- **Projects** — Swipeable carousel with dossier modals, category filters
- **Games** — CRT-styled game cards with iframe launcher and localStorage high scores
- **Responsive** — Full mobile menu, touch-friendly carousel, responsive grid layouts
