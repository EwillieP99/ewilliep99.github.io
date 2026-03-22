/** Public URL paths for the Build Log app (must match React Router and GitHub OAuth callback). */

export const BUILD_LOG_APP_PATH = "/build-log";

/** Path-only (no origin); GitHub OAuth app must list `${origin}${BUILD_LOG_OAUTH_CALLBACK_PATH}`. */
export const BUILD_LOG_OAUTH_CALLBACK_PATH = "/api/build-log/auth/callback";

export function buildLogOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/$/, "")}${BUILD_LOG_OAUTH_CALLBACK_PATH}`;
}

export function buildLogAppUrl(origin: string): string {
  return `${origin.replace(/\/$/, "")}${BUILD_LOG_APP_PATH}`;
}
