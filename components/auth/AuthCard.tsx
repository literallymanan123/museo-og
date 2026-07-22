"use client";

import { motion } from "framer-motion";
import Ferrofluid from "./Ferrofluid";
import CircularGallery from "./CircularGallery";
import MuseoLogo from "@/components/brand/MuseoLogo";

type AuthCardProps = {
  children: React.ReactNode;
};

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 text-white">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Ferrofluid
          colors={[
            "#ffffff",
            "#ffffff",
            "#ffffff",
          ]}
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

      {/* Card Wrapper */}
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
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            pointer-events-auto
            relative
            flex
            w-full
            max-w-[750px]
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

          {/* Glass Edge Highlight */}
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

          {/* Top Glass Reflection */}
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

          {/* LEFT GALLERY INSET PANEL */}
          <div
            className="
              relative
              hidden
              h-[436px]
              w-[46%]
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
              items={[
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
              ]}
            />

            {/* Subtle Inner Vignette */}
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

          {/* RIGHT FORM */}
          <div
            className="
              relative
              flex
              h-[436px]
              w-full
              items-center
              justify-center
              px-10
              py-8
              md:w-[54%]
            "
          >
            <div className="w-full max-w-[390px]">
              {children}
            </div>
          </div>

        </motion.div>
      </div>

    </main>
  );
}