"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const TABS = [
  "For You",
  "Trending",
  "Latest",
  "Photography",
  "Digital Art",
  "Illustration",
  "3D",
  "Minimal",
  "Architecture",
  "Painting",
];

export default function FilterTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="w-full max-w-[1600px] mx-auto mt-6 mb-8 px-2 overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-3 w-max px-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 outline-none"
            >
              {/* Hover & Active background */}
              <div
                className={`absolute inset-0 rounded-full transition-colors duration-300 -z-10 ${
                  isActive
                    ? "bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/20"
                    : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]"
                }`}
              />
              
              {/* Text */}
              <span
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {tab}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
