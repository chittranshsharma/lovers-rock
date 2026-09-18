"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Gamepad2, Music, Star, Sparkles } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import BlossomCatcher from "@/components/games/BlossomCatcher";
import DreamDateReceipt from "@/components/games/DreamDateReceipt";
import OrigamiFortune from "@/components/games/OrigamiFortune";
import LofiChimePad from "@/components/games/LofiChimePad";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, UserState, UserPreferences } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";

interface PlayRoomProps {
  slug: string;
}

type TabId = "blossom" | "receipt" | "fortune" | "chime";

const TABS: { id: TabId; label: string; emoji: string; description: string }[] = [
  { id: "blossom",  label: "BLOSSOM CATCHER",   emoji: "🌸", description: "catch petals, avoid broken hearts" },
  { id: "receipt",  label: "DREAM DATE RECEIPT", emoji: "🧾", description: "design your perfect date" },
  { id: "fortune",  label: "ORIGAMI FORTUNE",    emoji: "✨", description: "fold the paper, find your fate" },
  { id: "chime",    label: "LO-FI CHIME PAD",    emoji: "🎵", description: "play pentatonic bells" },
];

export default function PlayRoom({ slug }: PlayRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("blossom");
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

  const displayName = mounted ? (userState?.displayName || "you") : "you";
  const theme = getTheme("tv-girl");
  const accentColor = "#EC4899";
  const revealReady = userState ? isRevealUnlocked(userState) : false;

  const completed = userState?.completedGames || {
    hearts: false,
    scratch: false,
    quiz: false,
    slot: false,
  };

  // Map new tab IDs to legacy completedGames keys
  const tabCompleted: Record<TabId, boolean> = {
    blossom: completed.hearts,
    receipt: completed.quiz,
    fortune: completed.scratch,
    chime:   completed.slot,
  };

  const totalCompleted = Object.values(tabCompleted).filter(Boolean).length;

  const markComplete = (tab: TabId) => {
    const legacyKey = {
      blossom: "hearts",
      receipt: "quiz",
      fortune: "scratch",
      chime:   "slot",
    }[tab] as keyof typeof completed;

    const updated = saveUserState({
      completedGames: { ...completed, [legacyKey]: true },
    }, slug);
    setUserState(updated);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none bg-[#120912] text-[#FCE7F3]">
      <CuteParticles color="#EC4899" />

      <SiteNav
        slug={slug}
        displayName={displayName}
        color={accentColor}
        isRevealReady={revealReady}
        onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 relative z-10">

        {/* Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase"
            style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#F472B6" }}>
            <Gamepad2 className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>PLAY ROOM</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#FCE7F3]">
            FOUR LITTLE WORLDS
          </h1>
          <p className="font-serif italic text-sm max-w-md mx-auto text-[#F472B6]">
            play in any order. each one is a tiny experience made for you, {displayName}.
          </p>
        </section>

        {/* Tab Switcher */}
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-wide uppercase transition-all cursor-pointer"
                style={{
                  background: activeTab === tab.id
                    ? "linear-gradient(135deg, #EC4899, #DB2777)"
                    : "rgba(30,15,27,0.8)",
                  color: activeTab === tab.id ? "white" : "#F472B6",
                  border: activeTab === tab.id ? "none" : "1px solid rgba(236,72,153,0.3)",
                  boxShadow: activeTab === tab.id ? "0 4px 16px rgba(236,72,153,0.4)" : "none",
                }}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active description */}
          <p className="text-xs text-center font-serif italic text-[#F472B6]/80">
            {TABS.find(t => t.id === activeTab)?.description}
          </p>
        </section>

        {/* Game Area */}
        <section className="py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "blossom" && (
                <BlossomCatcher
                  displayName={displayName}
                  color={accentColor}
                  isAlreadyCompleted={false}
                  onComplete={() => markComplete("blossom")}
                />
              )}
              {activeTab === "receipt" && (
                <DreamDateReceipt
                  displayName={displayName}
                  color={accentColor}
                  isAlreadyCompleted={false}
                  onComplete={() => markComplete("receipt")}
                />
              )}
              {activeTab === "fortune" && (
                <OrigamiFortune
                  displayName={displayName}
                  color={accentColor}
                  isAlreadyCompleted={false}
                  onComplete={() => markComplete("fortune")}
                />
              )}
              {activeTab === "chime" && (
                <LofiChimePad
                  displayName={displayName}
                  color={accentColor}
                  isAlreadyCompleted={false}
                  onComplete={() => markComplete("chime")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Bottom Navigation */}
        <section className="pb-12">
          <div className="p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4"
            style={{ background: "rgba(30,15,27,0.85)", border: "1.5px solid rgba(236,72,153,0.25)" }}>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest uppercase block text-[#F472B6]">
                YOUR WORLD
              </span>
              <span className="text-sm font-serif italic text-[#FCE7F3]">
                play whenever you like — or tune into music when you&apos;re ready.
              </span>
            </div>

            <Link
              href={`/${slug}/listen`}
              className="px-5 py-2.5 rounded-full flex items-center gap-2 text-white text-xs font-mono uppercase tracking-widest transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}
            >
              <span>GO TO LISTEN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <SpotifyPlayer isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </div>
  );
}
