"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMPLIMENTS = [
  "terrifyingly good at being exactly yourself",
  "the kind of person songs get written about",
  "somehow warmer than golden hour",
  "a little chaotic, entirely wonderful",
  "the main character in the best film you've never seen",
  "rare in the way old records are rare",
  "soft in a way that takes actual strength",
  "the static that somehow makes the music better",
  "impossible to describe, impossible to forget",
  "a living reminder that good things take time",
];

interface SlotMachineProps {
  isUnlocked: boolean;
}

export default function SlotMachine({ isUnlocked }: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinCountRef = useRef(0);

  const spin = () => {
    if (isSpinning || !isUnlocked || hasRevealed) return;
    setIsSpinning(true);
    spinCountRef.current = 0;

    const targetIndex = Math.floor(Math.random() * COMPLIMENTS.length);
    const totalSpins = 18 + Math.floor(Math.random() * 8);

    let i = 0;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * COMPLIMENTS.length));
      i++;
      if (i >= totalSpins) {
        clearInterval(intervalRef.current!);
        setCurrentIndex(targetIndex);
        setIsSpinning(false);
        setHasRevealed(true);
        if ("vibrate" in navigator) navigator.vibrate([30, 10, 20]);
      }
    }, Math.min(50 + i * 6, 220));
  };

  if (!isUnlocked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-4 w-full max-w-xl mx-auto"
    >
      <div
        className="bg-[var(--tv-surface)] border border-[rgba(247,245,239,0.18)] p-5 text-center space-y-3 relative overflow-hidden"
        style={{ borderRadius: "3px" }}
      >
        <div className="tv-scanlines pointer-events-none" aria-hidden="true" style={{ opacity: 0.1 }} />

        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--tv-cream)]/60">
          CASSETTE REEL // ANALOG COMPLIMENT
        </p>

        {/* Slot display */}
        <div className="min-h-[56px] flex items-center justify-center overflow-hidden px-4">
          <AnimatePresence mode="wait">
            {currentIndex !== null ? (
              <motion.p
                key={currentIndex}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.08 }}
                className="font-serif italic text-base sm:text-xl text-[var(--tv-white)] leading-snug"
              >
                &ldquo;{COMPLIMENTS[currentIndex]}&rdquo;
              </motion.p>
            ) : (
              <motion.p
                key="prompt"
                className="text-[var(--tv-cream)]/40 text-xs font-mono uppercase tracking-wider"
              >
                [ PULL LEVER TO SPIN REEL ]
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Pull button */}
        {!hasRevealed && (
          <button
            onClick={spin}
            disabled={isSpinning}
            className="mx-auto px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[var(--tv-charcoal)] border border-[rgba(247,245,239,0.25)] hover:border-[var(--station-primary,#FF1685)] text-[var(--tv-cream)] hover:text-[var(--tv-white)] cursor-pointer disabled:opacity-50 transition-all rounded-[2px]"
          >
            <span>{isSpinning ? "SPINNING REEL..." : "[ PULL LEVER ]"}</span>
          </button>
        )}

        {hasRevealed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-mono uppercase tracking-widest text-[var(--station-primary,#FF1685)]"
          >
            SAVED TO YOUR SESSION ARCHIVE
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
