import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOperatorPanelUser } from "../../src/operator-panel/server/session";

/** Env keys to report presence only (never values). */
const KEYS = [
  "NAVIGATOR_API_KEY",
  "NOTION_API_KEY",
  "NOTION_PROJECTS_DB_ID",
  "NOTION_RUN_LOG_PAGE_ID",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "OPERATOR_PANEL_SESSION_SECRET",
  "OPERATOR_PANEL_ALLOWED_GITHUB_IDS",
  "OPERATOR_PANEL_PUBLIC_URL",
  "VITE_EMAILJS_SERVICE_ID",
  "VITE_EMAILJS_TEMPLATE_ID",
  "VITE_EMAILJS_PUBLIC_KEY",
  "VERCEL_URL",
  "VERCEL_GIT_COMMIT_REF",
  "OPERATOR_PANEL_DEV_BYPASS",
  "OPERATOR_PANEL_DEV_BYPASS_SUB",
  "OPERATOR_PANEL_DEV_BYPASS_LOGIN",
] as const;

function keyPresent(k: (typeof KEYS)[number]): boolean {
  const v = process.env[k];
  if (typeof v === "string" && v.length > 0) return true;
  if (k === "OPERATOR_PANEL_SESSION_SECRET" && process.env.BUILD_LOG_SESSION_SECRET)
    return true;
  if (k === "OPERATOR_PANEL_ALLOWED_GITHUB_IDS" && process.env.BUILD_LOG_ALLOWED_GITHUB_IDS)
    return true;
  if (k === "OPERATOR_PANEL_PUBLIC_URL" && process.env.BUILD_LOG_PUBLIC_URL) return true;
  if (k === "OPERATOR_PANEL_DEV_BYPASS" && process.env.BUILD_LOG_DEV_BYPASS) return true;
  if (k === "OPERATOR_PANEL_DEV_BYPASS_SUB" && process.env.BUILD_LOG_DEV_BYPASS_SUB) return true;
  if (k === "OPERATOR_PANEL_DEV_BYPASS_LOGIN" && process.env.BUILD_LOG_DEV_BYPASS_LOGIN)
    return true;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!getOperatorPanelUser(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const present: Record<string, boolean> = {};
  for (const k of KEYS) {
    present[k] = keyPresent(k);
  }
  return res.status(200).json({ keys: present });
}
