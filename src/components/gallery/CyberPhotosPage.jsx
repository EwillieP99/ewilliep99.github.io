import { useState } from "react";
import { GallerySidebar } from "./GallerySidebar.jsx";
import { GalleryHeader } from "./GalleryHeader.jsx";
import { PhotoGrid } from "./PhotoGrid.jsx";
import { photos } from "../../data/photos.js";

const FILTER_OPTIONS = ["all", "recent", "ai", "encrypted"];

export function CyberPhotosPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPhotos = photos.filter((photo) => {
    const matchesFilter =
      activeFilter === "all" || photo.category === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      photo.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-navy-950 text-slate-200 overflow-hidden">
      {/* Ambient background matching the portfolio */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, #0b1024 0%, #111942 45%, #1c1240 75%, #101838 100%)",
        }}
      />

      {/* Cyber grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(43,75,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(43,75,238,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <GallerySidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filterOptions={FILTER_OPTIONS}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <GalleryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          photoCount={filteredPhotos.length}
        />
        <PhotoGrid photos={filteredPhotos} />
      </div>
    </div>
  );
}
