"use client";

import { motion } from "framer-motion";
import { Search, Bell } from "lucide-react";
import MoodSelector from "./MoodSelector";

export default function FeedNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="sticky top-8 z-40 flex items-center justify-between w-full max-w-[1600px] mx-auto h-16 px-6 rounded-full bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative flex items-center group">
        <Search
          size={18}
          className="absolute left-4 text-white/40 transition-colors group-focus-within:text-white/80"
        />
        <input
          type="text"
          placeholder="Search artworks, artists, moods..."
          className="w-full h-10 pl-11 pr-4 bg-transparent text-sm text-white placeholder-white/30 border-none outline-none focus:ring-0"
        />
        {/* Subtle bottom line indicator on focus */}
        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/20 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300 ease-out" />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <MoodSelector />

        <div className="h-6 w-px bg-white/10 mx-1" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors relative"
        >
          <Bell size={20} />
          {/* Notification dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ff806d] border border-[#141414]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-inner"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </motion.button>
      </div>
    </motion.header>
  );
}
