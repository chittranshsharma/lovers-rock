"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  showAttribution?: boolean;
  stationFreq?: string;
  style?: React.CSSProperties;
}

/**
 * TV Girl typewriter.
 * Shows text character by character, then appends:
 *   — SIGNAL [freq]  (timestamp + station attribution)
 * Respects prefers-reduced-motion.
 */
export default function Typewriter({
  text,
  speed = 40,
  onComplete,
  className = "",
  showAttribution = true,
  stationFreq = "103.7",
  style,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  // Generate timestamp once
  const [timestamp] = useState(() => {
    const d = new Date();
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setDisplayedText("");
    setIsDone(false);

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsDone(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className={`${className}`}
      style={style}
    >
      {/* Timestamp */}
      <p
        className="tv-mono mb-2"
        style={{ fontSize: "0.58rem", color: "var(--tv-muted)" }}
        aria-hidden="true"
      >
        {timestamp}
      </p>

      {/* Generated line */}
      <p className="tv-body-serif" style={{ fontSize: "inherit" }}>
        &ldquo;{displayedText}
        {!isDone && (
          <span
            className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
            style={{ background: "var(--station-primary)" }}
            aria-hidden="true"
          />
        )}
        &rdquo;
      </p>

      {/* Attribution */}
      {isDone && showAttribution && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="tv-mono mt-2"
          style={{ fontSize: "0.58rem", color: "var(--tv-muted)" }}
          aria-hidden="true"
        >
          — SIGNAL {stationFreq}
        </motion.p>
      )}
    </motion.div>
  );
}
