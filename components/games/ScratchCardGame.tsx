"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface ScratchCardGameProps {
  displayName: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete: () => void;
}

export default function ScratchCardGame({
  displayName,
  color = "#FF1685",
  isAlreadyCompleted = false,
  onComplete,
}: ScratchCardGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealPercent, setRevealPercent] = useState(isAlreadyCompleted ? 100 : 0);
  const [isRevealed, setIsRevealed] = useState(isAlreadyCompleted);

  const personalizedNote = `p.s.

you make ordinary days feel like a scene from an old film, ${displayName || "you"}.

the kind where nothing loud happens, but you remember the light for years.`;

  useEffect(() => {
    if (isAlreadyCompleted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with vintage charcoal scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#25252b");
    gradient.addColorStop(0.5, "#18181c");
    gradient.addColorStop(1, "#212127");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative scratch foil lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = -canvas.height; i < canvas.width; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + canvas.height, canvas.height);
      ctx.stroke();
    }

    // Scratch instruction in IBM Plex Mono
    ctx.font = "bold 11px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(247,245,239,0.75)";
    ctx.textAlign = "center";
    ctx.fillText("SOMEONE LEFT YOU SOMETHING", canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(217,208,190,0.45)";
    ctx.fillText("[ SCRATCH TO REVEAL ]", canvas.width / 2, canvas.height / 2 + 12);
  }, [isAlreadyCompleted]);

  const getScratchPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getScratchPos(e, canvas);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Approximate scratch progress
    setRevealPercent((prev) => {
      const next = Math.min(prev + 2.5, 100);
      if (next >= 65 && !isRevealed) {
        setIsRevealed(true);
        onComplete();
      }
      return next;
    });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <div className="relative bg-[#111114] border border-[rgba(247,245,239,0.18)] rounded-[3px] overflow-hidden p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span>02 // SCRATCH CARD</span>
          </div>
          <div className="flex items-center gap-1">
            <span>SCRATCHED:</span>
            <span className="font-bold text-white px-1.5 py-0.5 bg-black/60 rounded-[2px] border border-white/10">
              {Math.min(Math.round(revealPercent), 100)}%
            </span>
          </div>
        </div>

        {/* Scratch Surface Area */}
        <div className="relative w-full h-[260px] sm:h-[280px] mt-4 rounded-[2px] overflow-hidden bg-[#EEE8DA] text-[#111113] p-6 flex flex-col justify-center shadow-inner">
          {/* Paper Texture Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Underlying Hidden Personalized Content */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#111113]/60 uppercase border-b border-[#111113]/15 pb-1">
              <span>SPECIAL DISPATCH // FOR {displayName ? displayName.toUpperCase() : "YOU"}</span>
              <span>● AUTHORED</span>
            </div>

            <p className="font-serif italic text-base sm:text-lg text-[#111113] leading-relaxed whitespace-pre-line">
              {personalizedNote}
            </p>
          </div>

          {/* Interactive Scratch Canvas Overlay */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseLeave={() => setIsScratching(false)}
              onMouseMove={scratch}
              onTouchStart={() => setIsScratching(true)}
              onTouchEnd={() => setIsScratching(false)}
              onTouchMove={scratch}
              className="absolute inset-0 w-full h-full cursor-crosshair z-20"
            />
          )}
        </div>

        {/* Reward Feedback */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-white/5 border border-white/10 rounded-[2px] flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono"
          >
            <div className="flex items-center gap-2 text-[#D9D0BE]">
              <CheckCircle2 className="w-4 h-4 text-[#FF1685]" />
              <span>CARD SCRATCHED · A PHYSICAL FOLDED LETTER UNEARTHED IN YOUR ARCHIVE</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
