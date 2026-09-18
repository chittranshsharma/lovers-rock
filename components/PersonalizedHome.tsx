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
    <div className="min-h-screen bg-[#09090B] text-[#F7F5EF] flex flex-col relative overflow-x-hidden select-none">
      {/* Film grain and sparse atmospheric particles (24 items total: tiny hearts, film dust, paper flecks) */}
      <CuteParticles color={accentColor} />
      <div className="tv-scanlines opacity-20 pointer-events-none" aria-hidden="true" />

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
            <span className="font-display font-black text-sm tracking-widest text-[#F7F5EF] uppercase">
              TV GIRL
            </span>
            <Heart className="w-3 h-3 fill-[#FF1685] text-[#FF1685]" />
          </div>
          <span className="font-mono text-[9px] tracking-widest text-[#AFA797]/70 uppercase">
            BROADCAST FREQ 89.4
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
              <span className="font-mono text-[10px] tracking-widest text-[#AFA797] uppercase block">
                SPECIAL NIGHT TRANSMISSION
              </span>
              <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter uppercase text-white leading-none">
                TV GIRL
              </h1>
            </div>
          ) : (
            <div
              key="post-name-header"
              className="space-y-1 transition-all duration-300 animate-in fade-in zoom-in-95"
            >
              <span className="font-mono text-[10px] tracking-widest text-[#FF1685] uppercase block font-bold">
                FOR {displayName.toUpperCase()}
              </span>
              <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight uppercase text-white leading-none">
                {displayName.toUpperCase()}
              </h1>
              <p className="font-serif italic text-sm sm:text-base text-[#D9D0BE] pt-1">
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
            <p className="font-serif italic text-sm text-[#D9D0BE]">
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
                  className="w-full bg-[#121215] border border-white/20 focus:border-[#FF1685] px-4 py-2.5 text-center text-sm sm:text-base font-mono text-white placeholder-[#AFA797]/40 rounded-[2px] outline-none transition-colors shadow-inner"
                />
                {nameInput.trim() && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF1685] text-xs">
                    ♡
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full py-2.5 bg-[#F7F5EF] hover:bg-white text-[#09090B] disabled:opacity-30 disabled:hover:bg-[#F7F5EF] font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] transition-all cursor-pointer shadow-[0_0_20px_rgba(255,22,133,0.3)] hover:shadow-[0_0_30px_rgba(255,22,133,0.5)] active:scale-98"
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
                className="group p-4 bg-[#121215] hover:bg-[#18181D] border border-white/15 hover:border-pink-500/50 rounded-[2px] flex flex-col justify-between min-h-[135px] transition-all cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
              >
                <div>
                  <div className="flex items-center justify-between text-[#AFA797] mb-2 text-[10px] font-mono tracking-widest uppercase">
                    <span>01 // DOOR</span>
                    <Gamepad2 className="w-3.5 h-3.5 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <h2 className="font-display font-black text-base text-white tracking-wider uppercase">
                    PLAY
                  </h2>
                  <p className="font-serif italic text-[11px] text-[#D9D0BE] mt-1 leading-snug">
                    four little games waiting for you.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-[#AFA797] group-hover:text-white uppercase tracking-widest pt-2">
                  <span>ENTER</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Door 02: LISTEN */}
              <Link
                href={`/${slug}/listen`}
                className="group p-4 bg-[#121215] hover:bg-[#18181D] border border-white/15 hover:border-pink-500/50 rounded-[2px] flex flex-col justify-between min-h-[135px] transition-all cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
              >
                <div>
                  <div className="flex items-center justify-between text-[#AFA797] mb-2 text-[10px] font-mono tracking-widest uppercase">
                    <span>02 // DOOR</span>
                    <Disc className="w-3.5 h-3.5 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <h2 className="font-display font-black text-base text-white tracking-wider uppercase">
                    LISTEN
                  </h2>
                  <p className="font-serif italic text-[11px] text-[#D9D0BE] mt-1 leading-snug">
                    drop the needle on the late night record.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-[#AFA797] group-hover:text-white uppercase tracking-widest pt-2">
                  <span>TUNE IN</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Door 03: ARCHIVE */}
              <Link
                href={`/${slug}/archive`}
                className="group p-4 bg-[#121215] hover:bg-[#18181D] border border-white/15 hover:border-pink-500/50 rounded-[2px] flex flex-col justify-between min-h-[135px] transition-all cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
              >
                <div>
                  <div className="flex items-center justify-between text-[#AFA797] mb-2 text-[10px] font-mono tracking-widest uppercase">
                    <span>03 // DOOR</span>
                    <Archive className="w-3.5 h-3.5 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <h2 className="font-display font-black text-base text-white tracking-wider uppercase">
                    ARCHIVE
                  </h2>
                  <p className="font-serif italic text-[11px] text-[#D9D0BE] mt-1 leading-snug">
                    polaroids, tickets, and things left behind.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-[#AFA797] group-hover:text-white uppercase tracking-widest pt-2">
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
                  className="px-6 py-3 bg-[#FF1685] hover:bg-[#FF3596] text-white font-mono font-bold text-xs uppercase tracking-widest rounded-[2px] transition-all inline-flex items-center gap-2 shadow-[0_0_25px_rgba(255,22,133,0.5)] animate-pulse"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OPEN THE LAST THING ♡</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLockedModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#121215] hover:bg-[#18181D] border border-white/10 hover:border-white/20 rounded-[2px] text-[10px] font-mono tracking-widest text-[#AFA797] uppercase transition-all cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500/50 animate-ping" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#151518] border border-white/20 rounded-[2px] p-6 space-y-4 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-mono tracking-widest text-white uppercase flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#FF1685]" />
                  <span>UNLOCK CHECKLIST</span>
                </span>
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="text-xs font-mono text-[#AFA797] hover:text-white"
                >
                  [ CLOSE ]
                </button>
              </div>

              <p className="font-serif italic text-xs text-[#D9D0BE]">
                to unlock the final reveal, experience a few little moments:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-[2px] border border-white/5">
                  <span>1. PLAY AT LEAST 2 MINI GAMES</span>
                  <span className={progress.gamesCount >= 2 ? "text-pink-400 font-bold" : "text-[#AFA797]"}>
                    {progress.gamesCount} / 2 {progress.gamesCount >= 2 && "✓"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-[2px] border border-white/5">
                  <span>2. DROP THE NEEDLE IN /LISTEN</span>
                  <span className={progress.didListen ? "text-pink-400 font-bold" : "text-[#AFA797]"}>
                    {progress.didListen ? "DONE ✓" : "NOT YET"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-[2px] border border-white/5">
                  <span>3. OPEN AN ARTIFACT IN /ARCHIVE</span>
                  <span className={progress.didExploreArchive ? "text-pink-400 font-bold" : "text-[#AFA797]"}>
                    {progress.didExploreArchive ? "OPENED ✓" : "NOT YET"}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-widest text-white rounded-[2px] transition-colors"
                >
                  OKAY, GOT IT
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
