export type ThemeMode = "neon" | "matrix" | "clean" | "ember" | "gator";

export const THEME_STORAGE_KEY = "site-theme-mode";

/** Canonical order for cycling (terminal / keyboard) */
export const THEME_ORDER: ThemeMode[] = ["neon", "matrix", "clean", "gator", "ember"];

export function parseSavedTheme(raw: string | null): ThemeMode {
  if (raw === "neon" || raw === "matrix" || raw === "clean" || raw === "ember" || raw === "gator")
    return raw;
  return "neon";
}

export function isLightTheme(mode: ThemeMode): boolean {
  return mode === "clean" || mode === "gator";
}
