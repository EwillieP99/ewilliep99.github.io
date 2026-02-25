import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Image, Clock, Sparkles, Lock, HardDrive, Cloud } from "lucide-react";
import { storageStats } from "../../data/photos.js";

const FILTER_ICONS = {
  all: Image,
  recent: Clock,
  ai: Sparkles,
  encrypted: Lock,
};

const FILTER_LABELS = {
  all: "All Photos",
  recent: "Recent",
  ai: "AI Generated",
  encrypted: "Encrypted",
};

export function GallerySidebar({ activeFilter, onFilterChange, filterOptions }) {
  const usedPercent = (storageStats.used / storageStats.total) * 100;

  return (
    <aside className="gallery-sidebar w-64 flex-shrink-0 flex flex-col relative z-10">
      {/* Header */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide gradient-text">
              CyberPhotos
            </h1>
            <span className="text-[10px] text-slate-500 font-mono">v2.0</span>
          </div>
        </div>
      </div>

      {/* Navigation filters */}
      <nav className="flex-1 p-4 gallery-scroll overflow-y-auto">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-3 px-2">
          Library
        </p>
        <div className="flex flex-col gap-1">
          {filterOptions.map((filter) => {
            const Icon = FILTER_ICONS[filter];
            const isActive = activeFilter === filter;
            return (
              <motion.button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-cyber-blue/[0.15] text-blue-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="w-4 h-4" />
                <span>{FILTER_LABELS[filter]}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Storage indicator */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">Storage</span>
        </div>
        <div className="storage-bar-bg h-1.5 rounded-full overflow-hidden mb-1.5">
          <div
            className="storage-bar-fill h-full rounded-full transition-all duration-500"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 font-mono">
          {storageStats.used} GB / {storageStats.total} GB
        </p>
      </div>

      {/* Back to home */}
      <div className="p-4 border-t border-white/[0.06]">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-accent-blue transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>
    </aside>
  );
}
