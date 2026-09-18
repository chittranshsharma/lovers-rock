"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CRT_MESSAGES, CRTTrigger, DEFAULT_CYCLE_MESSAGES, getCRTMessage } from "@/lib/crtMessages";
import { SECRETS } from "@/lib/secrets";

interface InteractiveCRTProps {
  name?: string;
  liveText?: string;
  color?: string;
  vibe?: string;
  overrideTrigger?: CRTTrigger;
  isGlitchingOverride?: boolean;
  onScreenClick?: () => void;
  className?: string;
}

export default function InteractiveCRT({
  name = "YOU",
  liveText,
  color = "#FF1685",
  vibe,
  overrideTrigger,
  isGlitchingOverride = false,
  onScreenClick,
  className = "",
}: InteractiveCRTProps) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [activeTrigger, setActiveTrigger] = useState<CRTTrigger>(overrideTrigger || DEFAULT_CYCLE_MESSAGES[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [clickStreak, setClickStreak] = useState(0);
  const [secretToast, setSecretToast] = useState<string | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync if overrideTrigger changes from outside
  useEffect(() => {
    if (overrideTrigger) {
      setActiveTrigger(overrideTrigger);
    }
  }, [overrideTrigger]);

  // Idle check: after 25 seconds of no clicks, show "idle-check"
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setActiveTrigger("idle-check");
          setIsGlitching(false);
        }, 150);
      }, 25000);
    };

    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [cycleIndex]);

  // Check late-night hours (between 11 PM and 5 AM)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) {
      // 25% chance or after initial welcome, can show night-owl
    }
  }, []);

  const handleScreenClick = () => {
    const newStreak = clickStreak + 1;
    setClickStreak(newStreak);

    // Easter egg check: 7 clicks in a row
    if (newStreak === 7) {
      setIsGlitching(true);
      setTimeout(() => {
        setActiveTrigger("easter-egg-bully");
        setIsGlitching(false);
        setSecretToast(SECRETS["bully-tv"].toast);
        setTimeout(() => setSecretToast(null), 3500);
      }, 180);
      if (onScreenClick) onScreenClick();
      return;
    }

    setIsGlitching(true);
    setTimeout(() => {
      const nextIdx = (cycleIndex + 1) % DEFAULT_CYCLE_MESSAGES.length;
      setCycleIndex(nextIdx);
      setActiveTrigger(DEFAULT_CYCLE_MESSAGES[nextIdx]);
      setIsGlitching(false);
    }, 180);

    if (onScreenClick) onScreenClick();
  };

  const message = getCRTMessage(activeTrigger, { name, vibe });

  const effectiveGlitching = isGlitching || isGlitchingOverride;
  const displayText = liveText !== undefined ? liveText : message.text;
  const displaySubtext = liveText !== undefined ? "[ ON AIR ]" : message.subtext;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Outer physical Polaroid / photo framing */}
      <div
        className="relative p-2.5 sm:p-3 bg-[#121215] border border-[rgba(247,245,239,0.18)] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        style={{ borderRadius: "2px" }}
      >
        {/* CRT Television Photo Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-black select-none">
          <Image
            src="/photos/hero-crt.jpg"
            alt="Vintage CRT television set displaying a personalized message"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 680px"
            className="object-cover contrast-[1.25] brightness-[0.88] grayscale"
          />

          {/* Deep dark tone map */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-55 bg-gradient-to-t from-black via-transparent to-black/40"
            aria-hidden="true"
          />

          {/* Active CRT Screen Overlay */}
          <div
            onClick={handleScreenClick}
            className="absolute z-10 cursor-pointer group flex flex-col items-center justify-center p-3 text-center overflow-hidden transition-transform duration-100 active:scale-98"
            style={{
              left: "26%",
              top: "29%",
              width: "33%",
              height: "35%",
              borderRadius: "8px",
              background: effectiveGlitching
                ? "rgba(255,255,255,0.85)"
                : `radial-gradient(ellipse at center, ${color}35 0%, rgba(9,9,11,0.9) 100%)`,
              boxShadow: `inset 0 0 16px ${color}88, 0 0 24px ${color}33`,
            }}
            title="Tap the TV screen to tune"
          >
            {/* Screen scanlines */}
            <div className="tv-scanlines opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center px-1 transition-opacity duration-150">
              <span
                key={displayText}
                className="font-display font-black text-xs sm:text-sm md:text-base tracking-widest text-[#F7F5EF] leading-tight uppercase animate-in fade-in zoom-in-95 duration-150"
                style={{
                  textShadow: `0 0 8px ${color}, 0 0 18px ${color}aa`,
                }}
              >
                {effectiveGlitching ? "░▒▓█▓▒░" : (displayText || `HI ${name ? name.toUpperCase() : "YOU"} ♡`)}
              </span>
              <span className="font-mono text-[8px] text-[#D9D0BE]/70 mt-1 uppercase tracking-widest">
                {effectiveGlitching ? "[ RETUNING ]" : displaySubtext}
              </span>
            </div>
          </div>

          {/* Subtle Corner Stamps */}
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/85 border border-white/10 text-[9px] font-mono tracking-widest text-[#F7F5EF]/90 uppercase">
            <span>CRT BROADCAST // FOR {name ? name.toUpperCase() : "YOU"}</span>
          </div>

          <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 bg-black/85 border border-white/10 text-[8px] font-mono tracking-wider text-[#AFA797] uppercase">
            <span>● ON AIR · 1974</span>
          </div>
        </div>

        {/* Polaroid bottom caption */}
        <div className="pt-2 px-1 flex items-center justify-between text-[9px] font-mono text-[#AFA797]">
          <span>FIG. 01 — PORTABLE RECEIVER</span>
          <span>CH. 33⅓</span>
        </div>
      </div>

      {/* Secret Toast if triggered */}
      {secretToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#151518] border border-pink-500/50 text-[11px] font-mono text-[#F7F5EF] shadow-2xl rounded-[2px] animate-bounce">
          {secretToast}
        </div>
      )}
    </div>
  );
}
