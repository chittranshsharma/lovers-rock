"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

export const MOOD_OPTIONS = [
  { label: "soft",        freq: "89.4" },
  { label: "golden hour", freq: "94.8" },
  { label: "chaotic",     freq: "103.7" },
  { label: "nostalgic",   freq: "97.2" },
  { label: "bloom",       freq: "89.4" },
  { label: "midnight",    freq: "89.4" },
  { label: "velvet",      freq: "94.8" },
  { label: "dreaming",    freq: "107.1" },
];

// Tiny Web Audio API chime — single quiet sine tone
function playChime(note = 880) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(note, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch {
    // Ignore audio context errors
  }
}

interface MoodChipsProps {
  onSelectMood: (mood: string) => void;
  isLoading: boolean;
  activeMood: string | null;
  disabled?: boolean;
  stationPrimary?: string;
}

export default function MoodChips({
  onSelectMood,
  isLoading,
  activeMood,
  disabled = false,
  stationPrimary = "#FF1685",
}: MoodChipsProps) {
  const lastChimeRef = useRef(0);

  const handleHoverChime = (label: string) => {
    const now = Date.now();
    if (now - lastChimeRef.current < 120) return;
    lastChimeRef.current = now;
    // Map label to a subtle frequency
    const notes: Record<string, number> = {
      soft: 660, "golden hour": 740, chaotic: 880,
      nostalgic: 698, bloom: 784, midnight: 622,
      velvet: 698, dreaming: 830,
    };
    playChime(notes[label] ?? 740);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 px-4">
      <p
        className="tv-mono mb-4 text-center"
        style={{ color: "var(--tv-muted)" }}
      >
        Select mood · Add star to sky
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = activeMood === mood.label;
          return (
            <MagneticButton key={mood.label} strength={0.22}>
              <motion.button
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                onHoverStart={() => !disabled && handleHoverChime(mood.label)}
                onClick={() => !disabled && !isLoading && onSelectMood(mood.label)}
                disabled={disabled || isLoading}
                className={`mood-chip ${isSelected ? "active" : ""} ${
                  disabled ? "opacity-30 pointer-events-none" : ""
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: stationPrimary,
                        color: "var(--tv-white)",
                        boxShadow: `0 0 10px ${stationPrimary}44`,
                      }
                    : {}
                }
                aria-label={`Select mood: ${mood.label}`}
                aria-pressed={isSelected}
              >
                <span className="capitalize">{mood.label}</span>
                {isSelected && isLoading && (
                  <span
                    className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                    style={{ background: stationPrimary }}
                  />
                )}
              </motion.button>
            </MagneticButton>
          );
        })}
      </div>
    </div>
  );
}
