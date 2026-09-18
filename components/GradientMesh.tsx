"use client";

import React, { useEffect, useRef } from "react";

/**
 * TV Girl ambient color field.
 * Creates an analog, slow-moving wash of color (hot pink, electric blue, cream, deep shadow)
 * rather than a bright AI neon gradient blob.
 * Reads CSS variables --station-primary and --station-secondary when available.
 */
export default function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Parse hex to RGB helper
    const hexToRgb = (hex: string): [number, number, number] => {
      const clean = hex.replace("#", "");
      if (clean.length === 6) {
        return [
          parseInt(clean.substring(0, 2), 16),
          parseInt(clean.substring(2, 4), 16),
          parseInt(clean.substring(4, 6), 16),
        ];
      }
      return [255, 22, 133];
    };

    const animate = () => {
      tRef.current += 1;
      const t = tRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Read current station dynamic colors from CSS root, with TV Girl defaults
      const rootStyle = getComputedStyle(document.documentElement);
      const primaryHex = rootStyle.getPropertyValue("--station-primary").trim() || "#FF1685";
      const secondaryHex = rootStyle.getPropertyValue("--station-secondary").trim() || "#145BFF";

      const pRgb = hexToRgb(primaryHex);
      const sRgb = hexToRgb(secondaryHex);

      // 3 faint, localized atmospheric color pools (strictly primary/secondary, never white)
      const blobs = [
        { x: 0.2, y: 0.3, r: 0.55, rgb: pRgb, speed: { x: 0.00005, y: 0.00003 }, opacity: 0.02 },
        { x: 0.8, y: 0.65, r: 0.5, rgb: sRgb, speed: { x: -0.00004, y: 0.00005 }, opacity: 0.018 },
        { x: 0.5, y: 0.2, r: 0.45, rgb: pRgb, speed: { x: 0.00003, y: -0.00004 }, opacity: 0.015 },
      ];

      for (const blob of blobs) {
        const bx = (blob.x + Math.sin(t * blob.speed.x * 600) * 0.12) * canvas.width;
        const by = (blob.y + Math.cos(t * blob.speed.y * 600) * 0.1) * canvas.height;
        const br = blob.r * Math.max(canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        gradient.addColorStop(0, `rgba(${blob.rgb[0]}, ${blob.rgb[1]}, ${blob.rgb[2]}, ${blob.opacity})`);
        gradient.addColorStop(1, `rgba(${blob.rgb[0]}, ${blob.rgb[1]}, ${blob.rgb[2]}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
