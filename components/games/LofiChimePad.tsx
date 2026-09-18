"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LofiChimePadProps {
  displayName?: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete?: () => void;
}

// Pentatonic scale frequencies (C major pentatonic, 2 octaves)
const NOTES = [
  { key: "C4",  freq: 261.63, label: "do",    emoji: "🌸", color: "#F9A8D4" },
  { key: "D4",  freq: 293.66, label: "re",    emoji: "🌺", color: "#FDA4AF" },
  { key: "E4",  freq: 329.63, label: "mi",    emoji: "💗", color: "#EC4899" },
  { key: "G4",  freq: 392.00, label: "sol",   emoji: "✨", color: "#C084FC" },
  { key: "A4",  freq: 440.00, label: "la",    emoji: "🌙", color: "#A78BFA" },
  { key: "C5",  freq: 523.25, label: "do²",   emoji: "⭐", color: "#93C5FD" },
  { key: "D5",  freq: 587.33, label: "re²",   emoji: "🎀", color: "#6EE7B7" },
  { key: "E5",  freq: 659.25, label: "mi²",   emoji: "💫", color: "#FDE68A" },
];

// "Lovers Rock" intro melody pattern (note indices in NOTES array)
const GUIDE_MELODY = [0, 2, 4, 2, 0, 4, 2, 0, 1, 3, 2, 4];

interface FloatingNote {
  id: number;
  x: number;
  y: number;
  emoji: string;
  color: string;
}

export default function LofiChimePad({ displayName = "you", isAlreadyCompleted, onComplete }: LofiChimePadProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);
  const nextIdRef = useRef(0);
  const [guideMode, setGuideMode] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [notesPlayed, setNotesPlayed] = useState(0);
  const [done, setDone] = useState(isAlreadyCompleted ?? false);
  const noteCountRef = useRef(0);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    // Resume if suspended (needed after user gesture in some browsers)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playNote = useCallback((note: typeof NOTES[number]) => {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Oscillator (sine for warmth)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(note.freq, now);

    // Gain envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    // Reverb via convolver (simple fake reverb with delay)
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.18;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.22;
    delay.connect(delayGain);
    delayGain.connect(ctx.destination);

    osc.connect(gain);
    gain.connect(delay);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);

    // Visual feedback
    setActiveKey(note.key);
    setTimeout(() => setActiveKey(k => k === note.key ? null : k), 200);

    // Floating note particle
    const id = nextIdRef.current++;
    const x = Math.random() * 60 + 20;
    setFloatingNotes(prev => [...prev, { id, x, y: 0, emoji: note.emoji, color: note.color }]);
    setTimeout(() => setFloatingNotes(prev => prev.filter(n => n.id !== id)), 1200);

    // Count notes played
    noteCountRef.current += 1;
    setNotesPlayed(noteCountRef.current);

    // Complete after 12 notes
    if (noteCountRef.current >= 12 && !done) {
      setDone(true);
      onComplete?.();
    }

    // Guide mode: advance
    if (guideMode) {
      setGuideStep(s => (s + 1) % GUIDE_MELODY.length);
    }
  }, [done, guideMode, onComplete]);

  // Keyboard mapping: A-J keys
  const KEY_MAP: Record<string, number> = { a: 0, s: 1, d: 2, f: 3, g: 4, h: 5, j: 6, k: 7 };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const idx = KEY_MAP[e.key.toLowerCase()];
      if (idx !== undefined) playNote(NOTES[idx]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playNote]);

  const guidedNote = guideMode ? NOTES[GUIDE_MELODY[guideStep]] : null;

  if (isAlreadyCompleted && done && notesPlayed === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-5xl">🎵</div>
        <p className="font-display font-black text-lg" style={{ color: "#4A0E2E" }}>melody already played ✓</p>
        <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>the chimes remember you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-display font-black text-xl uppercase" style={{ color: "#4A0E2E" }}>
          🎵 LO-FI CHIME PAD
        </h2>
        <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
          tap the bells · {done ? "you've made music ✓" : `play ${Math.max(0, 12 - notesPlayed)} more notes to complete`}
        </p>
      </div>

      {/* Main pad area */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.3)" }}>

        {/* Floating notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <AnimatePresence>
            {floatingNotes.map(n => (
              <motion.div
                key={n.id}
                initial={{ opacity: 1, y: "85%", x: `${n.x}%`, scale: 1 }}
                animate={{ opacity: 0, y: "10%", scale: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="absolute text-xl"
                style={{ color: n.color }}
              >
                {n.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-5 space-y-4">
          {/* Guide mode toggle */}
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase" style={{ color: "#9D4A6E" }}>
              NOTES PLAYED: {notesPlayed}{done ? " · COMPLETE ✓" : ""}
            </div>
            <button
              onClick={() => { setGuideMode(v => !v); setGuideStep(0); }}
              className="px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wide transition-all"
              style={{
                background: guideMode ? "linear-gradient(135deg, #EC4899, #A855F7)" : "rgba(244,114,182,0.15)",
                color: guideMode ? "white" : "#BE185D",
                border: guideMode ? "none" : "1px solid rgba(236,72,153,0.3)",
              }}
            >
              {guideMode ? "🎵 GUIDED MODE ON" : "GUIDE MODE"}
            </button>
          </div>

          {guideMode && guidedNote && (
            <motion.div
              key={guideStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-xs font-mono py-2 rounded-lg"
              style={{ background: "rgba(244,114,182,0.15)", color: "#BE185D" }}
            >
              ↓ tap <span className="font-bold">{guidedNote.label}</span> {guidedNote.emoji}
            </motion.div>
          )}

          {/* Note pads */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {NOTES.map((note, i) => (
              <motion.button
                key={note.key}
                onClick={() => playNote(note)}
                whileTap={{ scale: 0.9 }}
                className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all select-none"
                style={{
                  background: activeKey === note.key
                    ? `linear-gradient(135deg, ${note.color}, ${note.color}CC)`
                    : guideMode && guidedNote?.key === note.key
                      ? `${note.color}44`
                      : "rgba(255,240,245,0.8)",
                  border: activeKey === note.key
                    ? `2px solid ${note.color}`
                    : guideMode && guidedNote?.key === note.key
                      ? `2px dashed ${note.color}`
                      : "1.5px solid rgba(244,114,182,0.25)",
                  boxShadow: activeKey === note.key ? `0 4px 16px ${note.color}80` : "none",
                  transform: activeKey === note.key ? "translateY(-3px)" : "none",
                }}
              >
                <span className="text-lg leading-none">{note.emoji}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: activeKey === note.key ? "#fff" : "#9D4A6E" }}>
                  {note.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Keyboard hint */}
          <div className="grid grid-cols-8 gap-2 opacity-50">
            {["A","S","D","F","G","H","J","K"].map((k, i) => (
              <div key={k} className="text-center text-[9px] font-mono" style={{ color: "#9D4A6E" }}>{k}</div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-mono" style={{ color: "#9D4A6E" }}>
        🎹 USE KEYBOARD (A–K) OR CLICK · 🌸 GUIDE MODE SHOWS YOU WHAT TO PLAY
      </p>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-3 px-4 rounded-2xl"
          style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)" }}
        >
          <p className="font-serif italic text-sm" style={{ color: "#4A0E2E" }}>
            ♡ beautiful melody, {displayName}. the chimes will play on.
          </p>
        </motion.div>
      )}
    </div>
  );
}
