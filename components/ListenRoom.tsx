"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, Play, Pause, Disc, ArrowRight, CheckCircle2,
  SkipForward, SkipBack, Volume2, VolumeX, ChevronDown, ExternalLink
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import CuteParticles from "@/components/CuteParticles";
import TVVinyl from "@/components/tv/TVVinyl";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { loadUserState, saveUserState, isRevealUnlocked, UserState } from "@/lib/userState";
import { resolveAccentColor, getTheme } from "@/lib/themes";
import { TV_GIRL_RELEASES, TVGirlRelease, Track, formatDuration } from "@/lib/releases";

interface ListenRoomProps {
  slug: string;
}

export default function ListenRoom({ slug }: ListenRoomProps) {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<TVGirlRelease>(TV_GIRL_RELEASES[0]); // French Exit
  const [selectedTrack, setSelectedTrack] = useState<Track>(TV_GIRL_RELEASES[0].tracks[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [albumSelectorOpen, setAlbumSelectorOpen] = useState(false);
  const [audioAmplitude, setAudioAmplitude] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Audio amplitude pulse simulator
  useEffect(() => {
    if (!isPlaying) { setAudioAmplitude(0); return; }
    const interval = setInterval(() => {
      setAudioAmplitude(Math.random() * 0.5 + 0.15);
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = useCallback(() => {
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
  }, [isPlaying, userState, slug]);

  const handleSelectTrack = (track: Track) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    setShowTrackList(false);
    if (userState && !userState.interactions?.listenedToVinyl) {
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

  const handleNextTrack = () => {
    const idx = selectedRelease.tracks.findIndex(t => t.trackNumber === selectedTrack.trackNumber);
    const next = selectedRelease.tracks[(idx + 1) % selectedRelease.tracks.length];
    setSelectedTrack(next);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const idx = selectedRelease.tracks.findIndex(t => t.trackNumber === selectedTrack.trackNumber);
    const prev = selectedRelease.tracks[(idx - 1 + selectedRelease.tracks.length) % selectedRelease.tracks.length];
    setSelectedTrack(prev);
    setIsPlaying(true);
  };

  const handleSelectRelease = (release: TVGirlRelease) => {
    setSelectedRelease(release);
    setSelectedTrack(release.tracks[0]);
    setIsPlaying(true);
    setAlbumSelectorOpen(false);
    setShowTrackList(true);
  };

  const theme = getTheme("tv-girl");
  const accentColor = resolveAccentColor(theme, userState?.themeState?.accent || "pink");
  const revealReady = userState ? isRevealUnlocked(userState) : false;

  const youtubeEmbedUrl = selectedTrack.youtubeId
    ? `https://www.youtube.com/embed/${selectedTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&enablejsapi=1`
    : null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none"
      style={{ background: "linear-gradient(160deg, #FFF0F5 0%, #FDF2F8 40%, #FCE7F3 100%)" }}>
      <CuteParticles color="#F472B6" />

      {/* Top Nav */}
      <SiteNav
        slug={slug}
        displayName={displayName}
        color="#EC4899"
        isRevealReady={revealReady}
        onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 relative z-10">

        {/* Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase"
            style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#BE185D" }}>
            <Disc className="w-3 h-3" />
            <span>MUSIC ROOM · 33⅓ RPM</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight"
            style={{ color: "#4A0E2E" }}>
            THE LATE NIGHT RECORD
          </h1>
          <p className="font-serif italic text-sm max-w-md mx-auto" style={{ color: "#9D4A6E" }}>
            pick an album, pick a song — let it play softly while you exist.
          </p>
        </section>

        {/* Now Playing Player */}
        <section className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(20px)", border: "1.5px solid rgba(244,114,182,0.3)" }}>

          {/* Album selector pill */}
          <div className="p-4 border-b" style={{ borderColor: "rgba(244,114,182,0.2)" }}>
            <button
              onClick={() => setAlbumSelectorOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{ background: "rgba(244,114,182,0.1)", border: "1px solid rgba(236,72,153,0.2)" }}
            >
              <div className="text-left">
                <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#9D4A6E" }}>Now Playing From</div>
                <div className="font-display font-black text-sm mt-0.5" style={{ color: "#4A0E2E" }}>
                  {selectedRelease.title}
                </div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: "#BE185D" }}>
                  {selectedRelease.artist} · {selectedRelease.year} · {selectedRelease.typeLabel}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${albumSelectorOpen ? "rotate-180" : ""}`}
                style={{ color: "#EC4899" }}
              />
            </button>

            {/* Album dropdown */}
            <AnimatePresence>
              {albumSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 rounded-xl overflow-hidden"
                  style={{ border: "1px solid rgba(244,114,182,0.2)", background: "rgba(255,240,245,0.95)" }}
                >
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                    {TV_GIRL_RELEASES.map((rel) => (
                      <button
                        key={rel.id}
                        onClick={() => handleSelectRelease(rel)}
                        className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all"
                        style={{
                          background: selectedRelease.id === rel.id
                            ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(192,132,252,0.1))"
                            : "transparent",
                          border: selectedRelease.id === rel.id ? "1px solid rgba(236,72,153,0.3)" : "1px solid transparent",
                        }}
                      >
                        <div>
                          <div className="font-display font-bold text-xs" style={{ color: "#4A0E2E" }}>{rel.title}</div>
                          <div className="text-[9px] font-mono mt-0.5" style={{ color: "#9D4A6E" }}>
                            {rel.artist} · {rel.year} · {rel.tracks.length} tracks
                          </div>
                        </div>
                        {selectedRelease.id === rel.id && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#EC4899" }} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Turntable + Controls */}
          <div className="p-6 sm:p-8 flex flex-col items-center gap-6">
            {/* YouTube iframe (hidden, audio only) */}
            {youtubeEmbedUrl && (
              <div className="sr-only" aria-hidden="true">
                <iframe
                  ref={iframeRef}
                  key={`${selectedTrack.youtubeId}-${isPlaying}`}
                  src={youtubeEmbedUrl}
                  allow="autoplay; encrypted-media"
                  width="1"
                  height="1"
                />
              </div>
            )}

            {/* Vinyl */}
            <TVVinyl
              isPlaying={isPlaying}
              onToggle={handleTogglePlay}
              primaryColor="#EC4899"
              audioAmplitude={audioAmplitude}
              release={selectedRelease}
              recipientName={displayName}
            />

            {/* Now Playing Info */}
            <div className="text-center space-y-1">
              <motion.div
                key={selectedTrack.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-black text-lg"
                style={{ color: "#4A0E2E" }}
              >
                {selectedTrack.title}
              </motion.div>
              <div className="text-xs font-mono" style={{ color: "#BE185D" }}>
                {selectedRelease.artist} · Track {selectedTrack.trackNumber}/{selectedRelease.tracks.length}
                {selectedTrack.durationSec ? ` · ${formatDuration(selectedTrack.durationSec)}` : ""}
              </div>
              {!selectedTrack.youtubeId && (
                <div className="text-[10px] font-mono mt-1 px-3 py-1 rounded-full inline-flex items-center gap-1"
                  style={{ background: "rgba(244,114,182,0.15)", color: "#9D4A6E" }}>
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>Open on Bandcamp to listen</span>
                </div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button onClick={handlePrevTrack}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(244,114,182,0.15)", color: "#EC4899" }}>
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", color: "#fff", boxShadow: "0 6px 24px rgba(236,72,153,0.5)" }}>
                {isPlaying
                  ? <Pause className="w-6 h-6 fill-white" />
                  : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>

              <button onClick={handleNextTrack}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(244,114,182,0.15)", color: "#EC4899" }}>
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              <button onClick={() => setIsMuted(v => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(244,114,182,0.15)", color: isMuted ? "#9D4A6E" : "#EC4899" }}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Milestone Notice */}
            {userState?.interactions?.listenedToVinyl && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2.5 rounded-full flex items-center gap-2 text-[11px] font-mono"
                style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", color: "#BE185D" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#EC4899" }} />
                <span>VINYL INTERACTION RECORDED · MILESTONE ✓</span>
              </motion.div>
            )}
          </div>
        </section>

        {/* Full Track List */}
        <section className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,240,245,0.75)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.25)" }}>
          <button
            className="w-full flex items-center justify-between px-5 py-4"
            onClick={() => setShowTrackList(v => !v)}
          >
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" style={{ color: "#EC4899" }} />
              <span className="font-display font-bold text-sm" style={{ color: "#4A0E2E" }}>
                TRACKLIST — {selectedRelease.title.toUpperCase()}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showTrackList ? "rotate-180" : ""}`}
              style={{ color: "#EC4899" }}
            />
          </button>

          <AnimatePresence>
            {showTrackList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t"
                style={{ borderColor: "rgba(244,114,182,0.2)" }}
              >
                <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
                  {selectedRelease.tracks.map((track) => (
                    <button
                      key={track.trackNumber}
                      onClick={() => handleSelectTrack(track)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                      style={{
                        background: selectedTrack.trackNumber === track.trackNumber
                          ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(192,132,252,0.1))"
                          : "transparent",
                        border: selectedTrack.trackNumber === track.trackNumber
                          ? "1px solid rgba(236,72,153,0.3)"
                          : "1px solid transparent",
                      }}
                    >
                      <span className="font-mono text-[10px] w-5 text-right shrink-0" style={{ color: "#9D4A6E" }}>
                        {selectedTrack.trackNumber === track.trackNumber && isPlaying
                          ? "♪"
                          : track.trackNumber}
                      </span>
                      <span className="font-display font-bold text-xs flex-1" style={{ color: "#4A0E2E" }}>
                        {track.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {!track.youtubeId && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(244,114,182,0.15)", color: "#9D4A6E" }}>
                            BC
                          </span>
                        )}
                        {track.durationSec && (
                          <span className="text-[10px] font-mono" style={{ color: "#9D4A6E" }}>
                            {formatDuration(track.durationSec)}
                          </span>
                        )}
                        {selectedTrack.trackNumber !== track.trackNumber && (
                          <Play className="w-3 h-3" style={{ color: "#EC4899", opacity: 0.6 }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(244,114,182,0.2)" }}>
                  <span className="text-[10px] font-mono" style={{ color: "#9D4A6E" }}>
                    BC = Listen on Bandcamp · ♪ = Now Playing
                  </span>
                  <a href={selectedRelease.bandcampUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-mono transition-opacity hover:opacity-80"
                    style={{ color: "#EC4899" }}>
                    <ExternalLink className="w-3 h-3" />
                    <span>Open on Bandcamp</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Bottom Navigation */}
        <section className="pb-12">
          <div className="p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4"
            style={{ background: "rgba(255,240,245,0.7)", border: "1.5px solid rgba(244,114,182,0.2)" }}>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest uppercase block" style={{ color: "#9D4A6E" }}>NEXT STOP</span>
              <span className="text-sm font-serif italic" style={{ color: "#4A0E2E" }}>
                visit the archive to unearth what&apos;s been left for you.
              </span>
            </div>
            <Link href={`/${slug}/archive`}
              className="px-5 py-2.5 rounded-full flex items-center gap-2 text-white text-xs font-mono uppercase tracking-widest transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}>
              <span>GO TO ARCHIVE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <SpotifyPlayer isOpen={isSpotifyOpen} onClose={() => setIsSpotifyOpen(false)} />
    </div>
  );
}
