import { motion, AnimatePresence } from "framer-motion";
import { PhotoCard } from "./PhotoCard.jsx";

export function PhotoGrid({ photos }) {
  return (
    <div className="flex-1 overflow-y-auto gallery-scroll p-6">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </AnimatePresence>
      </motion.div>

      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <p className="text-sm font-mono">No photos match your search.</p>
        </div>
      )}
    </div>
  );
}
