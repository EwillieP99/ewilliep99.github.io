import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  operatorPanelDevBypassEnabled,
  operatorPanelDevBypassLogin,
  operatorPanelDevBypassSub,
  operatorPanelPublicUrl,
  operatorPanelSessionSecret,
} from "./env";

export const OPERATOR_PANEL_COOKIE = "operator_panel_session";
const MAX_AGE_SEC = 7 * 24 * 60 * 60;

export function getPublicOrigin(req: VercelRequest): string {
  const fromEnv = operatorPanelPublicUrl()?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const xf = req.headers["x-forwarded-proto"];
  const proto = (Array.isArray(xf) ? xf[0] : xf) || "http";
  const host = req.headers.host || "localhost:5173";
  return `${proto}://${host}`;
}

export function getCookieHeader(req: VercelRequest): string | undefined {
  const c = req.headers.cookie;
  if (!c) return undefined;
  return Array.isArray(c) ? c.join("; ") : c;
}

export function getSessionTokenFromCookie(cookieHeader: string | undefined): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    if (name === OPERATOR_PANEL_COOKIE) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

export function signSession(
  payload: { sub: string; login: string; exp: number },
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(
  token: string,
  secret: string,
): { sub: string; login: string; exp: number } | null {
  const i = token.lastIndexOf(".");
  if (i <= 0) return null;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      sub: string;
      login: string;
      exp: number;
    };
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (typeof data.sub !== "string" || typeof data.login !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

export function parseAllowedGitHubIds(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function getSession(req: VercelRequest): { sub: string; login: string } | null {
  const secret = operatorPanelSessionSecret();
  if (!secret) return null;
  const raw = getSessionTokenFromCookie(getCookieHeader(req));
  if (!raw) return null;
  const v = verifySession(raw, secret);
  if (!v) return null;
  return { sub: v.sub, login: v.login };
}

/** Local-only: skip OAuth when dev bypass is on and not running on Vercel. */
export function isOperatorPanelDevBypass(): boolean {
  return operatorPanelDevBypassEnabled();
}

/** Authenticated operator: session cookie or dev bypass identity locally. */
export function getOperatorPanelUser(req: VercelRequest): { sub: string; login: string } | null {
  if (isOperatorPanelDevBypass()) {
    return {
      sub: operatorPanelDevBypassSub(),
      login: operatorPanelDevBypassLogin(),
    };
  }
  return getSession(req);
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  const secure = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  const parts = [
    `${OPERATOR_PANEL_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SEC}`,
  ];
  if (secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(res: VercelResponse): void {
  const secure = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  const parts = [
    `${OPERATOR_PANEL_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}
