"use client";

import React from "react";
import Image from "next/image";

interface TVHeroPhotoProps {
  primaryColor?: string;
  secondaryColor?: string;
  frequency?: string;
  className?: string;
}

/**
 * Dominant vintage object photograph anchor for the hero composition.
 * 1970s portable CRT television set displaying broadcast static on a motel nightstand
 * beside a rotary phone and cassette tape.
 * Treated with selective color mapping, analog film grain, and scanlines.
 * No human characters or stock portraits.
 */
export default function TVHeroPhoto({
  primaryColor = "#FF1685",
  secondaryColor = "#145BFF",
  frequency = "89.4",
  className = "",
}: TVHeroPhotoProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Outer physical print border — thin, slightly irregular */}
      <div
        className="relative p-1.5 sm:p-2 bg-[#121215] border border-[rgba(247,245,239,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
        style={{ borderRadius: "2px" }}
      >
        {/* Photo Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-black">
          {/* Base high-contrast photograph of retro CRT TV set */}
          <Image
            src="/photos/hero-crt.jpg"
            alt="Vintage CRT television set displaying static in a 1970s bedroom"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-cover contrast-[1.3] brightness-[0.94] grayscale"
          />

          {/* Selective Color Mapping Layer: Midtone Saturated Station Accent */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color transition-colors duration-700"
            style={{
              backgroundColor: primaryColor,
              opacity: 0.58,
            }}
            aria-hidden="true"
          />

          {/* Shadow deepener (pure blacks stay pitch black) */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-55 bg-gradient-to-t from-black via-transparent to-black/35"
            aria-hidden="true"
          />

          {/* Secondary chromatic split wash */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle at 45% 45%, ${secondaryColor}, transparent 65%)`,
            }}
            aria-hidden="true"
          />

          {/* Film scanlines */}
          <div
            className="tv-scanlines pointer-events-none opacity-25"
            aria-hidden="true"
          />

          {/* Micro broadcast stamp in corner */}
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/85 border border-white/10 text-[9px] font-mono tracking-widest text-[#F7F5EF]/90 uppercase">
            <span>RECEIVER UNIT · FM {frequency}</span>
          </div>

          <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 bg-black/85 border border-white/10 text-[8px] font-mono tracking-wider text-[#AFA797] uppercase">
            <span>35MM CRT ARCHIVE · NEG. 74</span>
          </div>
        </div>

        {/* Vintage caption strip below photograph */}
        <div className="mt-2 px-1 flex items-center justify-between text-[9px] font-mono text-[#AFA797] uppercase tracking-wider">
          <span>PLATE NO. 01 // BROADCAST MONITOR</span>
          <span className="hidden sm:inline">ANALOG RECEIVER EPHEMERA</span>
        </div>
      </div>
    </div>
  );
}
