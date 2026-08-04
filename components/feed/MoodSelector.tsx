"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MOODS = [
  "All Moods",
  "Calm",
  "Energetic",
  "Melancholic",
  "Vibrant",
  "Dark",
  "Joyful",
  "Cyberpunk",
];

export default function MoodSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
      >
        <span className="text-sm font-medium text-white/90">
          {selectedMood}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ChevronDown size={16} className="text-white/50" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+8px)] w-48 py-2 rounded-2xl bg-[#141414]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => {
                  setSelectedMood(mood);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  selectedMood === mood
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {mood}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
