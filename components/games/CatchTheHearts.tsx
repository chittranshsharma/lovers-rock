"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { SECRETS } from "@/lib/secrets";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  isPopped: boolean;
}

interface CatchTheHeartsProps {
  displayName: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete: (score: { timeMs: number }) => void;
}

export default function CatchTheHearts({
  displayName,
  color = "#FF1685",
  isAlreadyCompleted = false,
  onComplete,
}: CatchTheHeartsProps) {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [caughtCount, setCaughtCount] = useState(isAlreadyCompleted ? 10 : 0);
  const [isWon, setIsWon] = useState(isAlreadyCompleted);
  const [startTime, setStartTime] = useState<number>(0);
  const [speedSecretToast, setSpeedSecretToast] = useState<string | null>(null);
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const initGame = () => {
    const items: FloatingHeart[] = [];
    const colors = [color, "#FF65A3", "#FFD51F", "#145BFF", "#20DDB6"];
    for (let i = 0; i < 10; i++) {
      items.push({
        id: i,
        x: Math.random() * 80 + 10, // percentage 10% - 90%
        y: Math.random() * 70 + 15, // percentage 15% - 85%
        size: Math.random() * 12 + 24, // 24px - 36px
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.25 + 0.15),
        color: colors[i % colors.length],
        isPopped: false,
      });
    }
    setHearts(items);
    setCaughtCount(0);
    setIsWon(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (!isAlreadyCompleted) {
      initGame();
    }
  }, [isAlreadyCompleted]);

  // Gentle floating animation loop
  useEffect(() => {
    if (isWon || isAlreadyCompleted) return;

    const tick = () => {
      setHearts((prev) =>
        prev.map((h) => {
          if (h.isPopped) return h;
          let newX = h.x + h.vx;
          let newY = h.y + h.vy;

          if (newX < 5 || newX > 92) h.vx *= -1;
          if (newY < 5) newY = 90;

          return { ...h, x: newX, y: newY };
        })
      );
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isWon, isAlreadyCompleted]);

  const popHeart = (id: number) => {
    if (isWon) return;

    setHearts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isPopped: true } : h))
    );

    const nextCount = caughtCount + 1;
    setCaughtCount(nextCount);

    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }

    if (nextCount >= 10) {
      const elapsed = Date.now() - startTime;
      setIsWon(true);
      onComplete({ timeMs: elapsed });

      // Easter egg: under 18 seconds
      if (elapsed < 18000) {
        setSpeedSecretToast(SECRETS["speed-hearts"].toast);
        setTimeout(() => setSpeedSecretToast(null), 3500);
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Game Frame */}
      <div
        ref={containerRef}
        className="relative h-[360px] sm:h-[400px] bg-[#111114] border border-[rgba(247,245,239,0.18)] rounded-[3px] overflow-hidden p-4 select-none shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
      >
        {/* Subtle Scanlines & Header */}
        <div className="tv-scanlines opacity-20 pointer-events-none" />

        <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
            <span>01 // CATCH THE HEARTS</span>
          </div>
          <div className="flex items-center gap-1">
            <span>CAUGHT:</span>
            <span className="font-bold text-white px-1.5 py-0.5 bg-black/60 rounded-[2px] border border-white/10">
              {caughtCount} / 10
            </span>
          </div>
        </div>

        {/* Playable Floating Field */}
        {!isWon ? (
          <div className="relative w-full h-[calc(100%-40px)]">
            <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-[#AFA797] uppercase tracking-wider pointer-events-none text-center">
              [ Tap or click all 10 floating hearts ]
            </p>

            {hearts.map((h) => (
              <AnimatePresence key={h.id}>
                {!h.isPopped && (
                  <motion.button
                    onClick={() => popHeart(h.id)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.9 }}
                    exit={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute cursor-pointer p-2 -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform"
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                    }}
                    aria-label="Catch floating heart"
                  >
                    <Heart
                      className="drop-shadow-[0_0_8px_rgba(255,22,133,0.5)] hover:scale-110 transition-transform"
                      style={{
                        width: h.size,
                        height: h.size,
                        fill: h.color,
                        color: h.color,
                      }}
                    />
                  </motion.button>
                )}
              </AnimatePresence>
            ))}
          </div>
        ) : (
          /* Victory State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-20 h-[calc(100%-40px)] flex flex-col items-center justify-center text-center p-6 space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-pink-500/15 border border-pink-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#FF1685]" />
            </div>

            <h3 className="font-display font-black text-xl text-[#F7F5EF] tracking-wide uppercase">
              You caught them all.
            </h3>

            <p className="font-serif italic text-sm text-[#D9D0BE] max-w-sm">
              &ldquo;okay {displayName || "you"}, you win. a secret broadcast message has been unlocked on your television.&rdquo;
            </p>

            <div className="pt-2">
              <button
                onClick={initGame}
                className="px-3 py-1 bg-[#1A1A1E] hover:bg-[#25252A] border border-white/15 text-[10px] font-mono uppercase tracking-widest text-[#D9D0BE] rounded-[2px] transition-colors cursor-pointer"
              >
                [ Play Again ]
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Secret Toast if triggered */}
      {speedSecretToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#151518] border border-pink-500/50 text-[11px] font-mono text-[#F7F5EF] shadow-2xl rounded-[2px] animate-bounce">
          {speedSecretToast}
        </div>
      )}
    </div>
  );
}
