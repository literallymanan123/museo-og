"use client";

import { artworks } from "@/lib/artwork-data";
import ArtworkCard from "./ArtworkCard";

export default function MasonryFeed() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
      {/* 
        CSS Columns for Masonry Grid 
        - Responsive column counts
        - Gap of 24px (gap-6)
      */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6 space-y-6">
        {artworks.map((artwork, index) => (
          <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
        ))}
      </div>
    </div>
  );
}
