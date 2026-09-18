"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * TV Girl cursor: cream circle center + primary-color ring on interactive elements.
 * Desktop only (fine pointer). Stays small — not an oversized cursor.
 */
export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [stationColor, setStationColor] = useState("#FF1685");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Detect if hovering interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest("button, a, [role='button'], input, textarea, [tabindex]");
      setIsHovering(!!interactive);

      // Read current station primary color from CSS var
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--station-primary")
        .trim();
      if (color) setStationColor(color);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring — appears on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999] rounded-full"
        animate={{
          x: pos.x - 16,
          y: pos.y - 16,
          scale: isHovering ? 1 : 0,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 320, mass: 0.3 }}
        style={{
          width: 32,
          height: 32,
          border: `1.5px solid ${stationColor}`,
          boxShadow: `0 0 8px ${stationColor}44`,
        }}
        aria-hidden="true"
      />

      {/* Inner cream dot — always visible */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[1000] rounded-full"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
        }}
        transition={{ type: "spring", damping: 35, stiffness: 600, mass: 0.15 }}
        style={{
          width: 8,
          height: 8,
          background: "var(--tv-cream)",
          boxShadow: `0 0 4px rgba(217,208,190,0.5)`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
