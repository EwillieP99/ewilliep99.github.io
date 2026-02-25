import { useState, useEffect, useCallback } from "react";

interface GlitchReturn {
  isGlitching: boolean;
  triggerGlitch: () => void;
  glitchClass: string;
}

/** Triggers a short glitch animation on demand or on mount */
export function useGlitch(glitchOnMount = false): GlitchReturn {
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  }, []);

  useEffect(() => {
    if (glitchOnMount) {
      const timer = setTimeout(triggerGlitch, 200);
      return () => clearTimeout(timer);
    }
  }, [glitchOnMount, triggerGlitch]);

  return {
    isGlitching,
    triggerGlitch,
    glitchClass: isGlitching ? "animate-[glitch_0.3s_ease-in-out]" : "",
  };
}
