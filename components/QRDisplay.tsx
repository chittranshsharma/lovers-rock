"use client";

import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface QRDisplayProps {
  url: string;
  slug: string;
}

export default function QRDisplay({ url, slug }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;

    QRCode.toCanvas(canvasRef.current, url, {
      width: 140,
      margin: 2,
      color: {
        dark: "#FF1685",
        light: "#09090B",
      },
    }).catch((err) => console.error("QR error:", err));
  }, [url]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `tvgirl-qr-${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-2.5 text-center"
    >
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--tv-cream)]/70">
        <span>ARCHIVE QR TRANSMISSION</span>
      </div>
      <div
        className="p-2.5 bg-[var(--tv-charcoal)] border border-[rgba(247,245,239,0.2)] cursor-pointer hover:border-[var(--tv-pink)] transition-all rounded-[2px]"
        onClick={handleDownload}
        title="Download QR code"
      >
        <canvas ref={canvasRef} className="rounded-[1px]" />
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--tv-cream)]/50 hover:text-[var(--tv-white)] transition-colors cursor-pointer"
      >
        <Download className="w-3 h-3" />
        <span>SAVE STAMP [PNG]</span>
      </button>
    </motion.div>
  );
}
