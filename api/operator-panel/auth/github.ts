import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildLogOAuthRedirectUri } from "../../../src/operator-panel/server/buildLogPublicPaths";
import { getPublicOrigin } from "../../../src/operator-panel/server/session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send("GITHUB_CLIENT_ID not configured");
  }
  const origin = getPublicOrigin(req);
  const redirectUri = buildLogOAuthRedirectUri(origin);
  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    "&scope=read:user";
  res.status(302).setHeader("Location", url).end();
}
