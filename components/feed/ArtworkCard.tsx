"use client";

import { motion } from "framer-motion";
import { Heart, Bookmark, Eye } from "lucide-react";
import type { Artwork } from "@/lib/artwork-data";

type ArtworkCardProps = {
  artwork: Artwork;
  index: number;
};

export default function ArtworkCard({ artwork, index }: ArtworkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: Math.min(index * 0.05, 0.3) }}
      className="relative mb-6 break-inside-avoid group rounded-[28px] bg-[#141414]/45 backdrop-blur-xl border border-white/8 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)] transition-shadow duration-500"
    >
      {/* Glass edge highlight */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] ring-1 ring-inset ring-white/[0.05] group-hover:ring-white/[0.1] transition-all duration-500" />
      
      {/* Artwork Image */}
      <div className="relative w-full overflow-hidden rounded-[20px]">
        <motion.img
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-auto object-cover transform origin-center bg-white/5"
          loading="lazy"
        />
        
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
          {artwork.category}
        </div>
        
        {/* Quick Actions (Hover) */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <button className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      {/* Artwork Details */}
      <div className="px-2 pt-4 pb-2">
        <h3 className="text-white font-medium text-lg leading-tight mb-1">
          {artwork.title}
        </h3>
        <p className="text-white/60 text-sm font-light">
          {artwork.artist}
        </p>

        {/* Footer Metrics */}
        <div className="flex items-center gap-4 mt-4 text-white/40 text-[13px]">
          <div className="flex items-center gap-1.5 hover:text-[#ff806d] transition-colors cursor-pointer">
            <Heart size={14} />
            <span>{artwork.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            <span>{artwork.views}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
