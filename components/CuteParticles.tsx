"use client";

import React, { useEffect, useRef } from "react";

interface CuteParticlesProps {
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  type: "heart" | "dust" | "fleck";
  rotation: number;
  rotSpeed: number;
}

export default function CuteParticles({ color = "#FF1685" }: CuteParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

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

    // Very sparse: exactly 24 particles across the whole screen
    const count = 24;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 3,
        speedY: -(Math.random() * 0.35 + 0.15), // slow upward drift
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.15,
        type: i % 4 === 0 ? "heart" : i % 3 === 0 ? "fleck" : "dust",
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    function drawHeart(c: CanvasRenderingContext2D, x: number, y: number, s: number, fill: string) {
      c.save();
      c.translate(x, y);
      c.beginPath();
      const topCurveHeight = s * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-s / 2, (s + topCurveHeight) / 2, 0, (s + topCurveHeight) / 1.2, 0, s);
      // bottom right curve
      c.bezierCurveTo(0, (s + topCurveHeight) / 1.2, s / 2, (s + topCurveHeight) / 2, s / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(s / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fillStyle = fill;
      c.fill();
      c.restore();
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size * 1.5, `${color}${Math.floor(p.opacity * 255).toString(16).padStart(2, "0")}`);
        } else if (p.type === "fleck") {
          // Paper / film fleck
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = `rgba(247, 245, 239, ${p.opacity * 0.35})`;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
          ctx.restore();
        } else {
          // Tiny silver film dust circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217, 208, 190, ${p.opacity * 0.4})`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
