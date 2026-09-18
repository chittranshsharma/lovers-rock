"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, CheckCircle2, Disc, ArrowRight, Layers } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import CatchTheHearts from "@/components/games/CatchTheHearts";
import ScratchCardGame from "@/components/games/ScratchCardGame";
import PersonalityPicks from "@/components/games/PersonalityPicks";
import ComplimentSlot from "@/components/games/ComplimentSlot";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, UserState, UserPreferences } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";
import { SemanticAccent } from "@/lib/themes/types";

interface PlayRoomProps {
  slug: string;
}

export default function PlayRoom({ slug }: PlayRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [activeTab, setActiveTab] = useState<"hearts" | "scratch" | "quiz" | "slot">("hearts");
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = loadUserState(slug);
    const searchParams = new URLSearchParams(window.location.search);
    const queryName = searchParams.get("name");
    if (queryName && !loaded.displayName) {
      loaded.displayName = queryName;
      saveUserState({ displayName: queryName }, slug);
    }
    if (!loaded.visitedPages.includes("play")) {
      const updated = saveUserState({
        visitedPages: [...loaded.visitedPages, "play"],
      }, slug);
      setUserState(updated);
    } else {
      setUserState(loaded);
    }
  }, [slug]);

  const displayName = mounted ? (userState?.displayName || "You") : "You";
  const theme = getTheme("tv-girl");
  const accentColor = resolveAccentColor(theme, userState?.themeState?.accent || "pink");
  const revealReady = userState ? isRevealUnlocked(userState) : false;

  const completed = userState?.completedGames || {
    hearts: false,
    scratch: false,
    quiz: false,
    slot: false,
  };
  const totalCompleted = Object.values(completed).filter(Boolean).length;

  const handleHeartsComplete = (score: { timeMs: number }) => {
    const updated = saveUserState({
      completedGames: { ...completed, hearts: true },
      gameScores: { ...userState?.gameScores, heartsTimeMs: score.timeMs },
    }, slug);
    setUserState(updated);
  };

  const handleScratchComplete = () => {
    const updated = saveUserState({
      completedGames: { ...completed, scratch: true },
      interactions: {
        ...userState?.interactions,
        listenedToVinyl: userState?.interactions?.listenedToVinyl ?? false,
        openedArchiveItems: [...(userState?.interactions?.openedArchiveItems || []), "letter-01"],
      },
    }, slug);
    setUserState(updated);
  };

  const handlePicksComplete = (prefs: UserPreferences, chosenAccent: SemanticAccent, vibeSummary: string) => {
    const updated = saveUserState({
      preferences: prefs,
      themeState: { ...userState?.themeState, accent: chosenAccent, intensity: 0.8 },
      vibe: vibeSummary,
      completedGames: { ...completed, quiz: true },
    }, slug);
    setUserState(updated);
  };

  const handleSlotComplete = () => {
    const updated = saveUserState({
      completedGames: { ...completed, slot: true },
    }, slug);
    setUserState(updated);
  };

  const TABS = [
    { id: "hearts" as const, label: "01. CATCH HEARTS", isDone: completed.hearts },
    { id: "scratch" as const, label: "02. SCRATCH CARD", isDone: completed.scratch },
    { id: "quiz" as const, label: "03. VIBE PICKS", isDone: completed.quiz },
    { id: "slot" as const, label: "04. COMPLIMENT SLOT", isDone: completed.slot },
  ];

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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 relative z-10">
        {/* Header & Progress */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151518] border border-white/10 rounded-[2px] text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
            <span>PLAY ROOM</span>
            <span>·</span>
            <span>{totalCompleted} OF 4 COMPLETED</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
            FOUR LITTLE MOMENTS
          </h1>

          <p className="font-serif italic text-sm text-[#D9D0BE] max-w-md mx-auto">
            play in any order. each one unlocks a specific surprise somewhere in this world.
          </p>
        </section>

        {/* Tab Switcher */}
        <section className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap border-b border-white/10 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 sm:px-4 py-2 text-[11px] font-mono tracking-wider uppercase rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === t.id
                  ? "bg-[#1C1C22] text-white border border-white/25 shadow-sm"
                  : "text-[#AFA797] hover:text-white bg-transparent border border-transparent hover:bg-white/5"
              }`}
              style={activeTab === t.id ? { borderBottomColor: accentColor, borderBottomWidth: "2px" } : {}}
            >
              <span>{t.label}</span>
              {t.isDone && <CheckCircle2 className="w-3 h-3 text-[#FF1685]" />}
            </button>
          ))}
        </section>

        {/* Active Game Area */}
        <section className="py-2">
          {activeTab === "hearts" && (
            <CatchTheHearts
              displayName={displayName}
              color={accentColor}
              isAlreadyCompleted={completed.hearts}
              onComplete={handleHeartsComplete}
            />
          )}

          {activeTab === "scratch" && (
            <ScratchCardGame
              displayName={displayName}
              color={accentColor}
              isAlreadyCompleted={completed.scratch}
              onComplete={handleScratchComplete}
            />
          )}

          {activeTab === "quiz" && (
            <PersonalityPicks
              displayName={displayName}
              initialPreferences={userState?.preferences}
              initialAccent={userState?.themeState?.accent}
              isAlreadyCompleted={completed.quiz}
              onComplete={handlePicksComplete}
            />
          )}

          {activeTab === "slot" && (
            <ComplimentSlot
              displayName={displayName}
              color={accentColor}
              isAlreadyCompleted={completed.slot}
              onComplete={handleSlotComplete}
            />
          )}
        </section>

        {/* Bottom Discovery Progression Banner */}
        <section className="pt-6 pb-12">
          <div className="p-4 bg-[#121215] border border-white/10 rounded-[2px] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[#AFA797] text-[10px] tracking-widest uppercase block">
                WORLD PROGRESS
              </span>
              <span className="text-[#F7F5EF]">
                {totalCompleted >= 2
                  ? "you found enough little things. drop the needle in /listen to unlock the final reveal."
                  : `complete ${2 - totalCompleted} more game${2 - totalCompleted > 1 ? "s" : ""} to unseal the final reveal.`}
              </span>
            </div>

            <Link
              href={`/${slug}/listen`}
              className="px-4 py-2 bg-[#1C1C22] hover:bg-white/10 border border-white/20 text-white text-[11px] font-mono uppercase tracking-widest rounded-[2px] transition-all flex items-center gap-1.5"
            >
              <span>GO TO LISTEN</span>
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
