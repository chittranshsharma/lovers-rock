"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Music, Play, Pause, Disc, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import TVVinyl from "@/components/tv/TVVinyl";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, UserState } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";
import { TV_GIRL_RELEASES } from "@/lib/releases";

interface ListenRoomProps {
  slug: string;
}

export default function ListenRoom({ slug }: ListenRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [selectedReleaseIdx, setSelectedReleaseIdx] = useState(8); // French Exit default
  const [audioAmplitude, setAudioAmplitude] = useState(0);

  useEffect(() => {
    setMounted(true);
    const loaded = loadUserState(slug);
    const searchParams = new URLSearchParams(window.location.search);
    const queryName = searchParams.get("name");
    if (queryName && !loaded.displayName) {
      loaded.displayName = queryName;
      saveUserState({ displayName: queryName }, slug);
    }
    if (!loaded.visitedPages.includes("listen")) {
      const updated = saveUserState({
        visitedPages: [...loaded.visitedPages, "listen"],
      }, slug);
      setUserState(updated);
    } else {
      setUserState(loaded);
    }
  }, [slug]);

  const displayName = mounted ? (userState?.displayName || "You") : "You";

  // Audio amplitude pulse simulator for ambient reactions
  useEffect(() => {
    if (!isPlaying) {
      setAudioAmplitude(0);
      return;
    }
    const interval = setInterval(() => {
      setAudioAmplitude(Math.random() * 0.45 + 0.1);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);

    if (next && userState && !userState.interactions?.listenedToVinyl) {
      const updated = saveUserState({
        interactions: {
          ...userState.interactions,
          listenedToVinyl: true,
          openedArchiveItems: userState.interactions?.openedArchiveItems || [],
        },
      }, slug);
      setUserState(updated);
    }
  };

  const theme = getTheme("tv-girl");
  const accentColor = resolveAccentColor(theme, userState?.themeState?.accent || "pink");
  const revealReady = userState ? isRevealUnlocked(userState) : false;
  const currentRelease = TV_GIRL_RELEASES[selectedReleaseIdx];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F7F5EF] flex flex-col relative overflow-x-hidden select-none">
      <CuteParticles color={accentColor} />
      <div className="tv-scanlines opacity-20 pointer-events-none" aria-hidden="true" />

      {/* Top Nav */}
      <SiteNav
        slug={slug}
        displayName={displayName}
        color={accentColor}
        isRevealReady={revealReady}
        onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 relative z-10">
        {/* Editorial Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151518] border border-white/10 rounded-[2px] text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
            <Disc className="w-3 h-3 text-[#FF1685]" />
            <span>MUSIC ROOM · 33⅓ RPM</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
            THE LATE NIGHT RECORD
          </h1>

          <p className="font-serif italic text-sm text-[#D9D0BE] max-w-md mx-auto">
            click the turntable to drop the needle. no rush, no algorithms—just tape hiss and warm grooves.
          </p>
        </section>

        {/* Cinematic Turntable Centerpiece */}
        <section className="relative max-w-lg mx-auto p-6 sm:p-8 bg-[#111114] border border-[rgba(247,245,239,0.18)] rounded-[3px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase border-b border-white/10 pb-3 mb-6">
            <span>TURNTABLE DECK // STEREO</span>
            <span className={isPlaying ? "text-[#FF1685] font-bold animate-pulse" : "text-[#AFA797]"}>
              {isPlaying ? "● NEEDLE DROPPED" : "NEEDLE RESTING"}
            </span>
          </div>

          {/* Interactive TVVinyl */}
          <div className="py-2">
            <TVVinyl
              isPlaying={isPlaying}
              onToggle={handleTogglePlay}
              primaryColor={accentColor}
              audioAmplitude={audioAmplitude}
              release={currentRelease}
              recipientName={displayName}
            />
          </div>

          {/* Play / Pause Action Button */}
          <div className="pt-6 flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="px-6 py-2.5 bg-[#F7F5EF] hover:bg-white text-[#09090B] font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(255,22,133,0.3)] active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "LIFT NEEDLE (PAUSE)" : "DROP NEEDLE (PLAY)"}</span>
            </button>
          </div>

          {/* Milestone Notice */}
          {userState?.interactions?.listenedToVinyl && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-2.5 bg-white/5 border border-white/10 rounded-[2px] flex items-center gap-2 text-[11px] font-mono text-[#D9D0BE]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FF1685]" />
              <span>VINYL INTERACTION RECORDED · MILESTONE COMPLETED</span>
            </motion.div>
          )}
        </section>

        {/* Release Selector Bar (consuming lib/releases.ts) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase">
            <span>OFFICIAL PRESSINGS ARCHIVE (BANDCAMP)</span>
            <span>SELECT TO CHANGE LABEL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TV_GIRL_RELEASES.slice(0, 8).map((rel, idx) => (
              <button
                key={rel.id}
                onClick={() => setSelectedReleaseIdx(idx)}
                className={`p-2.5 text-left rounded-[2px] border transition-all cursor-pointer ${
                  selectedReleaseIdx === idx
                    ? "bg-[#1C1C22] border-[var(--station-primary,#FF1685)] text-white"
                    : "bg-[#121215] border-white/10 text-[#AFA797] hover:text-[#F7F5EF] hover:bg-white/5"
                }`}
              >
                <span className="font-display font-bold text-xs truncate block">
                  {rel.title}
                </span>
                <span className="font-mono text-[9px] text-[#AFA797]/70 block mt-0.5">
                  {rel.year} · {rel.typeLabel}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Bottom Navigation Link */}
        <section className="pt-4 pb-12">
          <div className="p-4 bg-[#121215] border border-white/10 rounded-[2px] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[#AFA797] text-[10px] tracking-widest uppercase block">
                NEXT STOP
              </span>
              <span className="text-[#F7F5EF]">
                visit the archive to see what physical artifacts have unearthed.
              </span>
            </div>

            <Link
              href={`/${slug}/archive`}
              className="px-4 py-2 bg-[#1C1C22] hover:bg-white/10 border border-white/20 text-white text-[11px] font-mono uppercase tracking-widest rounded-[2px] transition-all flex items-center gap-1.5"
            >
              <span>GO TO ARCHIVE</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      </main>

      {/* Spotify Player Drawer */}
      <SpotifyPlayer isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </div>
  );
}
