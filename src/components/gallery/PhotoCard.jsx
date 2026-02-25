import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Star, Lock, Calendar } from "lucide-react";

export function PhotoCard({ photo }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="cyber-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photo.thumbnail}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Scan line overlay */}
        <div className="scan-line-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* HUD corners */}
        <div className="hud-corner hud-corner-tl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="hud-corner hud-corner-tr opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="hud-corner hud-corner-bl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="hud-corner hud-corner-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
        >
          <div className="flex gap-1.5">
            <button className="p-1.5 bg-white/10 backdrop-blur-sm rounded-md hover:bg-white/20 transition-colors">
              <Eye className="w-3.5 h-3.5 text-white" />
            </button>
            <button className="p-1.5 bg-white/10 backdrop-blur-sm rounded-md hover:bg-white/20 transition-colors">
              <Star
                className={`w-3.5 h-3.5 ${
                  photo.starred
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-white"
                }`}
              />
            </button>
          </div>
          {photo.encrypted && (
            <div className="flex items-center gap-1 px-2 py-1 bg-cyan-400/[0.15] rounded-md">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-cyan-400 font-mono">
                ENCRYPTED
              </span>
            </div>
          )}
        </motion.div>

        {/* Top-right resolution badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-mono text-white/60 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {photo.resolution}
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-slate-200 truncate">
          {photo.title}
        </h3>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px] font-mono">{photo.date}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">
            {photo.size}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
