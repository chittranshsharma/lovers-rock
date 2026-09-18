"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Check,
  Music,
  QrCode,
  Radio,
  X,
} from "lucide-react";

import Starfield, { StarPoint } from "@/components/Starfield";
import MoodChips from "@/components/MoodChips";
import Typewriter from "@/components/Typewriter";
import RevealSequence from "@/components/RevealSequence";
import CustomCursor from "@/components/CustomCursor";
import CursorTrail from "@/components/CursorTrail";
import AmbientAudio from "@/components/AmbientAudio";
import GradientMesh from "@/components/GradientMesh";
import HandwritingSVG from "@/components/HandwritingSVG";
import AestheticOnboarding from "@/components/AestheticOnboarding";
import SlotMachine from "@/components/SlotMachine";
import ConstellationQuiz from "@/components/ConstellationQuiz";
import ScratchReveal from "@/components/ScratchReveal";
import QRDisplay from "@/components/QRDisplay";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import MagneticButton from "@/components/MagneticButton";

// TV Girl Visual Components
import TVDial from "@/components/tv/TVDial";
import TVSignalLoss from "@/components/tv/TVSignalLoss";
import TVVinyl from "@/components/tv/TVVinyl";
import TVHeroPhoto from "@/components/tv/TVHeroPhoto";
import { stations, Station, DEFAULT_STATION } from "@/lib/stations";

interface VisitData {
  visit_count: number;
  is_return: boolean;
  stars_built: number;
}

interface TVGirlExperienceProps {
  slug: string;
}

export default function TVGirlExperience({ slug }: TVGirlExperienceProps) {
  // Single Source of Truth: Station State
  const [currentStation, setCurrentStation] = useState<Station>(DEFAULT_STATION);
  const [isSignalLoss, setIsSignalLoss] = useState<boolean>(false);
  const [isPlayingVinyl, setIsPlayingVinyl] = useState<boolean>(false);

  // Core Data States
  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [userStars, setUserStars] = useState<StarPoint[]>([]);
  const [moodHistory, setMoodHistory] = useState<string[]>([]);
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Calibration modal on first-ever visit
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [hasPickedAesthetic, setHasPickedAesthetic] = useState<boolean>(false);

  // Secondary utility overlays (strictly hidden by default)
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showSpotify, setShowSpotify] = useState<boolean>(false);
  const [showHandwriting, setShowHandwriting] = useState<boolean>(false);
  const [showScratch, setShowScratch] = useState<boolean>(false);
  const [scratchMessage, setScratchMessage] = useState<string>("");
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Interaction Points
  const [interactionPoints, setInteractionPoints] = useState<number>(0);
  const REVEAL_THRESHOLD = 4;
  const progressPercent = Math.min(
    100,
    Math.round((interactionPoints / (REVEAL_THRESHOLD * 3)) * 100)
  );

  // Easter egg counter
  const dblClickRef = useRef<NodeJS.Timeout | null>(null);
  const dblClickCountRef = useRef(0);

  // Strict Token Synchronization
  const applyStationTokens = useCallback((station: Station) => {
    document.documentElement.style.setProperty("--station-primary", station.primary);
    document.documentElement.style.setProperty("--station-secondary", station.secondary);
    document.documentElement.style.setProperty("--station-bg-base", station.bgBase);
    document.documentElement.style.setProperty("--bg-color", station.bgBase);
    document.documentElement.style.setProperty("--accent-pink", station.primary);
    document.documentElement.style.setProperty("--accent-glow", station.secondary);
  }, []);

  useEffect(() => {
    applyStationTokens(currentStation);
  }, [currentStation, applyStationTokens]);

  // SessionStorage Hydration
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`lc_session_${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.userStars) setUserStars(parsed.userStars);
        if (parsed.moodHistory) setMoodHistory(parsed.moodHistory);
        if (parsed.generatedLines) setGeneratedLines(parsed.generatedLines);
        if (parsed.currentLine) setCurrentLine(parsed.currentLine);
        if (parsed.quizComplete) setQuizComplete(parsed.quizComplete);
        if (parsed.interactionPoints) setInteractionPoints(parsed.interactionPoints);
        if (parsed.stationId) {
          const matched = stations.find((s) => s.id === parsed.stationId);
          if (matched) setCurrentStation(matched);
        }
      }
    } catch {
      /* sessionStorage blocked */
    }
  }, [slug]);

  // SessionStorage Persistence
  useEffect(() => {
    try {
      sessionStorage.setItem(
        `lc_session_${slug}`,
        JSON.stringify({
          userStars,
          moodHistory,
          generatedLines,
          currentLine,
          quizComplete,
          interactionPoints,
          stationId: currentStation.id,
        })
      );
    } catch {
      /* sessionStorage blocked */
    }
  }, [
    userStars,
    moodHistory,
    generatedLines,
    currentLine,
    quizComplete,
    interactionPoints,
    currentStation,
    slug,
  ]);

  // Visit logging & First-time onboarding check
  useEffect(() => {
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((res) => res.json())
      .then((data: VisitData) => {
        setVisitData(data);
        if (!data.is_return && moodHistory.length === 0) {
          setShowOnboarding(true);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Milestone confetti (monochrome & station accent paper flecks)
  useEffect(() => {
    const milestones = new Set<number>();
    const handleScroll = () => {
      const pct = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      for (const m of [25, 50, 75]) {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m);
          confetti({
            particleCount: 20,
            spread: 45,
            origin: { x: Math.random(), y: 0.5 },
            colors: [currentStation.primary, "#F7F5EF", "#EEE8DA", "#151518"],
            shapes: ["square"],
            scalar: 0.8,
          });
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentStation]);

  const addInteractionPoint = useCallback(() => {
    setInteractionPoints((p) => Math.min(p + 1, REVEAL_THRESHOLD * 3));
  }, []);

  // Station Change Handler (Single Source of Truth)
  const handleStationChange = (newStation: Station) => {
    setCurrentStation(newStation);
    applyStationTokens(newStation);
    addInteractionPoint();
    if ("vibrate" in navigator) navigator.vibrate(10);
  };

  const triggerSignalLoss = () => {
    setIsSignalLoss(true);
  };

  // Mood Selection Handler
  const handleMoodSelect = async (mood: string) => {
    if (isLoading) return;

    if (!audioUnlocked) setAudioUnlocked(true);

    setActiveMood(mood);
    setIsLoading(true);
    addInteractionPoint();

    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          slug,
          stationFreq: currentStation.frequency,
          stationMood: currentStation.mood,
          groqHint: currentStation.groqPrompt,
        }),
      });
      const data = await res.json();
      const newLine = data.line || `Static drifting in the frequency of ${mood}.`;

      const newStar: StarPoint = {
        id: `${Date.now()}-${Math.random()}`,
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 9,
        z: (Math.random() - 0.5) * 6,
        color: currentStation.primary || "#FF1685",
        glowColor: currentStation.secondary || "#145BFF",
        size: 0.16 + Math.random() * 0.1,
        mood,
      };

      setUserStars((prev) => [...prev, newStar]);
      setMoodHistory((prev) => [...prev, mood]);
      setGeneratedLines((prev) => [...prev, newLine]);
      setCurrentLine(newLine);

      if (moodHistory.length === 0) setShowHandwriting(true);
      if (moodHistory.length === 1 && !scratchMessage) {
        setScratchMessage("even the quiet between the tracks is part of the broadcast.");
        setShowScratch(true);
      }
      if (moodHistory.length === 2 && !quizComplete) setShowQuiz(true);

      if ("vibrate" in navigator) navigator.vibrate(12);
    } catch (err) {
      console.error("Mood transmission error:", err);
      setCurrentLine(`Static interference on FM ${currentStation.frequency} (${mood}).`);
    } finally {
      setIsLoading(false);
    }
  };

  // Headline Easter Egg
  const handleHeadlineClick = () => {
    dblClickCountRef.current++;
    if (dblClickRef.current) clearTimeout(dblClickRef.current);
    dblClickRef.current = setTimeout(() => {
      dblClickCountRef.current = 0;
    }, 400);

    if (dblClickCountRef.current >= 2) {
      dblClickCountRef.current = 0;
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.4 },
        colors: [currentStation.primary, currentStation.secondary, "#F7F5EF"],
        shapes: ["square"],
        scalar: 1.0,
      });
      if ("vibrate" in navigator) navigator.vibrate([15, 10, 20]);
    }
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isRevealTriggered = moodHistory.length >= REVEAL_THRESHOLD;

  return (
    <main
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-[var(--station-primary,#FF1685)] selection:text-white"
      style={{
        backgroundColor: "#09090B",
        color: "#F7F5EF",
      }}
    >
      {/* Film Scanlines (subtle CRT texture) */}
      <div className="tv-scanlines pointer-events-none" aria-hidden="true" style={{ opacity: 0.12 }} />

      {/* Signal Loss Overlay */}
      <TVSignalLoss
        isActive={isSignalLoss}
        onComplete={() => setIsSignalLoss(false)}
      />

      {/* Onboarding Station Calibration */}
      <AnimatePresence>
        {showOnboarding && !hasPickedAesthetic && (
          <AestheticOnboarding
            onSelect={(stationId) => {
              setHasPickedAesthetic(true);
              setShowOnboarding(false);
              const selected = stations.find((s) => s.id === stationId);
              if (selected) {
                setCurrentStation(selected);
                applyStationTokens(selected);
              }
              try {
                localStorage.setItem(`lc_aesthetic_${slug}`, stationId);
              } catch {}
            }}
          />
        )}
      </AnimatePresence>

      {/* Base Canvas Layers */}
      <GradientMesh />
      <CustomCursor />
      <CursorTrail />

      {/* 3D Starfield with calibrated non-blooming background dust */}
      <Starfield
        userStars={userStars}
        isBloomActive={isRevealTriggered}
        onCanvasReady={setCanvasElement}
      />

      {/* Spotify floating tape monitor */}
      <SpotifyPlayer isOpen={showSpotify} onClose={() => setShowSpotify(false)} />

      {/* ============================================================ */}
      {/* 6. ANALOG BROADCAST HEADER                                   */}
      {/* ============================================================ */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between border-b border-[rgba(247,245,239,0.12)]">
        {/* Left: Authentic Analog Broadcast Identity */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-tight text-[#F7F5EF]">
                TV GIRL
              </span>
              <span
                className="font-mono text-[10px] tracking-widest px-1.5 py-0.5 bg-[#151518] border border-white/10 rounded-[1px] font-bold"
                style={{ color: currentStation.primary }}
              >
                FM {currentStation.frequency}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#AFA797] uppercase tracking-wider mt-0.5">
              <span>NIGHT TRANSMISSION</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: currentStation.primary }}
                />
                <span className="text-[#F7F5EF]/90 font-semibold">ON AIR</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Small, Quiet Secondary Utilities */}
        <div className="flex items-center gap-2">
          {visitData && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#121215] border border-white/10 text-[10px] font-mono text-[#AFA797] rounded-[1px]">
              <span className="uppercase">
                {visitData.visit_count === 1 ? "FIRST SIGNAL" : `BROADCAST #${visitData.visit_count}`}
                {visitData.stars_built > 0 && ` · ${visitData.stars_built} STARS`}
              </span>
            </div>
          )}

          <AmbientAudio isUnlocked={audioUnlocked || isPlayingVinyl} />

          {/* Spotify Tape Monitor Button */}
          <MagneticButton strength={0.2}>
            <button
              onClick={() => setShowSpotify((p) => !p)}
              className={`p-2 rounded-[2px] border transition-all cursor-pointer ${
                showSpotify
                  ? "bg-[#151518] border-[var(--station-primary,#FF1685)] text-white"
                  : "bg-[#121215] border-white/10 text-[#AFA797] hover:text-[#F7F5EF] hover:border-white/25"
              }`}
              title="Spotify tape monitor"
              aria-label="Toggle Spotify monitor"
            >
              <Music className="w-3.5 h-3.5" style={{ color: currentStation.primary }} />
            </button>
          </MagneticButton>

          {/* QR Archival Utility Button */}
          <button
            onClick={() => setShowQR((p) => !p)}
            className={`p-2 rounded-[2px] border transition-all cursor-pointer ${
              showQR
                ? "bg-[#151518] border-[var(--station-primary,#FF1685)] text-white"
                : "bg-[#121215] border-white/10 text-[#AFA797] hover:text-[#F7F5EF] hover:border-white/25"
            }`}
            title="Archival QR code"
            aria-label="Toggle archival QR code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          {/* Share Transmission Link */}
          <MagneticButton strength={0.2}>
            <button
              onClick={handleShareLink}
              className="p-2 bg-[#121215] border border-white/10 hover:border-white/25 text-[#AFA797] hover:text-[#F7F5EF] transition-all cursor-pointer rounded-[2px]"
              title="Copy transmission link"
              aria-label="Share transmission"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-[#20DDB6]" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </MagneticButton>
        </div>
      </header>

      {/* 7. REDUCED QR UTILITY OVERLAY (Archival Drawer, Minimal) */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-18 right-4 sm:right-8 z-40 bg-[#121215] border border-white/20 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] rounded-[2px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] text-[#AFA797] uppercase tracking-widest">
                ARCHIVAL TRANSMISSION LINK
              </span>
              <button
                onClick={() => setShowQR(false)}
                className="text-[#AFA797] hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <QRDisplay
              url={
                typeof window !== "undefined"
                  ? window.location.href
                  : `https://loversrock.vercel.app/${slug}`
              }
              slug={slug}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 2, 3, 4: EDITORIAL HERO COMPOSITION WITH PHOTOGRAPHY ANCHOR */}
      {/* ============================================================ */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN (Cols 1-6): Heavy Grotesk Typography & Radio Tuner Console */}
          <div className="lg:col-span-6 flex flex-col text-left space-y-6">
            
            {/* Micro Metadata Kicker */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#AFA797]">
                <span
                  className="font-bold transition-colors duration-300"
                  style={{ color: currentStation.primary }}
                >
                  {currentStation.frequency} FM
                </span>
                <span>//</span>
                <span>NIGHT TRANSMISSION</span>
              </div>
            </div>

            {/* Oversized Montserrat ExtraBold / Black Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-0 select-none cursor-pointer"
              onClick={handleHeadlineClick}
              title="Double-click for analog flash"
            >
              <div className="font-display font-black text-6xl sm:text-8xl md:text-9xl leading-[0.82] tracking-tighter text-[#F7F5EF] uppercase">
                TV
              </div>
              <div
                className="font-display font-black text-6xl sm:text-8xl md:text-9xl leading-[0.82] tracking-tighter uppercase transition-colors duration-500"
                style={{ color: currentStation.primary }}
              >
                GIRL
              </div>
              <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-[#AFA797] uppercase mt-3 font-semibold flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>SIGNAL FOUND · {currentStation.title}</span>
              </div>
            </motion.div>

            {/* Secondary Editorial Copy (Libre Baskerville Italic) */}
            <p className="font-serif italic text-sm sm:text-base text-[#D9D0BE] max-w-md leading-relaxed">
              {visitData?.is_return ? (
                <span>
                  You came back. The night air still hums in the key of{" "}
                  <span className="font-semibold" style={{ color: currentStation.primary }}>
                    {currentStation.title}
                  </span>
                  .
                </span>
              ) : (
                <span>
                  A forgotten transmission colorized in 35mm film grain, calibrated to the analog frequency of{" "}
                  <span className="font-semibold" style={{ color: currentStation.primary }}>
                    {currentStation.title}
                  </span>
                  .
                </span>
              )}
            </p>

            {/* Tuner Unit (Asymmetric, Compact Horizontal Physical Console) */}
            <div className="pt-2 max-w-md">
              <TVDial
                station={currentStation}
                onStationChange={handleStationChange}
                onSignalLoss={triggerSignalLoss}
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Cols 7-12): Dominant Vintage Photograph Anchor + Overlapping Vinyl Record */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* Dominant Vintage Photograph (Original 1970s Flash Photography) */}
            <div className="relative z-10">
              <TVHeroPhoto
                primaryColor={currentStation.primary}
                secondaryColor={currentStation.secondary}
                frequency={currentStation.frequency}
                className="transform -rotate-[0.8deg] hover:rotate-0 transition-transform duration-500"
              />
            </div>

            {/* Overlapping Floating Vinyl Record (Asymmetrical Physical Artifact) */}
            <motion.div
              className="absolute -bottom-10 -right-4 sm:-bottom-8 sm:-right-8 z-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div
                className="p-3 bg-[#0d0d10] border border-[rgba(247,245,239,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.95)] rounded-[2px]"
                style={{ transform: "rotate(2.2deg)" }}
              >
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[#AFA797] mb-2 px-1">
                  <span>33 RPM DISK</span>
                  <span style={{ color: currentStation.primary }}>
                    {isPlayingVinyl ? "SPINNING ●" : "TOUCH TO PLAY"}
                  </span>
                </div>
                <TVVinyl
                  isPlaying={isPlayingVinyl}
                  onToggle={() => {
                    setIsPlayingVinyl((p) => !p);
                    if (!audioUnlocked) setAudioUnlocked(true);
                  }}
                  primaryColor={currentStation.primary}
                  audioAmplitude={isPlayingVinyl ? 0.4 : 0}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* POETIC SIGNAL (Typewriter + Groq Dispatch)                   */}
        {/* ============================================================ */}
        <div className="mt-14 mb-8 max-w-3xl mx-auto w-full text-center">
          <div className="min-h-[85px] flex items-center justify-center px-4">
            {isLoading ? (
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#AFA797] animate-pulse">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: currentStation.primary }}
                />
                <span>DECODING TRANSMISSION DISPATCH...</span>
              </div>
            ) : currentLine ? (
              <Typewriter
                text={currentLine}
                speed={35}
                className="text-xl sm:text-2xl text-[#F7F5EF] font-serif italic leading-relaxed"
                stationFreq={currentStation.frequency}
              />
            ) : (
              <div className="border border-white/10 px-4 py-2 bg-[#121215] inline-block rounded-[1px]">
                <p className="text-xs font-mono uppercase tracking-widest text-[#AFA797]">
                  SELECT A MOOD CHIP TO TRANSMIT YOUR FIRST STAR INTO THE SKY
                </p>
              </div>
            )}
          </div>

          {/* Handwriting Signature Stroke */}
          <AnimatePresence>
            {showHandwriting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="my-3"
              >
                <HandwritingSVG trigger={showHandwriting} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signal Accumulation Bar */}
          {!isRevealTriggered && moodHistory.length > 0 && (
            <div className="w-full max-w-xs mx-auto mt-4 mb-3">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#AFA797] mb-1.5">
                <span>SIGNAL DENSITY</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-[1px] overflow-hidden">
                <motion.div
                  className="h-full rounded-[1px] transition-colors duration-500"
                  style={{ backgroundColor: currentStation.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Mood Chips Section */}
          {!isRevealTriggered && (
            <div className="mt-4">
              <MoodChips
                onSelectMood={handleMoodSelect}
                isLoading={isLoading}
                activeMood={activeMood}
              />
            </div>
          )}

          {/* Star Counter Indicators */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: REVEAL_THRESHOLD }).map((_, i) => (
              <motion.div
                key={i}
                animate={i < moodHistory.length ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="w-2.5 h-2.5 border transition-all duration-300"
                style={{
                  borderRadius: "1px",
                  borderColor:
                    i < moodHistory.length
                      ? currentStation.primary
                      : "rgba(247,245,239,0.25)",
                  backgroundColor:
                    i < moodHistory.length ? currentStation.primary : "transparent",
                  boxShadow:
                    i < moodHistory.length
                      ? `0 0 10px ${currentStation.primary}`
                      : "none",
                }}
              />
            ))}
            <span className="text-[11px] font-mono text-[#AFA797] ml-2 uppercase tracking-wider">
              {moodHistory.length} / {REVEAL_THRESHOLD} EMISSIONS CAPTURED
            </span>
          </div>
        </div>

        {/* Sequential Artifact Unlocks */}
        <div className="max-w-xl mx-auto w-full space-y-4">
          <SlotMachine isUnlocked={moodHistory.length >= 2} />
          <ScratchReveal message={scratchMessage} isVisible={showScratch} />

          {/* Constellation Quiz */}
          <AnimatePresence>
            {showQuiz && !quizComplete && !isRevealTriggered && (
              <ConstellationQuiz
                onComplete={(answers) => {
                  setQuizComplete(true);
                  setShowQuiz(false);
                  console.log("Quiz calibration:", answers);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Final Reveal Sequence */}
        <AnimatePresence>
          {isRevealTriggered && (
            <RevealSequence
              slug={slug}
              moodHistory={moodHistory}
              generatedLines={generatedLines}
              canvasElement={canvasElement}
              stationFreq={currentStation.frequency}
              stationPrimary={currentStation.primary}
              onReset={() => {
                setMoodHistory([]);
                setCurrentLine(null);
                setInteractionPoints(0);
                setShowHandwriting(false);
                setShowScratch(false);
                setShowQuiz(false);
                setQuizComplete(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* 8. ANALOG EDITORIAL FOOTER                                   */}
      {/* ============================================================ */}
      <footer className="relative z-30 w-full max-w-6xl mx-auto px-6 py-6 text-center text-[10px] font-mono text-[#AFA797] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[rgba(247,245,239,0.1)]">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: currentStation.primary }}
          />
          <span className="uppercase tracking-widest text-[#F7F5EF]/80">
            TV GIRL BROADCAST ARCHIVE · FM {currentStation.frequency} · #{slug.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3 tracking-wider uppercase">
          <span>GROQ LLM</span>
          <span>·</span>
          <span>NEON PG</span>
          <span>·</span>
          <span>SPOTIFY API</span>
          <span>·</span>
          <span>35MM EPHEMERA</span>
        </div>
      </footer>
    </main>
  );
}
