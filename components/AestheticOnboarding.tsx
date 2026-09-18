"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Radio, Sparkles } from "lucide-react";
import { stations, Station } from "@/lib/stations";

interface AestheticOnboardingProps {
  onSelect: (stationId: string) => void;
}

export default function AestheticOnboarding({ onSelect }: AestheticOnboardingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accessibility: focus first station option
    const first = containerRef.current?.querySelector<HTMLButtonElement>("button");
    first?.focus();
  }, []);

  const handleSelectStation = (st: Station) => {
    document.documentElement.style.setProperty("--station-primary", st.primary);
    document.documentElement.style.setProperty("--station-secondary", st.secondary);
    document.documentElement.style.setProperty("--station-bg", st.background);
    document.documentElement.style.setProperty("--bg-color", st.background);
    document.documentElement.style.setProperty("--accent-pink", st.primary);
    document.documentElement.style.setProperty("--accent-glow", st.secondary);
    onSelect(st.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(9,9,11,0.96)", backdropFilter: "blur(14px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Initial Station Selection"
    >
      {/* CRT Scanline & noise overlay */}
      <div className="tv-scanlines pointer-events-none" aria-hidden="true" style={{ opacity: 0.35 }} />

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-xl mx-auto text-center space-y-6"
      >
        {/* Analog broadcast header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--tv-surface)] border border-[rgba(247,245,239,0.18)] rounded-[2px] text-[10px] font-mono tracking-widest text-[var(--tv-cream)] uppercase">
            <Radio className="w-3 h-3 text-[var(--tv-pink)] animate-pulse" />
            <span>TRANSMISSION DETECTED · FM BROADCAST</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--tv-white)] uppercase tracking-tight">
            Select Your Frequency
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[var(--tv-cream)]/70 max-w-md mx-auto">
            Choose a channel to calibrate the starfield, analog hue, and poetic signal for this session.
          </p>
        </div>

        {/* Station cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {stations.slice(0, 4).map((st) => (
            <button
              key={st.id}
              onClick={() => handleSelectStation(st)}
              className="group p-4 bg-[var(--tv-charcoal)] border border-[rgba(247,245,239,0.15)] hover:border-[var(--tv-pink)] transition-all duration-200 cursor-pointer flex flex-col justify-between rounded-[3px] hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: st.primary,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] tracking-widest text-[var(--tv-cream)]/60 uppercase">
                  FM {st.frequency}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: st.primary, boxShadow: `0 0 8px ${st.primary}` }}
                />
              </div>

              <div className="font-display text-base text-[var(--tv-white)] group-hover:text-[var(--tv-cream)] tracking-tight">
                {st.title}
              </div>

              <p className="text-[11px] font-mono text-[var(--tv-cream)]/50 mt-1 line-clamp-1">
                {st.mood}
              </p>
            </button>
          ))}
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-wider text-[var(--tv-cream)]/40 uppercase">
          <Sparkles className="w-3 h-3 text-[var(--tv-pink)]" />
          <span>You can adjust the tuner anytime via the radio dial</span>
        </div>
      </div>
    </motion.div>
  );
}
