"use client";

import { motion } from "framer-motion";
import Ferrofluid from "./Ferrofluid";
import CircularGallery from "./CircularGallery";
import MuseoLogo from "@/components/brand/MuseoLogo";

type LoginCardProps = {
  children: React.ReactNode;
};

const GALLERY_IMAGES = [
  {
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=900&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80",
  },
  {
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=900&q=80",
  },
];

/**
 * LoginCard — compact independent layout for the login page.
 * The right panel auto-sizes to its content; no fixed height is shared
 * with SignupCard so the two pages are fully independent.
 */
export default function LoginCard({ children }: LoginCardProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <Ferrofluid
          colors={["#ffffff", "#ffffff", "#ffffff"]}
          speed={0.5}
          scale={1}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={3}
          shimmer={1}
          glow={2}
          flowDirection="down"
          opacity={1}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.3}
        />
      </div>

      {/* Museo Logo */}
      <MuseoLogo
        className="
          absolute
          left-12
          top-10
          z-20
          text-[42px]
          font-black
          tracking-[-0.08em]
          text-white
        "
      />

      {/* Centering wrapper */}
      <div
        className="
          pointer-events-none
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
        "
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="
            pointer-events-auto
            relative
            flex
            w-full
            max-w-[700px]
            overflow-hidden
            rounded-[36px]
            border
            border-white/[0.14]
            bg-black/[0.38]
            p-3
            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
            backdrop-blur-[32px]
            backdrop-saturate-[160%]
          "
        >
          {/* Glass edge highlight */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-20
              rounded-[36px]
              ring-1
              ring-inset
              ring-white/[0.08]
            "
          />

          {/* Top glass reflection */}
          <div
            className="
              pointer-events-none
              absolute
              left-[8%]
              right-[8%]
              top-0
              z-20
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/30
              to-transparent
              opacity-60
            "
          />

          {/* LEFT gallery panel — self-stretches to match the form height */}
          <div
            className="
              relative
              hidden
              min-h-[400px]
              w-[44%]
              self-stretch
              overflow-hidden
              rounded-[26px]
              border
              border-white/[0.08]
              bg-black
              md:block
            "
          >
            <CircularGallery
              bend={1.8}
              autoSpeed={0.012}
              items={GALLERY_IMAGES}
            />

            {/* Inner vignette */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-[26px]
                shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]
              "
            />
          </div>

          {/* RIGHT form — grows to content, centered */}
          <div
            className="
              relative
              flex
              w-full
              items-center
              justify-center
              px-10
              py-10
              md:w-[56%]
            "
          >
            <div className="w-full max-w-[360px]">{children}</div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
