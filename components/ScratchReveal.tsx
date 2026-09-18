"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScratchRevealProps {
  message: string;
  isVisible: boolean;
}

export default function ScratchReveal({ message, isVisible }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealPercent, setRevealPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with vintage charcoal scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1f1f24");
    gradient.addColorStop(0.5, "#151518");
    gradient.addColorStop(1, "#1c1c20");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scratch instruction in IBM Plex Mono / vintage print
    ctx.font = "12px 'IBM Plex Mono', monospace";
    ctx.fillStyle = "rgba(247,245,239,0.5)";
    ctx.textAlign = "center";
    ctx.fillText("[ SCRATCH TO DECODE SIGNAL ]", canvas.width / 2, canvas.height / 2 + 4);
  }, [isVisible]);

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
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Calculate reveal percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparent++;
    }
    const pct = Math.round((transparent / (canvas.width * canvas.height)) * 100);
    setRevealPercent(pct);

    if (pct > 55 && !isRevealed) {
      setIsRevealed(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if ("vibrate" in navigator) navigator.vibrate([15, 10, 15]);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto my-4"
    >
      <div
        className="relative bg-[var(--tv-surface)] border border-[rgba(247,245,239,0.2)] p-1 overflow-hidden"
        style={{ borderRadius: "3px" }}
      >
        {/* Hidden message layer */}
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-[var(--tv-charcoal)]">
          <p className="font-serif italic text-base sm:text-lg text-[var(--tv-white)] leading-relaxed text-center">
            &ldquo;{message}&rdquo;
          </p>
        </div>

        {/* Scratch canvas layer */}
        <canvas
          ref={canvasRef}
          className="relative w-full"
          style={{
            height: "96px",
            touchAction: "none",
            cursor: isRevealed ? "default" : "crosshair",
            borderRadius: "2px",
          }}
          onMouseDown={() => setIsScratching(true)}
          onMouseMove={scratch}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onTouchStart={() => setIsScratching(true)}
          onTouchMove={scratch}
          onTouchEnd={() => setIsScratching(false)}
        />

        {!isRevealed && revealPercent > 0 && (
          <div className="absolute bottom-2 right-3 text-[10px] font-mono uppercase tracking-wider text-[var(--station-primary,#FF1685)]">
            {revealPercent}% DECODED
          </div>
        )}
      </div>
    </motion.div>
  );
}
