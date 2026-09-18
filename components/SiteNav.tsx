"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, Heart, Lock, Sparkles } from "lucide-react";
import AmbientAudio from "@/components/AmbientAudio";
import { SECRETS } from "@/lib/secrets";

interface SiteNavProps {
  slug: string;
  displayName: string;
  color?: string;
  onSpotifyToggle?: () => void;
  isRevealReady?: boolean;
}

export default function SiteNav({
  slug,
  displayName,
  color = "#FF1685",
  onSpotifyToggle,
  isRevealReady = false,
}: SiteNavProps) {
  const pathname = usePathname();
  const [hoverCount, setHoverCount] = useState(0);
  const [showSecretToast, setShowSecretToast] = useState(false);

  const cleanSlug = slug || "demo";
  const NAV_ITEMS = [
    { label: "HOME", href: `/${cleanSlug}` },
    { label: "PLAY", href: `/${cleanSlug}/play` },
    { label: "LISTEN", href: `/${cleanSlug}/listen` },
    { label: "ARCHIVE", href: `/${cleanSlug}/archive` },
  ];

  const handleHeartHover = () => {
    const next = hoverCount + 1;
    setHoverCount(next);
    if (next === 5) {
      setShowSecretToast(true);
      setTimeout(() => setShowSecretToast(false), 3000);
    }
  };

  return (
    <>
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between flex-wrap gap-3 border-b border-[rgba(255,29,158,0.15)] bg-black/95 backdrop-blur-md sticky top-0">
        {/* Brand Identity */}
        <Link
          href={`/${cleanSlug}`}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <span className="font-display font-black text-base sm:text-lg tracking-tight text-white group-hover:text-[#FF1D9E] transition-colors">
            TV GIRL
          </span>
          <span
            onMouseEnter={handleHeartHover}
            className="cursor-pointer inline-block transition-transform hover:scale-125"
            title="Antenna node"
          >
            <Heart
              className="w-3.5 h-3.5 fill-current transition-colors"
              style={{ color }}
            />
          </span>
          <span className="font-mono text-[10px] tracking-widest px-2 py-0.5 bg-[#111111] border border-[rgba(255,29,158,0.2)] rounded-[2px] text-[#8B8B8B]">
            {displayName && displayName.toLowerCase() !== "you" ? `${displayName.toUpperCase()}'S WORLD` : "YOUR WORLD"}
          </span>
        </Link>

        {/* Navigation Doors */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.label === "HOME"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-2.5 sm:px-3 py-1 text-[11px] font-mono tracking-wider uppercase transition-all rounded-[2px] cursor-pointer ${
                  isActive
                    ? "bg-[#111111] text-white border border-[rgba(255,29,158,0.3)] shadow-sm"
                    : "text-[#8B8B8B] hover:text-white hover:bg-white/5 border border-transparent"
                }`}
                style={isActive ? { borderBottomColor: color, borderBottomWidth: "2px" } : {}}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Reveal link in nav */}
          <Link
            href={`/${cleanSlug}/reveal`}
            className="px-2.5 sm:px-3 py-1 text-[11px] font-mono tracking-wider uppercase transition-all rounded-[2px] cursor-pointer flex items-center gap-1.5 bg-[#FF1D9E] text-black border border-transparent hover:brightness-110"
          >
            <Sparkles className="w-3 h-3" />
            <span>THE LAST THING ♡</span>
          </Link>
        </nav>

        {/* Audio & Tape Player Controls */}
        <div className="flex items-center gap-2">
          <AmbientAudio isUnlocked={true} />

          {onSpotifyToggle && (
            <button
              onClick={onSpotifyToggle}
              className="p-1.5 bg-[#111111] border border-[rgba(255,29,158,0.2)] hover:border-[rgba(255,29,158,0.5)] rounded-[2px] text-[#8B8B8B] hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
              title="Open Spotify tape player"
              aria-label="Toggle Spotify"
            >
              <Music className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-[10px] font-mono hidden sm:inline text-[#8B8B8B]">TAPE</span>
            </button>
          )}
        </div>
      </header>

      {/* Secret Toast */}
      {showSecretToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black border border-[rgba(255,29,158,0.5)] text-[11px] font-mono text-white shadow-2xl rounded-[2px] animate-bounce">
          {SECRETS["heart-flutter"].toast}
        </div>
      )}
    </>
  );
}
