import { motion } from "framer-motion";
import { Search, Upload, Plus } from "lucide-react";

export function GalleryHeader({ searchQuery, onSearchChange, photoCount }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-navy-950/50 backdrop-blur-xl">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search photos..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyber-blue/50 focus:bg-white/[0.07] transition-colors"
        />
      </div>

      {/* Photo count */}
      <div className="hidden sm:flex items-center gap-4 mx-6">
        <span className="text-xs text-slate-500 font-mono">
          {photoCount} items
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 bg-cyber-blue/[0.15] border border-cyber-blue/30 rounded-lg text-sm text-blue-300 hover:bg-cyber-blue/25 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
}
