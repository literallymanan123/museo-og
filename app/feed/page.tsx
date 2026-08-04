"use client";

import Ferrofluid from "@/components/auth/Ferrofluid";
import FeedSidebar from "@/components/feed/FeedSidebar";
import FeedNavbar from "@/components/feed/FeedNavbar";
import FilterTabs from "@/components/feed/FilterTabs";
import MasonryFeed from "@/components/feed/MasonryFeed";

export default function FeedPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-white/30 selection:text-white">
      {/* 
        Animated Background 
        - Fixed to viewport
        - Darkened slightly compared to login to ensure cards remain legible
        - Opacity adjusted, but NOT blurred as requested
      */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
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

      {/* Floating Sidebar (Fixed left) */}
      <FeedSidebar />

      {/* Main Content Area */}
      <div className="relative z-10 md:ml-[140px] pt-8 pb-32 md:pb-12 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <FeedNavbar />

        {/* Filter Tabs */}
        <FilterTabs />

        {/* Masonry Grid Feed */}
        <MasonryFeed />
      </div>
    </main>
  );
}