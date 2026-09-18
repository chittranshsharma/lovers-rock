"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TVSignalLossProps {
  isActive: boolean;
  onComplete?: () => void;
}

/**
 * TV Signal Loss overlay.
 * Duration: 400–600ms. Shows static → scanlines → RGB split → NO SIGNAL → restore.
 * Triggered externally (rapid dial changes, special interaction, etc).
 * Do NOT make this fire constantly.
 */
export default function TVSignalLoss({ isActive, onComplete }: TVSignalLossProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (onComplete) onComplete();
      }, 550);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="tv-signal-loss"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
          transition={{ duration: 0.08 }}
          aria-live="polite"
          aria-label="Signal lost"
          role="status"
        >
          {/* Static noise fill */}
          <div className="tv-static-noise" aria-hidden="true" />

          {/* Scanlines */}
          <div className="tv-scanlines" aria-hidden="true" style={{ opacity: 0.4 }} />

          {/* RGB chromatic split lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 3 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{
                  top: `${10 + i * 14}%`,
                  height: "2px",
                  background: i % 2 === 0
                    ? "rgba(255,22,133,0.6)"
                    : "rgba(20,91,255,0.6)",
                  transform: `translateX(${i % 2 === 0 ? -2 : 2}px)`,
                  filter: "blur(0.5px)",
                }}
              />
            ))}
          </div>

          {/* NO SIGNAL text */}
          <div className="relative z-10 text-center" aria-hidden="false">
            <p
              className="tv-mono mb-2"
              style={{
                fontSize: "0.55rem",
                color: "var(--tv-muted)",
                letterSpacing: "0.3em",
              }}
            >
              ████████████████
            </p>
            <p
              className="tv-headline"
              style={{
                fontSize: "clamp(1.8rem, 6vw, 3.5rem)",
                color: "var(--tv-white)",
                letterSpacing: "-0.02em",
              }}
            >
              NO SIGNAL
            </p>
            <p
              className="tv-mono mt-2"
              style={{
                fontSize: "0.55rem",
                color: "var(--tv-muted)",
                letterSpacing: "0.3em",
              }}
            >
              ████████████████
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
