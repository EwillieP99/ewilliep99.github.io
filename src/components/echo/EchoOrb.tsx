import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";

interface EchoOrbProps {
  onClick: () => void;
  isClean: boolean;
}

export function EchoOrb({ onClick, isClean }: EchoOrbProps) {
  return (
    <Magnetic
      className="md:hidden fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999]"
      innerClassName="flex items-center justify-center"
    >
    <motion.button
      onClick={onClick}
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-4 hover:scale-110 active:scale-95 transition-all ${
        isClean
          ? "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 shadow-[0_0_30px_rgba(56,189,248,0.4),0_0_60px_rgba(99,102,241,0.2)] border-white/80"
          : "bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_50px_#22f0ff,0_0_80px_#c026d3] border-black"
      }`}
      whileHover={{ scale: 1.15, rotate: 12 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Open Echo AI chat"
    >
      <Bot
        size={30}
        className={`drop-shadow-lg sm:hidden ${isClean ? "text-white" : "text-black"}`}
      />
      <Bot
        size={34}
        className={`drop-shadow-lg hidden sm:block ${isClean ? "text-white" : "text-black"}`}
      />
    </motion.button>
    </Magnetic>
  );
}
