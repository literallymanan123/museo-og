"use client";

import { motion } from "framer-motion";
import {
  Home,
  Compass,
  Layers,
  Palette,
  Bookmark,
  User,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const topIcons = [
  { icon: Home, label: "Home", href: "/feed" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: Layers, label: "Collections", href: "/collections" },
  { icon: Palette, label: "Artists", href: "/artists" },
  { icon: Bookmark, label: "Saved", href: "/saved" },
  { icon: User, label: "Profile", href: "/profile" },
];

const bottomIcons = [
  { icon: Plus, label: "Create", href: "/create", isAccent: true },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

export default function FeedSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex flex-col justify-between fixed left-8 top-8 bottom-8 w-[95px] rounded-[32px] bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] z-50 py-8 items-center"
      >
        <div className="flex flex-col gap-6 w-full items-center">
          {/* Logo Mark */}
          <div className="w-12 h-12 rounded-full bg-white/[0.08] flex items-center justify-center mb-4 border border-white/10 shadow-inner">
            <span className="font-bold text-xl tracking-tighter">M</span>
          </div>

          <div className="flex flex-col gap-5">
            {topIcons.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href} aria-label={item.label}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isActive
                        ? "bg-white/15 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        : "text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <item.icon strokeWidth={isActive ? 2.5 : 2} size={22} />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5 items-center">
          {bottomIcons.map((item) => (
            <Link key={item.label} href={item.href} aria-label={item.label}>
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${item.isAccent
                    ? "bg-[#ff806d]/20 text-[#ff806d] hover:bg-[#ff806d]/30 hover:shadow-[0_0_20px_rgba(255,128,109,0.3)] border border-[#ff806d]/20"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <item.icon strokeWidth={2} size={22} />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.aside>

      {/* Mobile Bottom Bar */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="md:hidden fixed bottom-6 left-6 right-6 h-16 rounded-[24px] bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] z-50 flex items-center justify-around px-4"
      >
        {topIcons.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} aria-label={item.label}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl flex items-center justify-center transition-colors ${isActive ? "text-white bg-white/10" : "text-white/50"
                  }`}
              >
                <item.icon strokeWidth={isActive ? 2.5 : 2} size={20} />
              </motion.div>
            </Link>
          );
        })}
        <Link href="/create" aria-label="Create">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-xl flex items-center justify-center text-[#ff806d] bg-[#ff806d]/10 border border-[#ff806d]/20"
          >
            <Plus strokeWidth={2.5} size={20} />
          </motion.div>
        </Link>
      </motion.nav>
    </>
  );
}
