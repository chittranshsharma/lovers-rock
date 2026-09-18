"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Sparkles, CheckCircle2, ArrowRight, Eye, RotateCw } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, UserState } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";
import { getExperienceConfig, ArchiveItemConfig } from "@/lib/experienceConfig";

interface ArchiveRoomProps {
  slug: string;
}

export default function ArchiveRoom({ slug }: ArchiveRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [polaroidFlipped, setPolaroidFlipped] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded = loadUserState(slug);
    const searchParams = new URLSearchParams(window.location.search);
    const queryName = searchParams.get("name");
    if (queryName && !loaded.displayName) {
      loaded.displayName = queryName;
      saveUserState({ displayName: queryName }, slug);
    }
    if (!loaded.visitedPages.includes("archive")) {
      const updated = saveUserState({
        visitedPages: [...loaded.visitedPages, "archive"],
      }, slug);
      setUserState(updated);
    } else {
      setUserState(loaded);
    }
  }, [slug]);

  const markItemOpened = (itemId: string) => {
    if (!userState) return;
    const currentOpened = userState.interactions?.openedArchiveItems || [];
    if (!currentOpened.includes(itemId)) {
      const updated = saveUserState({
        interactions: {
          ...userState.interactions,
          listenedToVinyl: userState.interactions?.listenedToVinyl ?? false,
          openedArchiveItems: [...currentOpened, itemId],
        },
      }, slug);
      setUserState(updated);
    }
  };

  const displayName = mounted ? (userState?.displayName || "You") : "You";
  const theme = getTheme("tv-girl");
  const accentColor = resolveAccentColor(theme, userState?.themeState?.accent || "pink");
  const revealReady = userState ? isRevealUnlocked(userState) : false;

  // Progressive unearthing checks
  const scratchCompleted = userState?.completedGames?.scratch ?? false;
  const picksCompleted = userState?.completedGames?.quiz ?? false;
  const heartsCompleted = userState?.completedGames?.hearts ?? false;

  // Tracklist dynamically reflects chosen atmosphere
  const isRain = userState?.preferences?.atmosphere === "rain";
  const mixtapeTracks = isRain
    ? [
        "SIDE A // 01. LOVER'S ROCK (LATE NIGHT RAIN CUT)",
        "SIDE A // 02. NOT ALLOWED (SLOWED TAPE ECHO)",
        "SIDE B // 03. CIGARETTES OUT THE WINDOW",
        "SIDE B // 04. TAKING WHAT'S NOT YOURS",
      ]
    : [
        "SIDE A // 01. BIRDS DON'T SING (GOLDEN HOUR REEL)",
        "SIDE A // 02. LOVER'S ROCK (SUNSET DRIFT)",
        "SIDE B // 03. LOUISE (ANALOG MASTER)",
        "SIDE B // 04. PANTYHOSE",
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 relative z-10">
        {/* Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151518] border border-white/10 rounded-[2px] text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
            <Archive className="w-3 h-3 text-[#FF1685]" />
            <span>PHYSICAL EPHEMERA · ANALOG REPOSITORY</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
            THE PERSONAL ARCHIVE
          </h1>

          <p className="font-serif italic text-sm text-[#D9D0BE] max-w-md mx-auto">
            tangible artifacts preserved from the broadcast. click, flip, and unfold them.
          </p>
        </section>

        {/* Tactile Tabletop Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Artifact 01: Vintage Flippable Polaroid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase">
              <span>01 // POLAROID STILL</span>
              <span className="text-[#D9D0BE]">[ CLICK TO FLIP ]</span>
            </div>

            <div
              onClick={() => {
                setPolaroidFlipped(!polaroidFlipped);
                markItemOpened("polaroid-01");
              }}
              className="relative aspect-[4/5] bg-[#EEE8DA] text-[#111113] p-4 sm:p-5 rounded-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.85)] cursor-pointer transition-transform hover:-translate-y-1"
              style={{ transform: "rotate(-1.2deg)" }}
            >
              <AnimatePresence mode="wait">
                {!polaroidFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-square bg-black overflow-hidden border border-black/10">
                      <Image
                        src="/photos/hero-crt.jpg"
                        alt="Vintage still photograph"
                        fill
                        className="object-cover contrast-[1.2] grayscale"
                      />
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 text-[8px] font-mono text-white tracking-widest">
                        ● 02:47 AM
                      </div>
                    </div>
                    <div className="pt-3 text-center">
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#111113]">
                        FOR {displayName.toUpperCase()}
                      </p>
                      <span className="text-[9px] font-mono text-[#111113]/60 uppercase tracking-widest">
                        CLICK TO READ BACK
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col justify-between p-2"
                  >
                    <div className="text-right text-[9px] font-mono text-[#111113]/50">
                      POSTMARK: MIDNIGHT
                    </div>
                    <div className="space-y-2 text-center my-auto">
                      <p className="font-serif italic text-base sm:text-lg text-[#111113] leading-relaxed">
                        &ldquo;a little place saved just for you, somewhere between midnight and tomorrow.&rdquo;
                      </p>
                      <span className="text-[#FF1685] text-xs font-mono block">♡</span>
                    </div>
                    <div className="text-center text-[9px] font-mono text-[#111113]/40 uppercase tracking-widest">
                      [ TAP TO FLIP BACK ]
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Artifact 02: Personalized Concert Ticket Stub */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase">
              <span>02 // TICKET STUB</span>
              <span className="text-[#D9D0BE]">[ ADMIT ONE ]</span>
            </div>

            <div
              onClick={() => {
                setSelectedTicket(!selectedTicket);
                markItemOpened("ticket-01");
              }}
              className="relative p-6 bg-[#16161A] border-2 border-dashed border-[#D9D0BE]/30 text-[#F7F5EF] rounded-[2px] shadow-[0_15px_40px_rgba(0,0,0,0.85)] cursor-pointer transition-transform hover:-translate-y-1 flex flex-col justify-between min-h-[280px]"
              style={{ transform: "rotate(1.1deg)" }}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-2 text-[10px] font-mono tracking-widest text-[#AFA797]">
                <span>NO. 0894-1974</span>
                <span>SEC // BALCONY</span>
              </div>

              <div className="space-y-2 py-4">
                <span className="text-[10px] font-mono tracking-widest text-[#FF1685] uppercase block">
                  ADMIT ONE · SPECIAL RESERVATION
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                  {displayName.toUpperCase()}
                </h3>
                <p className="font-serif italic text-xs text-[#D9D0BE]">
                  &ldquo;night drive &amp; cherries // one night only&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-[#AFA797]">
                <span>ROW 7 · SEAT 4</span>
                <span className="text-[#D9D0BE] font-bold">NON-TRANSFERABLE ♡</span>
              </div>
            </div>
          </div>

          {/* Artifact 03: Mixtape Cassette */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase">
              <span>03 // CASSETTE MIXTAPE</span>
              <span className="text-[#FF1685]">UNEARTHED ♡</span>
            </div>

            <div
              onClick={() => markItemOpened("cassette-01")}
              className="p-5 bg-[#141418] border border-white/20 rounded-[2px] shadow-lg cursor-pointer space-y-3 transition-transform hover:-translate-y-1"
              style={{ transform: "rotate(-0.8deg)" }}
            >
              {/* Clear cassette window */}
              <div className="p-3 bg-[#0A0A0D] border border-white/15 rounded-[2px] flex items-center justify-between">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/40 animate-spin-slow" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono font-bold text-white tracking-widest block uppercase">
                    LATE NIGHT MIX FOR {displayName.toUpperCase()}
                  </span>
                  <span className="text-[8px] font-mono text-[#AFA797] uppercase tracking-wider">
                    C-60 · TYPE I FERRIC · {isRain ? "RAIN EDITION" : "SUNSET EDITION"}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/40 animate-spin-slow" />
                </div>
              </div>

              <div className="space-y-1 pt-1 text-[10px] font-mono text-[#D9D0BE]">
                {mixtapeTracks.map((t, idx) => (
                  <p key={idx} className="truncate">
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Artifact 04: Folded Creased Note */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#AFA797] uppercase">
              <span>04 // FOLDED LETTER</span>
              <span className="text-[#FF1685]">UNFOLD ♡</span>
            </div>

            <div
              onClick={() => {
                setLetterOpen(!letterOpen);
                markItemOpened("letter-01");
              }}
              className="p-5 bg-[#EEE8DA] text-[#111113] rounded-[2px] shadow-lg cursor-pointer transition-transform hover:-translate-y-1 min-h-[160px] flex flex-col justify-between"
              style={{ transform: "rotate(1.3deg)" }}
            >
              <div className="flex items-center justify-between border-b border-black/15 pb-1 text-[9px] font-mono text-[#111113]/60 uppercase">
                <span>CREASED PAPER DISPATCH</span>
                <span>[ {letterOpen ? "FOLD" : "UNFOLD"} ]</span>
              </div>

              <div className="py-2">
                <p className="font-serif italic text-xs sm:text-sm text-[#111113] leading-relaxed whitespace-pre-line">
                  {letterOpen
                    ? `p.s.

i hope today was gentle with you. and if it wasn't, i hope this little world made it feel a little softer, ${displayName}.`
                    : "a small handwritten note is folded inside. [click to unfold]"}
                </p>
              </div>

              <div className="text-right text-[9px] font-mono text-[#111113]/40 uppercase tracking-widest">
                SEALED IN CONFIDENCE ♡
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <section className="pt-6 pb-12">
          <div className="p-4 bg-[#121215] border border-white/10 rounded-[2px] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[#AFA797] text-[10px] tracking-widest uppercase block">
                YOUR ARCHIVE
              </span>
              <span className="text-[#F7F5EF]">
                unearth these artifacts whenever you like.
              </span>
            </div>

            <Link
              href={`/${slug}/reveal`}
              className="px-5 py-2.5 bg-[#FF1685] hover:bg-[#FF3596] text-white text-[11px] font-mono font-bold uppercase tracking-widest rounded-[2px] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,22,133,0.4)] animate-pulse"
            >
              <span>OPEN THE LAST THING ♡</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Spotify Player Drawer */}
      <SpotifyPlayer isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </div>
  );
}
