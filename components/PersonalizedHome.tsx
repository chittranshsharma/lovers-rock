"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, Sparkles, Gamepad2, Disc, Archive, ArrowRight } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import InteractiveCRT from "@/components/tv/InteractiveCRT";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, getRevealProgress, UserState } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";

interface PersonalizedHomeProps {
  slug: string;
}

export default function PersonalizedHome({ slug }: PersonalizedHomeProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Hydrate local state and register visits on client mount
  useEffect(() => {
    setMounted(true);
    const loaded = loadUserState(slug);
    const searchParams = new URLSearchParams(window.location.search);
    const queryName = searchParams.get("name");
    if (queryName && !loaded.displayName) {
      loaded.displayName = queryName;
      saveUserState({ displayName: queryName }, slug);
    }
    setUserState(loaded);

    // Track visit
    if (!loaded.visitedPages.includes("home")) {
      saveUserState({
        visitedPages: [...loaded.visitedPages, "home"],
      }, slug);
    }

    // Ping /api/visit
    if (loaded.displayName) {
      try {
        fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, displayName: loaded.displayName }),
        });
      } catch {}
    }
  }, [slug]);

  const hasName = mounted && Boolean(userState?.displayName && userState.displayName.trim().length > 0);
  const displayName = mounted ? (userState?.displayName || "") : "";

  // Live CRT text while unpersonalized
  const liveCRTText = !hasName
    ? !nameInput.trim()
      ? "WHO'S WATCHING?"
      : nameInput.trim().length >= 3
      ? `HI ${nameInput.trim().toUpperCase()} ♡`
      : `HI ${nameInput.trim().toUpperCase()}...`
    : undefined;

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (!clean) return;

    // 1. Trigger CRT flicker
    setIsGlitching(true);

    // 2. Save user state
    const updated = saveUserState({
      displayName: clean,
      vibe: "late night rain",
    }, slug);
    setUserState(updated);

    // 3. Ping Neon DB
    try {
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, displayName: clean }),
      });
    } catch {}

    // 4. End glitch transition
    setTimeout(() => {
      setIsGlitching(false);
    }, 320);
  };

  const theme = getTheme("tv-girl");
  const accentColor = resolveAccentColor(theme, userState?.themeState?.accent || "pink");
  const revealReady = userState ? isRevealUnlocked(userState) : false;
  const progress = userState ? getRevealProgress(userState) : {
    gamesCount: 0,
    gamesNeeded: 2,
    didListen: false,
    didExploreArchive: false,
    isUnlocked: false,
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none" style={{ background: "linear-gradient(160deg, #FFF0F5 0%, #FDF2F8 40%, #FCE7F3 100%)" }}>
      {/* Film grain and sparse atmospheric particles (24 items total: tiny hearts, film dust, paper flecks) */}
      <CuteParticles color={accentColor} />
      <div className="tv-scanlines opacity-10 pointer-events-none" aria-hidden="true" />

      {/* Navigation Header: Minimal identity before name entry, full nav after */}
      {hasName ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SiteNav
            slug={slug}
            displayName={displayName}
            color={accentColor}
            isRevealReady={revealReady}
            onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
          />
        </motion.div>
      ) : (
        <header className="relative z-30 w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm tracking-widest uppercase" style={{ color: "#4A0E2E" }}>
              TV GIRL
            </span>
            <Heart className="w-3 h-3 fill-[#EC4899] text-[#EC4899]" />
          </div>
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "#9D4A6E", opacity: 0.7 }}>
            a little world, just for you
          </span>
        </header>
      )}

      {/* Main Hero Viewport */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-8 flex flex-col items-center justify-center relative z-10 space-y-8 sm:space-y-12">
        {/* Editorial Typographic Title Stack */}
        <div className="text-center space-y-2">
          {!hasName ? (
            <div
              key="pre-name-header"
              className="space-y-1 transition-all duration-300"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase block" style={{ color: "#9D4A6E" }}>
                a special transmission
              </span>
              <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter uppercase leading-none" style={{ color: "#4A0E2E" }}>
                TV GIRL
              </h1>
            </div>
          ) : (
            <div
              key="post-name-header"
              className="space-y-1 transition-all duration-300 animate-in fade-in zoom-in-95"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase block font-bold" style={{ color: "#EC4899" }}>
                FOR {displayName.toUpperCase()} ♡
              </span>
              <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight uppercase leading-none" style={{ color: "#4A0E2E" }}>
                {displayName.toUpperCase()}
              </h1>
              <p className="font-serif italic text-sm sm:text-base pt-1" style={{ color: "#9D4A6E" }}>
                &ldquo;welcome to your little corner.&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* The Dominant Object Centerpiece: Vintage CRT Television */}
        <section className="w-full max-w-md sm:max-w-lg mx-auto">
          <InteractiveCRT
            name={displayName || "YOU"}
            liveText={liveCRTText}
            color={accentColor}
            vibe={userState?.vibe}
            isGlitchingOverride={isGlitching}
            className="w-full"
          />
        </section>

        {/* Name Entry Form (Visible only before submitting name) */}
        {!hasName ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-xs text-center space-y-3 pt-2"
          >
            <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
              what&apos;s your name?
            </p>

            <form onSubmit={handleNameSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="type your name..."
                  autoFocus
                  maxLength={28}
                  className="w-full px-4 py-3 text-center text-sm sm:text-base font-mono outline-none transition-colors rounded-xl"
                  style={{
                    background: "rgba(255,240,245,0.85)",
                    border: "1.5px solid rgba(236,72,153,0.35)",
                    color: "#4A0E2E",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 2px 12px rgba(236,72,153,0.1)",
                  }}
                />
                {nameInput.trim() && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#EC4899" }}>
                    ♡
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full py-3 font-mono font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer text-white disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #EC4899, #DB2777)",
                  boxShadow: "0 6px 24px rgba(236,72,153,0.5)",
                }}
              >
                ENTER ♡
              </button>
            </form>
          </motion.div>
        ) : (
          /* Post-Submission: Three Doors Into The World */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-2xl space-y-8 pt-2"
          >
            {/* The 3 Doors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Door 01: PLAY */}
              <Link
                href={`/${slug}/play`}
                className="group p-5 flex flex-col justify-between min-h-[140px] transition-all cursor-pointer rounded-2xl"
                style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.3)", boxShadow: "0 8px 28px rgba(236,72,153,0.1)" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2 text-[10px] font-mono tracking-widest uppercase" style={{ color: "#9D4A6E" }}>
                    <span>01</span>
                    <Gamepad2 className="w-3.5 h-3.5 transition-colors" style={{ color: "#EC4899" }} />
                  </div>
                  <h2 className="font-display font-black text-lg tracking-wider uppercase" style={{ color: "#4A0E2E" }}>
                    🌸 PLAY
                  </h2>
                  <p className="font-serif italic text-[11px] mt-1 leading-snug" style={{ color: "#9D4A6E" }}>
                    four little worlds waiting for you.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest pt-2" style={{ color: "#EC4899" }}>
                  <span>ENTER</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Door 02: LISTEN */}
              <Link
                href={`/${slug}/listen`}
                className="group p-5 flex flex-col justify-between min-h-[140px] transition-all cursor-pointer rounded-2xl"
                style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.3)", boxShadow: "0 8px 28px rgba(236,72,153,0.1)" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2 text-[10px] font-mono tracking-widest uppercase" style={{ color: "#9D4A6E" }}>
                    <span>02</span>
                    <Disc className="w-3.5 h-3.5" style={{ color: "#EC4899" }} />
                  </div>
                  <h2 className="font-display font-black text-lg tracking-wider uppercase" style={{ color: "#4A0E2E" }}>
                    🎵 LISTEN
                  </h2>
                  <p className="font-serif italic text-[11px] mt-1 leading-snug" style={{ color: "#9D4A6E" }}>
                    drop the needle on the late night record.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest pt-2" style={{ color: "#EC4899" }}>
                  <span>TUNE IN</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Door 03: ARCHIVE */}
              <Link
                href={`/${slug}/archive`}
                className="group p-5 flex flex-col justify-between min-h-[140px] transition-all cursor-pointer rounded-2xl"
                style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.3)", boxShadow: "0 8px 28px rgba(236,72,153,0.1)" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2 text-[10px] font-mono tracking-widest uppercase" style={{ color: "#9D4A6E" }}>
                    <span>03</span>
                    <Archive className="w-3.5 h-3.5" style={{ color: "#EC4899" }} />
                  </div>
                  <h2 className="font-display font-black text-lg tracking-wider uppercase" style={{ color: "#4A0E2E" }}>
                    📮 ARCHIVE
                  </h2>
                  <p className="font-serif italic text-[11px] mt-1 leading-snug" style={{ color: "#9D4A6E" }}>
                    polaroids, tickets, and things left behind.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest pt-2" style={{ color: "#EC4899" }}>
                  <span>UNEARTH</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Bottom Discovered Mystery Object */}
            <div className="pt-2 text-center">
              {revealReady ? (
                <Link
                  href={`/${slug}/reveal`}
                  className="px-7 py-3.5 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-full transition-all inline-flex items-center gap-2 animate-pulse"
                  style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", boxShadow: "0 6px 24px rgba(236,72,153,0.55)" }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OPEN THE LAST THING ♡</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLockedModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer"
                  style={{ background: "rgba(244,114,182,0.12)", border: "1px solid rgba(236,72,153,0.25)", color: "#9D4A6E" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: "#EC4899" }} />
                  <Lock className="w-2.5 h-2.5" />
                  <span>SOMETHING IS STILL LOCKED</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Unlock Checklist Modal */}
      <AnimatePresence>
        {showLockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: "rgba(74,14,46,0.4)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 space-y-4 text-left shadow-2xl"
              style={{ background: "rgba(255,240,245,0.95)", border: "1.5px solid rgba(244,114,182,0.4)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "rgba(244,114,182,0.3)" }}>
                <span className="text-[11px] font-mono tracking-widest uppercase flex items-center gap-1.5" style={{ color: "#4A0E2E" }}>
                  <Lock className="w-3 h-3" style={{ color: "#EC4899" }} />
                  <span>UNLOCK CHECKLIST</span>
                </span>
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="text-xs font-mono hover:opacity-70 transition-opacity"
                  style={{ color: "#9D4A6E" }}
                >
                  [ CLOSE ]
                </button>
              </div>

              <p className="font-serif italic text-xs" style={{ color: "#9D4A6E" }}>
                to unlock the final reveal, experience a few little moments:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl border" style={{ background: "rgba(244,114,182,0.08)", borderColor: "rgba(236,72,153,0.2)", color: "#4A0E2E" }}>
                  <span>1. PLAY AT LEAST 2 MINI GAMES</span>
                  <span style={{ color: progress.gamesCount >= 2 ? "#EC4899" : "#9D4A6E", fontWeight: progress.gamesCount >= 2 ? "bold" : "normal" }}>
                    {progress.gamesCount} / 2 {progress.gamesCount >= 2 && "✓"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border" style={{ background: "rgba(244,114,182,0.08)", borderColor: "rgba(236,72,153,0.2)", color: "#4A0E2E" }}>
                  <span>2. DROP THE NEEDLE IN /LISTEN</span>
                  <span style={{ color: progress.didListen ? "#EC4899" : "#9D4A6E", fontWeight: progress.didListen ? "bold" : "normal" }}>
                    {progress.didListen ? "DONE ✓" : "NOT YET"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border" style={{ background: "rgba(244,114,182,0.08)", borderColor: "rgba(236,72,153,0.2)", color: "#4A0E2E" }}>
                  <span>3. OPEN AN ARTIFACT IN /ARCHIVE</span>
                  <span style={{ color: progress.didExploreArchive ? "#EC4899" : "#9D4A6E", fontWeight: progress.didExploreArchive ? "bold" : "normal" }}>
                    {progress.didExploreArchive ? "OPENED ✓" : "NOT YET"}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="px-5 py-2 rounded-full text-xs font-mono uppercase tracking-widest text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)" }}
                >
                  OKAY, GOT IT ♡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spotify Player Drawer */}
      <SpotifyPlayer isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </div>
  );
}
