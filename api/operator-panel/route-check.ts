import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOperatorPanelUser, getPublicOrigin } from "../../src/operator-panel/server/session";

const DEFAULT_PATHS = [
  "/",
  "/index.html",
  "/build-log",
  "/api/echo",
  "/games/signal-breach/",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!getOperatorPanelUser(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const origin = getPublicOrigin(req);
  const results: { path: string; status: number | null; ok: boolean; error?: string }[] = [];

  for (const p of DEFAULT_PATHS) {
    const url = `${origin}${p}`;
    try {
      const method = p === "/api/echo" ? "OPTIONS" : "HEAD";
      const r = await fetch(url, {
        method,
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
      const status = r.status;
      const ok = status >= 200 && status < 400;
      results.push({ path: p, status, ok });
    } catch (e) {
      results.push({
        path: p,
        status: null,
        ok: false,
        error: e instanceof Error ? e.message : "fetch failed",
      });
    }
  }

  return res.status(200).json({ origin, results });
}
