import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getOperatorPanelUser } from "../../src/operator-panel/server/session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const s = getOperatorPanelUser(req);
  if (!s) {
    return res.status(401).json({ ok: false });
  }
  return res.status(200).json({ ok: true, login: s.login, sub: s.sub });
}
