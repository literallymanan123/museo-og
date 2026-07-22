"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MuseoLogo from "@/components/brand/MuseoLogo";

export default function LandingPage() {
  const router = useRouter();

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1500);

    const redirectTimer = setTimeout(() => {
      router.replace("/login");
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] text-white">
      <motion.div
        initial={{
          opacity: 0,
          y: 12,
          scale: 0.98,
        }}
        animate={
          isExiting
            ? {
                opacity: 0,
                y: -12,
                scale: 1.015,
              }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
              }
        }
        transition={{
          duration: isExiting ? 0.7 : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col items-center"
      >
        {/* Museo Logo */}
        <MuseoLogo
          className="
            text-[42px]
            font-black
            tracking-[-0.08em]
          "
        />

        {/* Subtitle */}
        <motion.p
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: isExiting ? 0 : 1,
            y: isExiting ? -8 : 0,
          }}
          transition={{
            delay: isExiting ? 0 : 0.35,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-6
            text-sm
            tracking-[0.2em]
            text-white/50
          "
        >
          A SPACE FOR YOUR MOOD
        </motion.p>
      </motion.div>
    </main>
  );
}