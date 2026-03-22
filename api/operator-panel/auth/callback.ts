import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildLogAppUrl, buildLogOAuthRedirectUri } from "../../../src/operator-panel/server/buildLogPublicPaths";
import {
  getPublicOrigin,
  parseAllowedGitHubIds,
  setSessionCookie,
  signSession,
} from "../../../src/operator-panel/server/session";
import {
  operatorPanelAllowedGithubIds,
  operatorPanelSessionSecret,
} from "../../../src/operator-panel/server/env";

interface GitHubUser {
  id: number;
  login: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = operatorPanelSessionSecret();
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!secret || !clientId || !clientSecret) {
    return res.status(500).send("Build Log auth env not configured");
  }

  const code = typeof req.query.code === "string" ? req.query.code : undefined;
  if (!code) {
    return res.status(400).send("Missing code");
  }

  const origin = getPublicOrigin(req);
  const redirectUri = buildLogOAuthRedirectUri(origin);

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });

  const tokenJson = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenRes.ok || !tokenJson.access_token) {
    return res.status(401).send(tokenJson.error || "Token exchange failed");
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "personal-website-operator-panel",
    },
  });

  if (!userRes.ok) {
    return res.status(401).send("GitHub user fetch failed");
  }

  const user = (await userRes.json()) as GitHubUser;
  const idStr = String(user.id);
  const allowed = parseAllowedGitHubIds(operatorPanelAllowedGithubIds());
  if (allowed.size === 0 || !allowed.has(idStr)) {
    return res.status(403).send("Not authorized for Build Log");
  }

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const token = signSession({ sub: idStr, login: user.login, exp }, secret);
  setSessionCookie(res, token);

  const next = buildLogAppUrl(origin);
  res.status(302).setHeader("Location", next).end();
}
