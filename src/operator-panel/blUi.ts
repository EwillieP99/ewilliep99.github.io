/**
 * Shared Tailwind class strings for Build Log panels (`.build-log-theme` descendants).
 * Keeps controls visually consistent and avoids copy-paste drift.
 */

const blControlBase =
  "border border-[var(--bl-line-strong)] bg-[var(--bl-bg)] text-[var(--bl-ink)] outline-none focus:border-[var(--bl-accent-dim)]";

/** Primary CTA — teal fill, dark label */
export const blBtnPrimary =
  "rounded-lg bg-[var(--bl-accent)] px-3 py-2 text-sm font-semibold text-[#042f2a] transition-opacity hover:opacity-90 disabled:opacity-40";

/** Selects and single-line text inputs */
export const blField = `rounded-lg ${blControlBase} px-2 py-1.5 text-sm`;

/** Monospace multi-line fields (JSON, experiments list, API body) */
export const blFieldArea = `w-full rounded-xl ${blControlBase} p-3 bl-mono text-xs leading-relaxed`;
