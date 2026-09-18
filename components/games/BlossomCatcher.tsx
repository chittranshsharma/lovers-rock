"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BlossomCatcherProps {
  displayName?: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete?: (result: { score: number }) => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "petal" | "heart" | "star" | "bomb";
  rotation: number;
  rotationSpeed: number;
  size: number;
  emoji: string;
  points: number;
}

const ITEMS_CONFIG = [
  { type: "petal" as const, emoji: "🌸", points: 1,  weight: 45 },
  { type: "petal" as const, emoji: "🌺", points: 2,  weight: 20 },
  { type: "heart" as const, emoji: "💗", points: 3,  weight: 20 },
  { type: "star"  as const, emoji: "⭐", points: 5,  weight: 10 },
  { type: "bomb"  as const, emoji: "💔", points: -3, weight: 5  },
];

const GOAL = 50;
const GAME_DURATION = 30;

export default function BlossomCatcher({ displayName = "you", isAlreadyCompleted, onComplete }: BlossomCatcherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    running: false,
    score: 0,
    timeLeft: GAME_DURATION,
    basketX: 0,
    basketWidth: 90,
    items: [] as FallingItem[],
    nextId: 0,
    spawnTimer: 0,
    combo: 0,
    particles: [] as { x: number; y: number; text: string; vy: number; opacity: number; color: string }[],
  });
  const rafRef = useRef<number>(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "win" | "done">(isAlreadyCompleted ? "done" : "idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const lastTimestampRef = useRef(0);

  const spawnItem = useCallback(() => {
    const total = ITEMS_CONFIG.reduce((a, b) => a + b.weight, 0);
    let rand = Math.random() * total;
    let cfg = ITEMS_CONFIG[0];
    for (const c of ITEMS_CONFIG) {
      rand -= c.weight;
      if (rand <= 0) { cfg = c; break; }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const item: FallingItem = {
      id: gameRef.current.nextId++,
      x: Math.random() * (canvas.width - 40) + 20,
      y: -30,
      vx: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 2.5 + 1.5,
      type: cfg.type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      size: cfg.type === "star" ? 22 : 20,
      emoji: cfg.emoji,
      points: cfg.points,
    };
    gameRef.current.items.push(item);
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.running = true;
    g.score = 0;
    g.timeLeft = GAME_DURATION;
    g.items = [];
    g.combo = 0;
    g.particles = [];
    g.spawnTimer = 0;

    const canvas = canvasRef.current;
    if (canvas) g.basketX = canvas.width / 2;

    setPhase("playing");
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
  }, []);

  // Mouse & touch basket control
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      gameRef.current.basketX = e.clientX - rect.left;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      gameRef.current.basketX = e.touches[0].clientX - rect.left;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Keyboard basket control
  useEffect(() => {
    const keys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => keys.add(e.key);
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key);

    const keyLoop = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (keys.has("ArrowLeft") || keys.has("a")) {
        gameRef.current.basketX = Math.max(gameRef.current.basketWidth / 2, gameRef.current.basketX - 12);
      }
      if (keys.has("ArrowRight") || keys.has("d")) {
        gameRef.current.basketX = Math.min(canvas.width - gameRef.current.basketWidth / 2, gameRef.current.basketX + 12);
      }
    }, 16);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      clearInterval(keyLoop);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    lastTimestampRef.current = 0;

    const loop = (timestamp: number) => {
      if (!gameRef.current.running) return;

      const dt = lastTimestampRef.current ? Math.min((timestamp - lastTimestampRef.current) / 16, 3) : 1;
      lastTimestampRef.current = timestamp;

      const g = gameRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const bx = g.basketX;
      const bw = g.basketWidth;
      const bh = 28;
      const by = H - 50;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // Spawn
      g.spawnTimer -= dt;
      if (g.spawnTimer <= 0) {
        spawnItem();
        g.spawnTimer = Math.random() * 18 + 10;
      }

      // Draw items
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const caught: number[] = [];
      const missed: number[] = [];

      g.items.forEach((item) => {
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.rotation += item.rotationSpeed * dt;

        // Bounce off walls
        if (item.x < 15 || item.x > W - 15) item.vx *= -1;

        // Check catch
        if (
          item.y > by - item.size / 2 &&
          item.y < by + bh + item.size &&
          item.x > bx - bw / 2 &&
          item.x < bx + bw / 2
        ) {
          caught.push(item.id);
          g.score += item.points;
          if (item.type !== "bomb") g.combo++;
          else g.combo = 0;

          const color = item.type === "bomb" ? "#ef4444" : item.type === "star" ? "#fbbf24" : "#EC4899";
          const text = item.points > 0 ? `+${item.points}` : `${item.points}`;
          g.particles.push({ x: item.x, y: item.y, text: g.combo > 2 ? `${text} COMBO!` : text, vy: -2.5, opacity: 1, color });
        }

        // Off screen
        if (item.y > H + 30) {
          missed.push(item.id);
          if (item.type !== "bomb") g.combo = 0;
        }

        // Draw
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.font = `${item.size}px serif`;
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();
      });

      g.items = g.items.filter(i => !caught.includes(i.id) && !missed.includes(i.id));

      // Draw basket
      const grad = ctx.createLinearGradient(bx - bw / 2, by, bx + bw / 2, by + bh);
      grad.addColorStop(0, "rgba(236,72,153,0.9)");
      grad.addColorStop(1, "rgba(219,39,119,0.9)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(bx - bw / 2, by);
      ctx.lineTo(bx - bw / 2 + 8, by + bh);
      ctx.lineTo(bx + bw / 2 - 8, by + bh);
      ctx.lineTo(bx + bw / 2, by);
      ctx.closePath();
      ctx.fill();
      ctx.font = "14px serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText("🌸", bx, by + bh / 2 + 1);

      // Draw particles
      g.particles.forEach((p) => {
        p.y += p.vy * dt;
        p.opacity -= 0.025 * dt;
        ctx.font = "bold 13px sans-serif";
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.textAlign = "center";
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;
      });
      g.particles = g.particles.filter(p => p.opacity > 0);

      // Update React state periodically
      setScore(Math.max(0, g.score));
      setCombo(g.combo);

      // Time countdown
      g.timeLeft -= dt / 60;
      setTimeLeft(Math.ceil(Math.max(0, g.timeLeft)));

      if (g.timeLeft <= 0) {
        g.running = false;
        if (g.score >= GOAL) {
          setPhase("win");
        } else {
          setPhase("win"); // still show result even if not goal
        }
        return;
      }

      if (g.score >= GOAL) {
        g.running = false;
        setPhase("win");
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phase, spawnItem]);

  const handleDone = () => {
    setPhase("done");
    onComplete?.({ score: gameRef.current.score });
  };

  if (phase === "done") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-5xl">🌸</div>
        <p className="font-display font-black text-lg" style={{ color: "#4A0E2E" }}>already bloomed ✓</p>
        <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>you caught {GOAL}+ petals. the garden remembers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-display font-black text-xl uppercase" style={{ color: "#4A0E2E" }}>
          🌸 BLOSSOM CATCHER
        </h2>
        <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
          catch falling petals and hearts · avoid the 💔 broken hearts · reach {GOAL} points
        </p>
      </div>

      {/* Score bar */}
      {phase === "playing" && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl"
          style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(236,72,153,0.25)" }}>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[9px] font-mono uppercase" style={{ color: "#9D4A6E" }}>SCORE</div>
              <div className="font-display font-black text-xl" style={{ color: "#4A0E2E" }}>{Math.max(0, score)}</div>
            </div>
            {combo >= 3 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 rounded-full text-xs font-mono font-bold"
                style={{ background: "linear-gradient(135deg, #EC4899, #A855F7)", color: "white" }}>
                {combo}x COMBO!
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[9px] font-mono uppercase" style={{ color: "#9D4A6E" }}>GOAL</div>
              <div className="font-display font-bold text-sm" style={{ color: "#BE185D" }}>{GOAL}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono uppercase" style={{ color: "#9D4A6E" }}>TIME</div>
              <div className={`font-display font-black text-xl ${timeLeft <= 10 ? "text-red-500" : ""}`}
                style={timeLeft > 10 ? { color: "#4A0E2E" } : {}}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game canvas */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #FFF0F5, #FCE7F3)",
          border: "2px solid rgba(244,114,182,0.3)",
          height: "360px",
        }}>

        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
            <div className="text-6xl animate-bounce">🌸</div>
            <div className="text-center space-y-2 px-4">
              <p className="font-display font-black text-lg" style={{ color: "#4A0E2E" }}>catch {GOAL} petals to win</p>
              <p className="font-serif italic text-xs" style={{ color: "#9D4A6E" }}>
                move your mouse · use arrow keys · avoid 💔
              </p>
            </div>
            <button onClick={startGame}
              className="px-8 py-3 rounded-full font-display font-black text-sm text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", boxShadow: "0 6px 20px rgba(236,72,153,0.5)" }}>
              START CATCHING 🌸
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="w-full h-full"
          style={{ display: phase === "playing" ? "block" : "none" }} />

        <AnimatePresence>
          {phase === "win" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10"
              style={{ background: "rgba(255,240,245,0.95)", backdropFilter: "blur(8px)" }}>
              <div className="text-6xl">🌸</div>
              <div className="text-center space-y-1">
                <p className="font-display font-black text-2xl" style={{ color: "#4A0E2E" }}>
                  {Math.max(0, score) >= GOAL ? "BEAUTIFUL! ♡" : `YOU SCORED ${Math.max(0, score)}`}
                </p>
                <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
                  {Math.max(0, score) >= GOAL
                    ? `you caught ${Math.max(0, score)} petals, ${displayName}. the garden is yours.`
                    : `${GOAL - Math.max(0, score)} more petals needed — try again?`}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={startGame}
                  className="px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wide border transition-all hover:scale-105"
                  style={{ borderColor: "rgba(236,72,153,0.4)", color: "#BE185D", background: "rgba(244,114,182,0.1)" }}>
                  PLAY AGAIN
                </button>
                {Math.max(0, score) >= GOAL && (
                  <button onClick={handleDone}
                    className="px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wide text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #EC4899, #DB2777)", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}>
                    COMPLETE ✓
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls help */}
      <p className="text-center text-[10px] font-mono" style={{ color: "#9D4A6E" }}>
        🖱 MOUSE TO MOVE · ⬅➡ ARROW KEYS · 🌸 +1 · 💗 +3 · ⭐ +5 · 💔 -3
      </p>
    </div>
  );
}
