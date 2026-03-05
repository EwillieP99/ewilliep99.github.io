import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION PROVIDER — Active section tracking via IntersectionObserver
// ═══════════════════════════════════════════════════════════════════════════════

export const NAV_SECTIONS = [
  { id: "about", code: "01", label: "PROFILE" },
  { id: "timeline", code: "02", label: "CHRONO LOG" },
  { id: "augmentations", code: "03", label: "AUGMENTATIONS" },
  { id: "projects", code: "04", label: "MISSION ARCHIVE" },
  { id: "games", code: "05", label: "ARCADE" },
  { id: "contact", code: "06", label: "UPLINK" },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]["id"];

interface NavigationContextValue {
  activeId: SectionId;
  scrollTo: (id: string) => void;
  scrollProgress: number; // 0–1 overall page progress
}

const NavigationContext = createContext<NavigationContextValue>({
  activeId: "about",
  scrollTo: () => {},
  scrollProgress: 0,
});

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<SectionId>("about");
  const [scrollProgress, setScrollProgress] = useState(0);

  // IntersectionObserver for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll progress tracker
  useEffect(() => {
    const handler = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <NavigationContext.Provider value={{ activeId, scrollTo, scrollProgress }}>
      {children}
    </NavigationContext.Provider>
  );
}
