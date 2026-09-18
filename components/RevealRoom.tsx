"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, Download, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import SnapshotButton from "@/components/SnapshotButton";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, getRevealProgress, UserState } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";
import { getExperienceConfig } from "@/lib/experienceConfig";

interface RevealRoomProps {
  slug: string;
}

export default function RevealRoom({ slug }: RevealRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [stage, setStage] = useState<"intro" | "letter">("intro");
  const [dynamicLine, setDynamicLine] = useState<string>("");
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);

  const config = getExperienceConfig(slug);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.location.search.includes("stage=letter")) {
      setStage("letter");
    }
  }, []);

  useEffect(() => {
    const loaded = loadUserState(slug);
    const searchParams = new URLSearchParams(window.location.search);
    const queryName = searchParams.get("name");
    if (queryName && !loaded.displayName) {
      loaded.displayName = queryName;
      saveUserState({ displayName: queryName }, slug);
    }
    setUserState(loaded);

    // Call /api/closing to fetch the light 10–30% dynamic accent sentence
    const fetchDynamicAccent = async () => {
      try {
        const res = await fetch("/api/closing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moods: [loaded.vibe || "late night rain", loaded.preferences?.atmosphere || "rain"],
            lines: [`for ${loaded.displayName || "you"}`],
          }),
        });
        const data = await res.json();
        if (data.closingLine) {
          setDynamicLine(data.closingLine);
        }
      } catch {
        setDynamicLine(`and just like that, the entire night turned into quiet light for ${loaded.displayName || "you"}.`);
      }
    };

    if (isRevealUnlocked(loaded)) {
      fetchDynamicAccent();
    }
  }, [slug]);

  const displayName = (mounted && userState?.displayName) || config.recipientName || "You";
  const theme = getTheme("tv-girl");
  const accentColor = resolveAccentColor(theme, userState?.themeState?.accent || "pink");
  const isUnlockedQuery = typeof window !== "undefined" && window.location.search.includes("unlocked=true");
  const unlocked = userState ? (isRevealUnlocked(userState) || isUnlockedQuery) : false;
  const progress = userState ? getRevealProgress(userState) : {
    gamesCount: 0,
    gamesNeeded: 2,
    didListen: false,
    didExploreArchive: false,
    isUnlocked: false,
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    setReplyError(null);

    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          message: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplySent(true);
        saveUserState({ replyMessage: replyText.trim() }, slug);
      } else {
        setReplyError(data.error || "Could not record message");
      }
    } catch {
      setReplyError("Connection lost. Your note was saved locally.");
      setReplySent(true);
      saveUserState({ replyMessage: replyText.trim() }, slug);
    } finally {
      setIsSendingReply(false);
    }
  };

  // If locked, render the clear guidance screen


  return (
    <div className="min-h-screen bg-[#09090B] text-[#F7F5EF] flex flex-col relative overflow-x-hidden select-none">
      <CuteParticles color={accentColor} />
      <div className="tv-scanlines opacity-20 pointer-events-none" aria-hidden="true" />

      <SiteNav
        slug={slug}
        displayName={displayName}
        color={accentColor}
        isRevealReady={true}
        onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12 relative z-10">
        {/* Intro sequence or full reveal */}
        <AnimatePresence mode="wait">
          {stage === "intro" ? (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-[2px] text-xs font-mono text-[#FF1685] uppercase tracking-widest animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MILESTONES COMPLETE</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
                  YOU FOUND EVERYTHING.
                </h1>
                <p className="font-serif italic text-base sm:text-lg text-[#D9D0BE] max-w-sm mx-auto">
                  &ldquo;and now... one last thing left unsaid.&rdquo;
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setStage("letter")}
                  className="px-8 py-3.5 bg-[#FF1685] hover:bg-[#FF3596] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,22,133,0.5)] active:scale-95"
                >
                  OPEN LETTER ♡
                </button>
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Physical Paper Letter Container */}
              <article
                id="keepsake-card"
                className="relative p-6 sm:p-10 bg-[#EEE8DA] text-[#111113] rounded-[3px] shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-6 overflow-hidden"
                style={{ transform: "rotate(-0.3deg)" }}
              >
                {/* Paper texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                {/* Letter Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-black/15 pb-3 text-[10px] font-mono tracking-widest text-[#111113]/70 uppercase">
                  <span>DISPATCH NO. 0894 // FOR {displayName.toUpperCase()}</span>
                  <span>● AUTHORED TRANSMISSION</span>
                </div>

                {/* Authored Letter Body (70-90% Authored) */}
                <div className="relative z-10 space-y-4">
                  <p className="font-serif italic text-base sm:text-lg text-[#111113] leading-relaxed whitespace-pre-line">
                    {config.content.finalLetterAuthored}
                  </p>
                </div>

                {/* Dynamic Groq Tailored Accent (10-30% Dynamic) */}
                {dynamicLine && (
                  <div className="relative z-10 pt-4 border-t border-black/15">
                    <p className="font-serif italic text-sm sm:text-base text-[#111113]/85 leading-relaxed">
                      &ldquo;{dynamicLine}&rdquo;
                    </p>
                  </div>
                )}

                {/* Letter Footer Signature */}
                <div className="relative z-10 pt-4 flex items-center justify-between text-[10px] font-mono text-[#111113]/60 uppercase">
                  <span>TUNED WITH LOVE</span>
                  <span className="flex items-center gap-1 font-bold text-[#111113]">
                    <span>ALWAYS</span>
                    <Heart className="w-3 h-3 fill-[#FF1685] text-[#FF1685]" />
                  </span>
                </div>
              </article>

              {/* Keepsake Download & Share */}
              <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#121215] border border-white/10 rounded-[2px]">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-[10px] font-mono tracking-widest text-[#AFA797] uppercase block">
                    KEEPSAKE SNAPSHOT
                  </span>
                  <p className="font-mono text-xs text-[#F7F5EF]">
                    save a high-resolution Polaroid card of your personalized world.
                  </p>
                </div>

                <SnapshotButton targetId="keepsake-card" slug={slug} />
              </section>

              {/* Neon DB "Send Something Back" Form */}
              <section className="p-6 sm:p-8 bg-[#121215] border border-white/15 rounded-[2px] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-white uppercase flex items-center gap-1.5">
                    <Send className="w-3 h-3 text-[#FF1685]" />
                    <span>SEND SOMETHING BACK // LEAVE A NOTE</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#AFA797] uppercase">
                    DIRECT DISPATCH
                  </span>
                </div>

                {!replySent ? (
                  <form onSubmit={handleSendReply} className="space-y-3 pt-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`write something back for the sender, ${displayName}...`}
                      rows={3}
                      maxLength={400}
                      className="w-full bg-[#0A0A0D] border border-white/20 focus:border-[#FF1685] p-3 text-xs sm:text-sm font-mono text-white placeholder-[#AFA797]/40 rounded-[2px] outline-none resize-none transition-colors"
                    />

                    {replyError && (
                      <p className="text-[11px] font-mono text-orange-400">{replyError}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#AFA797]">
                        {replyText.length} / 400 CHARS
                      </span>

                      <button
                        type="submit"
                        disabled={!replyText.trim() || isSendingReply}
                        className="px-5 py-2 bg-[#F7F5EF] hover:bg-white text-black disabled:opacity-40 font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSendingReply ? "TRANSMITTING..." : "SEND NOTE ♡"}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF1685] uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>NOTE RECEIVED &amp; STORED IN NEON DB</span>
                    </div>
                    <p className="font-serif italic text-xs text-[#D9D0BE]">
                      &ldquo;thank you, {displayName}. your message was delivered.&rdquo;
                    </p>
                  </div>
                )}
              </section>

              {/* Back to Home */}
              <div className="text-center pt-4 pb-12">
                <Link
                  href={`/${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#AFA797] hover:text-white uppercase tracking-widest transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>RETURN TO YOUR WORLD</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Spotify Player Drawer */}
      <SpotifyPlayer isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </div>
  );
}
