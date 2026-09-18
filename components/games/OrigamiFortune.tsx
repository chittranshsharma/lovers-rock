"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OrigamiFortuneProps {
  displayName?: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete?: () => void;
}

const COLORS = [
  { id: "sakura",   label: "Sakura Pink",  hex: "#F9A8D4", text: "#831843" },
  { id: "sky",      label: "Sky Blue",     hex: "#BAE6FD", text: "#0C4A6E" },
  { id: "berry",    label: "Berry Purple", hex: "#E9D5FF", text: "#581C87" },
  { id: "sunlight", label: "Sunlight",     hex: "#FEF08A", text: "#713F12" },
];

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

const FORTUNES: Record<number, string> = {
  1: "someone is thinking about you right now, specifically.",
  2: "the song you keep replaying is a sign. listen to it one more time.",
  3: "you will have a conversation that changes everything. this week.",
  4: "the right timing is closer than you think. be patient, but not too patient.",
  5: "a handwritten note is worth more than a thousand texts. send one.",
  6: "you belong to a love that hasn't found you yet — but it's looking.",
  7: "the feeling you get at 2am that everything will be okay? that's prophecy.",
  8: "someone finds the way you laugh completely disarming.",
};

const STEPS = ["color" , "number1", "number2", "reveal"] as const;
type Step = typeof STEPS[number];

export default function OrigamiFortune({ displayName = "you", isAlreadyCompleted, onComplete }: OrigamiFortuneProps) {
  const [step, setStep] = useState<Step>("color");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [finalNumber, setFinalNumber] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [done, setDone] = useState(isAlreadyCompleted ?? false);
  const [animating, setAnimating] = useState(false);

  const fortune = finalNumber ? FORTUNES[finalNumber] : null;

  const handleColorSelect = (color: typeof COLORS[number]) => {
    setSelectedColor(color);
    // Animate: spell out the color name = n steps
    const steps = color.label.replace(/\s/g, "").length;
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setStep("number1");
    }, 300 * steps);
  };

  const handleNumberSelect = (num: number) => {
    if (step === "number1") {
      setFirstNumber(num);
      // Count to num
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setStep("number2");
      }, 250 * num);
    } else {
      setFinalNumber(num);
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setIsOpen(true);
        setStep("reveal");
        if (!done) {
          setDone(true);
          onComplete?.();
        }
      }, 250 * num);
    }
  };

  const handleReset = () => {
    setStep("color");
    setFirstNumber(null);
    setFinalNumber(null);
    setIsOpen(false);
    setAnimating(false);
  };

  // Fortune teller visual
  const FortuneTellerShape = () => (
    <div className="relative w-48 h-48 mx-auto select-none">
      <motion.div
        className="absolute inset-0 grid grid-cols-2 gap-0"
        animate={animating ? {
          scale: [1, 1.08, 0.95, 1.08, 1],
          rotate: [0, -5, 5, -3, 0],
        } : {}}
        transition={{ duration: 0.4, repeat: animating ? Infinity : 0 }}
      >
        {/* Top-left flap */}
        <div className="relative" style={{ background: selectedColor.hex, borderRadius: "40% 0 0 0", clipPath: "polygon(0 0, 100% 0, 0 100%)" }}>
          <span className="absolute top-3 left-3 font-mono text-[10px] font-bold" style={{ color: selectedColor.text }}>1</span>
        </div>
        {/* Top-right flap */}
        <div className="relative" style={{ background: selectedColor.hex, opacity: 0.85, borderRadius: "0 40% 0 0", clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}>
          <span className="absolute top-3 right-3 font-mono text-[10px] font-bold" style={{ color: selectedColor.text }}>2</span>
        </div>
        {/* Bottom-left flap */}
        <div className="relative" style={{ background: selectedColor.hex, opacity: 0.75, borderRadius: "0 0 0 40%", clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}>
          <span className="absolute bottom-3 left-3 font-mono text-[10px] font-bold" style={{ color: selectedColor.text }}>3</span>
        </div>
        {/* Bottom-right flap */}
        <div className="relative" style={{ background: selectedColor.hex, opacity: 0.9, borderRadius: "0 0 40% 0", clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] font-bold" style={{ color: selectedColor.text }}>4</span>
        </div>
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-md"
            style={{ background: "rgba(255,255,255,0.85)" }}>
            {isOpen ? "✨" : "🌸"}
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="font-display font-black text-xl uppercase" style={{ color: "#4A0E2E" }}>
          ✨ ORIGAMI FORTUNE
        </h2>
        <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
          let the paper fold reveal your fate, {displayName}
        </p>
      </div>

      <div className="rounded-2xl p-6 space-y-6"
        style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.3)" }}>

        <FortuneTellerShape />

        <AnimatePresence mode="wait">
          {/* Step 1: Color */}
          {step === "color" && (
            <motion.div
              key="color"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-center font-serif italic" style={{ color: "#9D4A6E" }}>choose a color</p>
              <div className="grid grid-cols-2 gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleColorSelect(c)}
                    disabled={animating}
                    className="py-3 px-4 rounded-xl flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: c.hex, border: `1.5px solid ${c.text}40` }}
                  >
                    <div className="w-5 h-5 rounded-full border-2" style={{ background: c.hex, borderColor: c.text, opacity: 0.7 }} />
                    <span className="font-display font-bold text-xs" style={{ color: c.text }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 & 3: Number */}
          {(step === "number1" || step === "number2") && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-center font-serif italic" style={{ color: "#9D4A6E" }}>
                {step === "number1" ? "pick a number" : "pick another number"}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {NUMBERS.map((n) => (
                  <button
                    key={n}
                    onClick={() => !animating && handleNumberSelect(n)}
                    disabled={animating}
                    className="aspect-square rounded-xl flex items-center justify-center font-display font-black text-xl transition-all hover:scale-110 active:scale-95"
                    style={{
                      background: animating ? "rgba(244,114,182,0.1)" : "rgba(244,114,182,0.15)",
                      border: "1.5px solid rgba(236,72,153,0.3)",
                      color: "#4A0E2E",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {animating && (
                <p className="text-center text-xs font-mono animate-pulse" style={{ color: "#EC4899" }}>
                  {step === "number1"
                    ? `opening ${selectedColor.label.replace(/\s/g, "").toUpperCase()}...`
                    : `counting to ${firstNumber}...`}
                </p>
              )}
            </motion.div>
          )}

          {/* Reveal */}
          {step === "reveal" && fortune && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4"
                  >
                    <div className="px-5 py-5 rounded-2xl"
                      style={{ background: "rgba(244,114,182,0.1)", border: "1.5px dashed rgba(236,72,153,0.35)" }}>
                      <div className="text-2xl mb-2">🔮</div>
                      <p className="font-serif italic text-base leading-relaxed" style={{ color: "#4A0E2E" }}>
                        &ldquo;{fortune}&rdquo;
                      </p>
                      <div className="mt-3 text-[10px] font-mono" style={{ color: "#9D4A6E" }}>
                        Fortune #{finalNumber} · {selectedColor.label} Edition
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wide transition-all hover:scale-105"
                  style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#BE185D" }}
                >
                  FOLD AGAIN ✨
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
