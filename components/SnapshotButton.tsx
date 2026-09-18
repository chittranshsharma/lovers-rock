"use client";

import React, { useState } from "react";
import { Download, Check } from "lucide-react";

interface SnapshotButtonProps {
  canvasElement?: HTMLCanvasElement | null;
  slug: string;
  stationFreq?: string;
  targetId?: string;
}

export default function SnapshotButton({
  canvasElement,
  slug,
  stationFreq = "89.4",
  targetId,
}: SnapshotButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!canvasElement) {
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        alert("Visual canvas context calibrating. Please try again in a moment.");
        return;
      }
      exportCanvas(canvas);
      return;
    }
    exportCanvas(canvasElement);
  };

  const exportCanvas = (canvas: HTMLCanvasElement) => {
    try {
      // Create offscreen canvas for physical print watermark
      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const ctx = offscreen.getContext("2d");

      if (ctx) {
        // Draw 3D scene
        ctx.drawImage(canvas, 0, 0);

        // TV Girl analog film watermark banner at bottom
        const fontSize = Math.max(14, Math.floor(offscreen.height * 0.022));
        ctx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = "rgba(247, 245, 239, 0.75)";
        ctx.textAlign = "center";
        ctx.fillText(
          `TV GIRL ARCHIVE · FM ${stationFreq} · #${slug.toUpperCase()} · MEMORY CAPTURE`,
          offscreen.width / 2,
          offscreen.height - fontSize * 1.6
        );

        const dataUrl = offscreen.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `tvgirl-sky-${slug}.png`;
        link.href = dataUrl;
        link.click();

        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
      }
    } catch (err) {
      console.error("Failed to export canvas snapshot:", err);
      // Direct download fallback
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `tvgirl-sky-${slug}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 border ${
        downloaded
          ? "bg-[var(--tv-surface)] text-[var(--tv-cyan)] border-[var(--tv-cyan)] shadow-[0_0_15px_rgba(32,221,182,0.3)]"
          : "bg-[var(--tv-surface)] text-[var(--tv-cream)] hover:text-[var(--tv-white)] border-[rgba(247,245,239,0.25)] hover:border-[var(--station-primary,#FF1685)] hover:shadow-[0_0_15px_rgba(255,22,133,0.25)]"
      }`}
      style={{ borderRadius: "2px" }}
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 text-[var(--tv-cyan)]" />
          <span>PRINT SAVED [PNG]</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-[var(--station-primary,#FF1685)]" />
          <span>CAPTURE SKY [PNG]</span>
        </>
      )}
    </button>
  );
}
