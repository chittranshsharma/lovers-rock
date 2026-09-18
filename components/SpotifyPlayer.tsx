"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Search, X, ExternalLink, Disc, Disc3 } from "lucide-react";
import { TV_GIRL_RELEASES, TVGirlRelease } from "@/lib/releases";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  previewUrl: string | null;
  durationMs: number;
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

interface SpotifyPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotifyPlayer({ isOpen, onClose }: SpotifyPlayerProps) {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchTracks = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setTracks([]);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      const res = await fetch("/api/spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (data.error) {
        setSearchError(data.error);
        setTracks([]);
      } else {
        setTracks(data.tracks || []);
      }
    } catch {
      setSearchError("Couldn't connect to Spotify broadcast.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchTracks(val), 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed bottom-6 right-4 sm:right-6 z-40 w-[340px] sm:w-[380px] bg-[var(--tv-surface)] border border-[rgba(247,245,239,0.22)] shadow-[0_12px_40px_rgba(0,0,0,0.85)] overflow-hidden"
          style={{ borderRadius: "3px" }}
        >
          {/* CRT Scanline accent */}
          <div className="tv-scanlines pointer-events-none" aria-hidden="true" style={{ opacity: 0.12 }} />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--tv-charcoal)] border-b border-[rgba(247,245,239,0.15)]">
            <div className="flex items-center gap-2">
              <Disc className="w-3.5 h-3.5 text-[var(--station-primary,#FF1685)] animate-spin-slow" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--tv-white)]">
                TAPE MONITOR · SPOTIFY
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--tv-cream)]/50 hover:text-[var(--tv-white)] transition-colors cursor-pointer p-1"
              aria-label="Close Spotify tape player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search input */}
          <div className="p-3 bg-[var(--tv-black)]/60 border-b border-[rgba(247,245,239,0.1)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--tv-cream)]/40" />
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search tracks, artists, songs..."
                className="w-full bg-[var(--tv-charcoal)] border border-[rgba(247,245,239,0.2)] pl-9 pr-8 py-2 text-xs font-mono text-[var(--tv-white)] placeholder-[var(--tv-cream)]/30 focus:outline-none focus:border-[var(--station-primary,#FF1685)]"
                style={{ borderRadius: "2px" }}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-[var(--station-primary,#FF1685)]/40 border-t-[var(--station-primary,#FF1685)] rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Quick-select Bandcamp discography releases */}
          <div className="px-3 py-2 bg-[var(--tv-black)]/90 border-b border-[rgba(247,245,239,0.1)] overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            <span className="text-[9px] font-mono text-[var(--tv-cream)]/40 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <Disc3 className="w-2.5 h-2.5" /> RELEASES:
            </span>
            {TV_GIRL_RELEASES.map((rel) => (
              <button
                key={rel.id}
                onClick={() => {
                  const q = rel.spotifyQuery || rel.title;
                  setQuery(q);
                  searchTracks(q);
                }}
                className="flex-shrink-0 px-2 py-0.5 bg-[var(--tv-charcoal)] hover:bg-[var(--tv-surface)] border border-white/10 hover:border-[var(--station-primary,#FF1685)]/50 rounded-[2px] text-[10px] font-mono text-[var(--tv-cream)] hover:text-white transition-all cursor-pointer whitespace-nowrap"
                title={`${rel.title} (${rel.year}) — ${rel.artist} · ${rel.typeLabel}`}
              >
                {rel.title} <span className="text-[8px] text-[var(--tv-cream)]/40">[{rel.type}]</span>
              </button>
            ))}
          </div>

          {/* Spotify iframe embed for selected track */}
          {selectedTrackId && (
            <div className="p-3 bg-[var(--tv-black)]/40 border-b border-[rgba(247,245,239,0.1)]">
              <iframe
                src={`https://open.spotify.com/embed/track/${selectedTrackId}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "2px" }}
                title="Spotify track player"
              />
            </div>
          )}

          {/* Track results list */}
          <div className="max-h-[240px] overflow-y-auto p-3 space-y-1.5">
            {searchError && (
              <p className="text-[11px] text-[var(--tv-orange)] font-mono py-2 text-center">{searchError}</p>
            )}

            {!isSearching && tracks.length === 0 && query.trim().length >= 2 && !searchError && (
              <p className="text-[11px] text-[var(--tv-cream)]/40 font-mono py-2 text-center">
                NO TRANSMISSIONS FOUND
              </p>
            )}

            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`w-full flex items-center gap-3 p-2 text-left transition-all cursor-pointer border ${
                  selectedTrackId === track.id
                    ? "bg-[var(--tv-charcoal)] border-[var(--station-primary,#FF1685)] text-[var(--tv-white)]"
                    : "bg-transparent border-transparent hover:bg-[var(--tv-charcoal)]/60 text-[var(--tv-cream)]"
                }`}
                style={{ borderRadius: "2px" }}
              >
                {track.albumArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.albumArt}
                    alt={track.album}
                    className="w-9 h-9 flex-shrink-0 object-cover border border-white/10"
                    style={{ borderRadius: "1px" }}
                  />
                ) : (
                  <div className="w-9 h-9 flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
                    <Music className="w-3.5 h-3.5 text-[var(--tv-cream)]/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-medium truncate text-[var(--tv-white)]">
                    {track.name}
                  </p>
                  <p className="text-[11px] font-mono text-[var(--tv-cream)]/60 truncate">
                    {track.artist}
                  </p>
                </div>
                <span className="text-[10px] text-[var(--tv-cream)]/40 flex-shrink-0 font-mono">
                  {formatDuration(track.durationMs)}
                </span>
              </button>
            ))}
          </div>

          {/* Footer status */}
          <div className="px-3 py-2 bg-[var(--tv-charcoal)] border-t border-[rgba(247,245,239,0.15)] flex items-center justify-between">
            <span className="text-[9px] font-mono text-[var(--tv-cream)]/40 uppercase tracking-widest">
              BROADCAST SIGNAL SYNC
            </span>
            {selectedTrackId && (
              <a
                href={`https://open.spotify.com/track/${selectedTrackId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--station-primary,#FF1685)] hover:underline flex items-center gap-1 text-[10px] font-mono uppercase"
                title="Open in Spotify"
              >
                <span>OPEN</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
