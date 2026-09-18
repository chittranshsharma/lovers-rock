"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { TVGirlRelease, TV_GIRL_RELEASES } from "@/lib/releases";

interface TVVinylProps {
  isPlaying: boolean;
  onToggle: () => void;
  primaryColor?: string;
  audioAmplitude?: number; // 0–1 from audio analyser
  release?: TVGirlRelease;
  releaseTitle?: string;
  recipientName?: string;
}

/**
 * Original fictional vinyl record visual.
 * Rotates while playing, stops on pause.
 * Needle raises/lowers.
 * Subtle scale pulse from audio amplitude.
 * Does NOT reproduce any real TV Girl artwork.
 */
export default function TVVinyl({
  isPlaying,
  onToggle,
  primaryColor = "#FF1685",
  audioAmplitude = 0,
  release,
  releaseTitle,
  recipientName,
}: TVVinylProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const frameRef = useRef<number>(0);
  const [needleAngle, setNeedleAngle] = useState(isPlaying ? 28 : 18); // degrees

  // Animate needle angle
  useEffect(() => {
    setNeedleAngle(isPlaying ? 28 : 18);
  }, [isPlaying]);

  // Derived label title from official release
  const activeRelease = release || TV_GIRL_RELEASES[8]; // Default to French Exit
  const labelTitle = releaseTitle || activeRelease.title;
  const labelArtist = recipientName ? `FOR ${recipientName.toUpperCase()}` : activeRelease.artist;

  // Draw vinyl on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 200;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = SIZE / 2 - 4;

    const draw = () => {
      if (isPlaying) {
        angleRef.current += 0.008 + audioAmplitude * 0.004;
      }

      const angle = angleRef.current;
      ctx.clearRect(0, 0, SIZE, SIZE);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Vinyl disc
      const vinylGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, R);
      vinylGrad.addColorStop(0, "#1a1a1e");
      vinylGrad.addColorStop(0.3, "#111113");
      vinylGrad.addColorStop(0.7, "#0d0d0f");
      vinylGrad.addColorStop(1, "#09090B");
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fillStyle = vinylGrad;
      ctx.fill();

      // Grooves — concentric rings, slight color variation
      for (let r = R - 6; r > 28; r -= 5.5) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247,245,239,${0.025 + Math.sin(r * 0.3) * 0.012})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Label area — original physical label
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();

      // Label text (Official TV Girl release metadata)
      ctx.fillStyle = "#09090B";
      ctx.font = "900 4px 'Montserrat', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelArtist.slice(0, 22), 0, -8);
      ctx.font = "bold 3.2px 'Montserrat', sans-serif";
      ctx.fillText(labelTitle.slice(0, 22), 0, -2);
      ctx.font = "3px monospace";
      ctx.fillText("33⅓ RPM · STEREO", 0, 4);
      ctx.fillText("● ● ●", 0, 10);

      // Center hole
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#09090B";
      ctx.fill();

      // Reflection sheen
      const sheenGrad = ctx.createLinearGradient(-R * 0.3, -R * 0.6, R * 0.3, R * 0.1);
      sheenGrad.addColorStop(0, "rgba(247,245,239,0.03)");
      sheenGrad.addColorStop(0.5, "rgba(247,245,239,0.0)");
      sheenGrad.addColorStop(1, "rgba(247,245,239,0.01)");
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fillStyle = sheenGrad;
      ctx.fill();

      ctx.restore();

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, primaryColor, audioAmplitude]);

  const scale = 1 + audioAmplitude * 0.03;

  return (
    <div className="relative flex flex-col items-center">
      {/* Vinyl */}
      <motion.button
        onClick={onToggle}
        className="relative rounded-full overflow-hidden"
        style={{
          width: 200,
          height: 200,
          filter: `drop-shadow(0 0 ${8 + audioAmplitude * 14}px ${primaryColor}44)`,
          scale,
        }}
        whileHover={{ scale: scale * 1.03 }}
        whileTap={{ scale: scale * 0.97 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        aria-label={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
        title={isPlaying ? "Pause" : "Place needle to play"}
      >
        <canvas ref={canvasRef} style={{ display: "block", width: 200, height: 200 }} />
      </motion.button>

      {/* Needle arm */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          transformOrigin: "calc(100% - 8px) 8px",
          transform: `rotate(${needleAngle}deg)`,
          transition: "transform 0.6s cubic-bezier(.22,.61,.36,1)",
          width: 72,
          height: 96,
          zIndex: 10,
        }}
        aria-hidden="true"
      >
        {/* Needle body */}
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 3,
            height: 72,
            background: `linear-gradient(to bottom, var(--tv-cream), ${primaryColor})`,
            borderRadius: "2px 2px 1px 1px",
            transformOrigin: "top center",
            transform: "rotate(-8deg)",
          }}
        />
        {/* Needle tip */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 7,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: primaryColor,
            boxShadow: `0 0 6px ${primaryColor}`,
          }}
        />
      </div>

      {/* Play/Pause label */}
      <div
        className="mt-3 tv-mono text-center"
        style={{ fontSize: "0.6rem", color: "var(--tv-muted)", letterSpacing: "0.22em" }}
      >
        {isPlaying ? `PLAYING ● ${Math.round(audioAmplitude * 100)}%` : "PLACE NEEDLE"}
      </div>
    </div>
  );
}
