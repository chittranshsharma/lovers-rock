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
  const revealReady = userState ? isRevealUnlocked(userState) : false;

  // Accent color mapping for album vinyls
  const albumColors: Record<string, string> = {
    "french-exit": "#EC4899",
    "who-really-cares": "#3B82F6",
    "death-of-a-party-girl": "#EF4444",
    "grapes-upon-the-vine": "#8B5CF6",
    "fauxllennium": "#06B6D4",
    "summers-over": "#F97316",
    "lonely-women": "#D946EF",
    "natalie-wood": "#EAB308",
    "the-night-in-question-french-exit-outtakes": "#C084FC",
    "maddie-acids-purple-hearts-club-band": "#A855F7",
    "aestheticadelica": "#10B981",
  };
  const activeColor = albumColors[selectedRelease.id] || "#EC4899";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden select-none bg-[#120912] text-[#FCE7F3]">
      <CuteParticles color={activeColor} />

      {/* Top Nav */}
      <SiteNav
        slug={slug}
        displayName={displayName}
        color={activeColor}
        isRevealReady={revealReady}
        onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 relative z-10">

        {/* Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase"
            style={{ background: `${activeColor}22`, border: `1px solid ${activeColor}55`, color: activeColor }}>
            <Disc className="w-3.5 h-3.5" style={{ color: activeColor }} />
            <span>MUSIC ROOM · 33⅓ RPM</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#FCE7F3]">
            THE LATE NIGHT RECORD
          </h1>
          <p className="font-serif italic text-sm max-w-md mx-auto text-[#F472B6]">
            select an album vinyl to spin, tap to listen on YouTube or Spotify.
          </p>
        </section>

        {/* Now Playing Player */}
        <section className="rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500"
          style={{ background: "rgba(30,15,27,0.85)", backdropFilter: "blur(20px)", border: `1.5px solid ${activeColor}44` }}>

          {/* Album selector pill */}
          <div className="p-4 border-b" style={{ borderColor: `${activeColor}33` }}>
            <button
              onClick={() => setAlbumSelectorOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer"
              style={{ background: `${activeColor}15`, border: `1px solid ${activeColor}44` }}
            >
              <div className="text-left">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#F472B6]">Now Playing From</div>
                <div className="font-display font-black text-sm mt-0.5 text-[#FCE7F3]">
                  {selectedRelease.title}
                </div>
                <div className="text-[10px] font-mono mt-0.5 text-[#F472B6]">
                  {selectedRelease.artist} · {selectedRelease.year} · {selectedRelease.typeLabel}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${albumSelectorOpen ? "rotate-180" : ""}`}
                style={{ color: activeColor }}
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
                  style={{ border: `1px solid ${activeColor}44`, background: "rgba(20,10,18,0.95)" }}
                >
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                    {TV_GIRL_RELEASES.map((rel) => {
                      const relColor = albumColors[rel.id] || "#EC4899";
                      return (
                        <button
                          key={rel.id}
                          onClick={() => handleSelectRelease(rel)}
                          className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer"
                          style={{
                            background: selectedRelease.id === rel.id
                              ? `linear-gradient(135deg, ${relColor}40, rgba(192,132,252,0.15))`
                              : "transparent",
                            border: selectedRelease.id === rel.id ? `1px solid ${relColor}66` : "1px solid transparent",
                          }}
                        >
                          <div>
                            <div className="font-display font-bold text-xs text-[#FCE7F3]">{rel.title}</div>
                            <div className="text-[9px] font-mono mt-0.5 text-[#F472B6]">
                              {rel.artist} · {rel.year} · {rel.tracks.length} tracks
                            </div>
                          </div>
                          {selectedRelease.id === rel.id && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: relColor }} />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hardcoded Vinyl Record Player */}
          <div className="p-6 sm:p-8 flex flex-col items-center gap-6">

            <TVVinyl
              isPlaying={isPlaying}
              onToggle={handleTogglePlay}
              primaryColor={activeColor}
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
                className="font-display font-black text-lg text-[#FCE7F3]"
              >
                {selectedTrack.title}
              </motion.div>
              <div className="text-xs font-mono text-[#F472B6]">
                {selectedRelease.artist} · Track {selectedTrack.trackNumber}/{selectedRelease.tracks.length}
                {selectedTrack.durationSec ? ` · ${formatDuration(selectedTrack.durationSec)}` : ""}
              </div>

              {/* Direct External Action Links */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
                {selectedRelease.youtubePlaylistUrl ? (
                  <a
                    href={selectedRelease.youtubePlaylistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono font-bold px-4 py-2 rounded-full inline-flex items-center gap-2 transition-all hover:scale-105 shadow-md cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)", color: "#FFFFFF" }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>LISTEN ON YOUTUBE PLAYLIST</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                ) : selectedTrack.youtubeId ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedTrack.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono font-bold px-4 py-2 rounded-full inline-flex items-center gap-2 transition-all hover:scale-105 shadow-md cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #FF0000, #CC0000)", color: "#FFFFFF" }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY SONG ON YOUTUBE</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                ) : null}
                <a
                  href={selectedRelease.bandcampUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                  style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#F472B6" }}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>BANDCAMP</span>
                </a>
                <button
                  onClick={() => setIsSpotifyOpen(true)}
                  className="text-[10px] font-mono px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                  style={{ background: "rgba(192,132,252,0.15)", border: "1px solid rgba(192,132,252,0.3)", color: "#C084FC" }}
                >
                  <Music className="w-3 h-3" />
                  <span>SPOTIFY TAPE</span>
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button onClick={handlePrevTrack}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{ background: "rgba(236,72,153,0.2)", color: "#EC4899" }}>
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button onClick={handleTogglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", color: "#fff", boxShadow: "0 6px 24px rgba(236,72,153,0.5)" }}>
                {isPlaying
                  ? <Pause className="w-6 h-6 fill-white" />
                  : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>

              <button onClick={handleNextTrack}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{ background: "rgba(236,72,153,0.2)", color: "#EC4899" }}>
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              <button onClick={() => setIsMuted(v => !v)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{ background: "rgba(236,72,153,0.2)", color: isMuted ? "#F472B6" : "#EC4899" }}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </section>

        {/* Full Track List */}
        <section className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(30,15,27,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(236,72,153,0.3)" }}>
          <button
            className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
            onClick={() => setShowTrackList(v => !v)}
          >
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#EC4899]" />
              <span className="font-display font-bold text-sm text-[#FCE7F3]">
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
                style={{ borderColor: "rgba(236,72,153,0.2)" }}
              >
                <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
                  {selectedRelease.tracks.map((track) => (
                    <button
                      key={track.trackNumber}
                      onClick={() => handleSelectTrack(track)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer"
                      style={{
                        background: selectedTrack.trackNumber === track.trackNumber
                          ? "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(192,132,252,0.15))"
                          : "transparent",
                        border: selectedTrack.trackNumber === track.trackNumber
                          ? "1px solid rgba(236,72,153,0.4)"
                          : "1px solid transparent",
                      }}
                    >
                      <span className="font-mono text-[10px] w-5 text-right shrink-0 text-[#F472B6]">
                        {selectedTrack.trackNumber === track.trackNumber && isPlaying
                          ? "♪"
                          : track.trackNumber}
                      </span>
                      <span className="font-display font-bold text-xs flex-1 text-[#FCE7F3]">
                        {track.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {track.youtubeId ? (
                          <a
                            href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-red-600/30 text-red-400 transition-colors"
                            title="Play track on YouTube"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : selectedRelease.youtubePlaylistUrl ? (
                          <a
                            href={selectedRelease.youtubePlaylistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-red-600/30 text-red-400 transition-colors"
                            title="Open album playlist on YouTube"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : null}
                        {track.durationSec && (
                          <span className="text-[10px] font-mono text-[#F472B6]">
                            {formatDuration(track.durationSec)}
                          </span>
                        )}
                        {selectedTrack.trackNumber !== track.trackNumber && (
                          <Play className="w-3 h-3 text-[#EC4899] opacity-70" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(236,72,153,0.2)" }}>
                  <span className="text-[10px] font-mono text-[#F472B6]">
                    BC = Bandcamp · ♪ = Selected Track
                  </span>
                  <a href={selectedRelease.bandcampUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-mono transition-opacity hover:opacity-80 text-[#EC4899]">
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
            style={{ background: "rgba(30,15,27,0.85)", border: "1.5px solid rgba(236,72,153,0.25)" }}>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest uppercase block text-[#F472B6]">NEXT STOP</span>
              <span className="text-sm font-serif italic text-[#FCE7F3]">
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
