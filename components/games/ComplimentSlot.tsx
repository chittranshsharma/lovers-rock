"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, RotateCw } from "lucide-react";

interface ComplimentSlotProps {
  displayName: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete: () => void;
}

const COMPLIMENTS = [
  "terrifyingly good at being exactly yourself",
  "the kind of person songs get written about",
  "somehow warmer than golden hour",
  "a little chaotic, entirely wonderful",
  "the main character in the best film you've never seen",
  "rare in the way old records are rare",
  "soft in a way that takes actual strength",
  "impossible to describe, impossible to forget",
  "the static that somehow makes the song better",
];

export default function ComplimentSlot({
  displayName,
  color = "#FF1685",
  isAlreadyCompleted = false,
  onComplete,
}: ComplimentSlotProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(isAlreadyCompleted ? 0 : null);
  const [hasRevealed, setHasRevealed] = useState(isAlreadyCompleted);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const targetIndex = Math.floor(Math.random() * COMPLIMENTS.length);
    const totalSpins = 16 + Math.floor(Math.random() * 6);

    let count = 0;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * COMPLIMENTS.length));
      count++;

      if (count >= totalSpins) {
        clearInterval(intervalRef.current!);
        setCurrentIndex(targetIndex);
        setIsSpinning(false);
        setHasRevealed(true);
        onComplete();
        if ("vibrate" in navigator) {
          try {
            navigator.vibrate([20, 10, 20]);
          } catch {}
        }
      }
    }, 65);
  };

  const currentText = currentIndex !== null ? COMPLIMENTS[currentIndex] : "SPIN TO RECEIVE ONE COMPLIMENT";

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <div className="relative bg-[#111114] border border-[rgba(247,245,239,0.18)] rounded-[3px] overflow-hidden p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD51F]" />
            <span>04 // COMPLIMENT SLOT MACHINE</span>
          </div>
          <div className="flex items-center gap-1">
            <span>STATUS:</span>
            <span className="font-bold text-white px-1.5 py-0.5 bg-black/60 rounded-[2px] border border-white/10">
              {hasRevealed ? "READY" : "PULL LEVER"}
            </span>
          </div>
        </div>

        {/* Slot Display Frame */}
        <div className="my-6 p-6 bg-[#09090B] border border-white/15 rounded-[2px] text-center min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="tv-scanlines opacity-20 pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-md">
            <span className="text-[9px] font-mono tracking-widest text-[#D9D0BE]/60 uppercase block">
              ● SLOT ROLL // FOR {displayName ? displayName.toUpperCase() : "YOU"}
            </span>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentText}
                initial={{ opacity: 0, y: isSpinning ? 12 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isSpinning ? -12 : 0 }}
                transition={{ duration: 0.1 }}
                className={`font-display font-black text-base sm:text-lg uppercase tracking-wider leading-relaxed ${
                  currentIndex === null
                    ? "text-[#AFA797]"
                    : "text-[#F7F5EF] drop-shadow-[0_0_12px_rgba(255,213,31,0.3)]"
                }`}
              >
                &ldquo;{currentText}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={spin}
            disabled={isSpinning}
            className="px-6 py-2.5 bg-[#FF1685] hover:bg-[#FF3596] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(255,22,133,0.4)]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "SPINNING..." : hasRevealed ? "SPIN AGAIN" : "SPIN LEVER"}</span>
          </button>
        </div>

        {/* Reward Indicator */}
        {hasRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-3 bg-white/5 border border-white/10 rounded-[2px] flex items-center justify-between text-[11px] font-mono text-[#D9D0BE]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF1685]" />
              <span>FINAL WAX-SEALED ENVELOPE UNLOCKED FOR YOUR REVEAL</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
