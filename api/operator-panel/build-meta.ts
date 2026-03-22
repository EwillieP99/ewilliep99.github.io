import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOperatorPanelUser } from "../../src/operator-panel/server/session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!getOperatorPanelUser(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const ref = process.env.VERCEL_GIT_COMMIT_REF;
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE;
  const author = process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN;

  return res.status(200).json({
    source: sha || ref || message ? "vercel_git" : "none",
    commitSha: sha || null,
    commitRef: ref || null,
    commitMessage: message || null,
    commitAuthor: author || null,
    generatedAt: new Date().toISOString(),
    note:
      "On Vercel, git metadata is injected automatically. Locally, fields may be empty.",
  });
}
