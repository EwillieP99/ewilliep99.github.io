/**
 * Prefer OPERATOR_PANEL_*; fall back to legacy BUILD_LOG_* for a smooth Vercel env cutover.
 */
export function operatorPanelSessionSecret(): string | undefined {
  return process.env.OPERATOR_PANEL_SESSION_SECRET || process.env.BUILD_LOG_SESSION_SECRET;
}

export function operatorPanelPublicUrl(): string | undefined {
  return process.env.OPERATOR_PANEL_PUBLIC_URL || process.env.BUILD_LOG_PUBLIC_URL;
}

export function operatorPanelAllowedGithubIds(): string | undefined {
  return process.env.OPERATOR_PANEL_ALLOWED_GITHUB_IDS || process.env.BUILD_LOG_ALLOWED_GITHUB_IDS;
}

export function operatorPanelDevBypassEnabled(): boolean {
  const v =
    process.env.OPERATOR_PANEL_DEV_BYPASS?.trim() || process.env.BUILD_LOG_DEV_BYPASS?.trim();
  return v === "1" && process.env.VERCEL !== "1";
}

export function operatorPanelDevBypassSub(): string {
  return (
    process.env.OPERATOR_PANEL_DEV_BYPASS_SUB?.trim() ||
    process.env.BUILD_LOG_DEV_BYPASS_SUB?.trim() ||
    "0"
  );
}

export function operatorPanelDevBypassLogin(): string {
  return (
    process.env.OPERATOR_PANEL_DEV_BYPASS_LOGIN?.trim() ||
    process.env.BUILD_LOG_DEV_BYPASS_LOGIN?.trim() ||
    "local-dev"
  );
}
