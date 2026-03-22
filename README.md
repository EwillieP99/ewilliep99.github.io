# Neon Nexus — Personal Portfolio

Cyberpunk-themed portfolio site for Ethan Pecora. Built with React 19, TypeScript, Vite 6, and Tailwind CSS v4.

## Tech Stack

- **Frontend**: React 19 + TypeScript (strict) + Vite 6
- **Styling**: Tailwind CSS v4 with custom theme system (Neon / Matrix / Clean)
- **Animation**: Framer Motion 12 for UI, Three.js + React Three Fiber for 3D hero
- **AI Chat**: Echo AI v2 — streaming chat powered by UF Navigator API (Llama 3.1 70B)
- **Forms**: react-hook-form + Zod validation, EmailJS for contact
- **Deployment**: Vercel (serverless functions for Echo API and Build Log)
- **Routing**: `react-router-dom` — portfolio at `/`, private **Build Log** dev dashboard at `/build-log`
- **Games**: Signal Breach in `/public/games/`; optional second arcade slot is reserved for a future experiment

## Project Structure

Section order and HUD codes are defined once in `src/data/navSections.ts` (includes **MISSIONS** / `#projects` between Skills and Arcade).

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
├── echo.ts              # Navigator API proxy (SSE)
└── build-log/           # GitHub OAuth + session + env-check, route-check, build-meta
src/build-log/           # Build Log UI (sidebar, 12 panels, lazy-loaded)
public/
└── games/               # Signal Breach (static Phaser/HTML)
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

### Build Log (`/build-log`)

Private developer dashboard (collapsible sidebar, lazy panels, always-on error capture). **Not linked from the public site.** In production, access uses **GitHub OAuth**; only numeric user IDs listed in `BUILD_LOG_ALLOWED_GITHUB_IDS` may complete login.

#### Local dev without OAuth (optional)

Add **`BUILD_LOG_DEV_BYPASS=1`** to `.env.local` only. The server treats you as signed in when **`VERCEL` is not `1`**, so this never applies on Vercel. You do not need `GITHUB_*`, `BUILD_LOG_SESSION_SECRET`, or `BUILD_LOG_ALLOWED_GITHUB_IDS` on your machine for Build Log if you use bypass. Optional: `BUILD_LOG_DEV_BYPASS_SUB` and `BUILD_LOG_DEV_BYPASS_LOGIN` override the fake user id and login label (defaults `0` and `local-dev`).

#### Env vars (production / full local OAuth)

Add to `.env.local` and to the Vercel project (except bypass-only keys — never set bypass on Vercel):

| Variable | Purpose |
|----------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | OAuth client secret |
| `BUILD_LOG_SESSION_SECRET` | Long random string — signs the session cookie (HMAC) |
| `BUILD_LOG_ALLOWED_GITHUB_IDS` | Comma-separated GitHub user IDs, e.g. `12345,67890` |
| `BUILD_LOG_PUBLIC_URL` | Optional. Canonical site origin for OAuth callback, e.g. `https://yourdomain.com` (omit trailing slash). If unset, derived from request headers. |
| `BUILD_LOG_DEV_BYPASS` | Optional **local only**: `1` skips OAuth when not on Vercel. |
| `BUILD_LOG_DEV_BYPASS_SUB` | Optional. Fake numeric id string for bypass mode. |
| `BUILD_LOG_DEV_BYPASS_LOGIN` | Optional. Fake GitHub login for bypass mode. |

Register the OAuth app’s **Authorization callback URL** as:

`https://<your-domain>/api/build-log/auth/callback`

For local dev, match the port Vite prints (often 5173). Example:

`http://localhost:5173/api/build-log/auth/callback`

If Vite picks another port (e.g. 5175), add that exact callback URL in the GitHub OAuth app and use the same origin in the browser.

#### Where to find every value for `.env.local`

1. **`NAVIGATOR_API_KEY`** (Echo AI): From your UF Navigator / API provider dashboard where API keys are issued. This repo does not generate it.

2. **`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`**: [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers) → your app (or New OAuth App). After creating the app, the **Client ID** is on the app page; generate a **Client secret** there (shown once — store it in `.env.local` and Vercel).

3. **`BUILD_LOG_ALLOWED_GITHUB_IDS`**: Your GitHub account **numeric** user id (not your handle). Ways to get it:
   - While logged in, open `https://api.github.com/user` with a [personal access token](https://github.com/settings/tokens) in the header `Authorization: Bearer <token>`; the JSON field `id` is the number to paste.
   - Or use a public API: `https://api.github.com/users/<your-github-username>` and read the `id` field (works without auth for public lookups).

4. **`BUILD_LOG_SESSION_SECRET`**: Generate any long random string, e.g. `openssl rand -hex 32`, and use the same value locally and on Vercel so cookies are consistent per environment.

5. **`BUILD_LOG_PUBLIC_URL`**: Your deployed site origin with no path, e.g. `https://your-project.vercel.app`. For local OAuth without bypass, you usually omit this and rely on the request host.

6. **`VITE_EMAILJS_*`**: [EmailJS](https://www.emailjs.com/) dashboard → Email Services / Email Templates / Account → copy **Service ID**, **Template ID**, and **Public Key** into the three `VITE_` variables.

7. **`VERCEL_URL` / `VERCEL_GIT_COMMIT_*`**: Injected automatically on Vercel; you do not put them in `.env.local` unless you want to fake them for testing.

To see which keys are set locally (boolean only, never values), open Build Log with a valid session or dev bypass and use the **Env** panel, or `GET /api/build-log/env-check` while authenticated.

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
