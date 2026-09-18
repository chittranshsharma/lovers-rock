"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface TVPaperCardProps {
  children: ReactNode;
  tilt?: "left" | "right" | "none";
  className?: string;
  isPaper?: boolean; // cream paper background vs dark surface
  delay?: number;
}

/**
 * Physical artifact card — feels like a photo, clipping, or note.
 * Slight rotation, thin border, no huge radius.
 * Animates in with a Polaroid-style drop.
 */
export default function TVPaperCard({
  children,
  tilt = "left",
  className = "",
  isPaper = false,
  delay = 0,
}: TVPaperCardProps) {
  const tiltDeg = tilt === "left" ? -1.1 : tilt === "right" ? 0.7 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, rotate: tiltDeg - 1 }}
      animate={{ opacity: 1, y: 0, rotate: tiltDeg }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className={`relative overflow-hidden ${isPaper ? "tv-paper-card" : "tv-card p-4"} ${className}`}
      style={{
        borderRadius: "3px",
      }}
    >
      {/* Subtle inner scanline for dark cards */}
      {!isPaper && (
        <div className="tv-scanlines" aria-hidden="true" style={{ opacity: 0.15 }} />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
