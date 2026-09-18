"use client";

import React, { useEffect, useRef } from "react";

interface CuteParticlesProps {
  color?: string;
  count?: number;
}

// Sakura petal SVG path (simplified 5-petal cherry blossom shape)
const PETAL_PATHS = [
  "M8 0 C10 4 12 6 8 10 C4 6 6 4 8 0Z",
  "M0 8 C4 6 6 4 10 8 C6 10 4 10 0 8Z",
  "M8 0 Q12 3 10 8 Q5 10 4 6 Q2 2 8 0Z",
  "M8 2 Q14 5 10 10 Q5 12 3 8 Q2 3 8 2Z",
];

const HEART_PATH = "M8 14 C8 14 0 9 0 5 C0 2.5 2 0.5 4.5 0.5 C6 0.5 7.5 1.5 8 2.5 C8.5 1.5 10 0.5 11.5 0.5 C14 0.5 16 2.5 16 5 C16 9 8 14 8 14Z";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
  type: "petal" | "heart" | "dot";
  pathIdx: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmplitude: number;
}

const SAKURA_COLORS = [
  "#F9A8D4", // light pink
  "#F472B6", // medium pink
  "#EC4899", // hot pink
  "#FBCFE8", // pale blush
  "#FDF2F8", // near white
  "#E879F9", // light purple-pink
  "#C084FC", // lavender
  "#FDA4AF", // coral pink
];

export default function CuteParticles({ color, count = 28 }: CuteParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

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

    // Spawn particles
    particlesRef.current = Array.from({ length: count }, (_, i) => {
      const isHeart = i % 8 === 0;
      const isDot = i % 12 === 11;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.6 + 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        size: isHeart ? Math.random() * 7 + 5 : isDot ? Math.random() * 3 + 2 : Math.random() * 10 + 6,
        opacity: Math.random() * 0.45 + 0.25,
        color: color || SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
        type: isHeart ? "heart" : isDot ? "dot" : "petal",
        pathIdx: Math.floor(Math.random() * PETAL_PATHS.length),
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayAmplitude: Math.random() * 18 + 6,
      };
    });

    const draw = (timestamp: number) => {
      timeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Sway horizontally like a real petal
        p.x += p.vx + Math.sin(timestamp * p.swaySpeed + p.swayPhase) * 0.3;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Reset when off-screen
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === "heart") {
          const s = p.size / 16;
          ctx.scale(s, s);
          ctx.translate(-8, -7);
          const path = new Path2D(HEART_PATH);
          ctx.fillStyle = p.color;
          ctx.fill(path);
        } else {
          // Petal — draw as an ellipse with rotation
          const w = p.size;
          const h = p.size * 0.55;
          ctx.beginPath();
          ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
          // Soft gradient fill
          const grad = ctx.createRadialGradient(0, -h * 0.15, 0, 0, 0, w / 2);
          grad.addColorStop(0, p.color + "FF");
          grad.addColorStop(1, p.color + "44");
          ctx.fillStyle = grad;
          ctx.fill();

          // Subtle vein line
          ctx.beginPath();
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(0, h / 2);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{ opacity: 0.75 }}
    />
  );
}
