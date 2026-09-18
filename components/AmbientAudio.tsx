"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AmbientAudioProps {
  // Audio is gated behind first user gesture (mood pick or manual click)
  isUnlocked: boolean;
}

export default function AmbientAudio({ isUnlocked }: AmbientAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!isUnlocked) return;

    if (isPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.001, ctx.currentTime);
        mainGain.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 2);
        mainGain.connect(ctx.destination);
        gainNodeRef.current = mainGain;

        // Lo-fi tape hum + chord tones: Fmaj7 / Cmaj7 / Am9
        const notes = [130.81, 174.61, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0];

        const playDroneNote = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;

          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const reverb = ctx.createConvolver();

          // Soft tape reverb impulse
          const impulseLen = ctx.sampleRate * 1.5;
          const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate);
          for (let ch = 0; ch < 2; ch++) {
            const data = impulse.getChannelData(ch);
            for (let i = 0; i < impulseLen; i++) {
              data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2.2);
            }
          }
          reverb.buffer = impulse;

          osc.type = Math.random() > 0.6 ? "sine" : "triangle";
          const freq = notes[Math.floor(Math.random() * notes.length)];
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          noteGain.gain.setValueAtTime(0, ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.022, ctx.currentTime + 2.5);
          noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);

          osc.connect(noteGain);
          noteGain.connect(reverb);
          reverb.connect(mainGain);

          osc.start();
          osc.stop(ctx.currentTime + 8.5);
        };

        playDroneNote();
        intervalRef.current = setInterval(playDroneNote, 3800);
        setIsPlaying(true);
      } catch (err) {
        console.error("Web Audio API error:", err);
      }
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`px-3 py-1.5 flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
        isUnlocked
          ? isPlaying
            ? "bg-[var(--tv-surface)] text-[var(--tv-white)] border border-[var(--station-primary,#FF1685)] shadow-[0_0_12px_rgba(255,22,133,0.25)]"
            : "bg-[var(--tv-surface)] text-[var(--tv-cream)]/70 hover:text-[var(--tv-white)] border border-[rgba(247,245,239,0.18)] hover:border-[var(--tv-cream)]"
          : "bg-[var(--tv-surface)]/50 text-[var(--tv-cream)]/30 border border-white/5 cursor-not-allowed"
      }`}
      style={{ borderRadius: "2px" }}
      title={
        !isUnlocked
          ? "Tune a station or pick a mood first to unlock sound"
          : isPlaying
          ? "Mute tape hiss & drone"
          : "Start tape hiss & ambient drone"
      }
      disabled={!isUnlocked}
      aria-label="Toggle ambient audio"
    >
      {isPlaying ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--station-primary,#FF1685)] animate-pulse" />
          <Volume2 className="w-3.5 h-3.5 text-[var(--station-primary,#FF1685)]" />
          <span className="hidden sm:inline font-mono">TAPE REC ●</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 opacity-50" />
          <span className="hidden sm:inline font-mono">{isUnlocked ? "AUDIO OFF" : "AUDIO 🔒"}</span>
        </>
      )}
    </button>
  );
}
