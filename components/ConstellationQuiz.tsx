"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    id: "q1",
    prompt: "stars or sunsets?",
    a: { label: "STARS ✦", value: "stars", palette: { accent: "#145BFF", glow: "#20DDB6" } },
    b: { label: "SUNSETS 🌅", value: "sunsets", palette: { accent: "#FF1685", glow: "#FFD51F" } },
  },
  {
    id: "q2",
    prompt: "vinyl or cassette?",
    a: { label: "VINYL 🎵", value: "vinyl", palette: { accent: "#EA3D46", glow: "#FFD51F" } },
    b: { label: "CASSETTE 📼", value: "cassette", palette: { accent: "#A33CF2", glow: "#20DDB6" } },
  },
  {
    id: "q3",
    prompt: "rainy window or open field?",
    a: { label: "RAINY WINDOW 🌧", value: "rain", palette: { accent: "#145BFF", glow: "#20DDB6" } },
    b: { label: "OPEN FIELD 🌾", value: "field", palette: { accent: "#FFD51F", glow: "#F36B21" } },
  },
];

interface ConstellationQuizProps {
  onComplete: (answers: Record<string, string>) => void;
}

export default function ConstellationQuiz({ onComplete }: ConstellationQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, value: string, palette: { accent: string; glow: string }) => {
    document.documentElement.style.setProperty("--accent-pink", palette.accent);
    document.documentElement.style.setProperty("--accent-glow", palette.glow);

    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setTimeout(() => onComplete(newAnswers), 350);
    }
  };

  const currentQ = QUESTIONS[step];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto bg-[var(--tv-surface)] border border-[rgba(247,245,239,0.2)] p-6 text-center space-y-5 my-4 relative overflow-hidden"
      style={{ borderRadius: "3px" }}
    >
      <div className="tv-scanlines pointer-events-none" aria-hidden="true" style={{ opacity: 0.1 }} />

      <div className="flex items-center justify-center gap-2 mb-1">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 border transition-all duration-300"
            style={{
              borderRadius: "1px",
              borderColor: i <= step ? "var(--station-primary, #FF1685)" : "rgba(247,245,239,0.2)",
              backgroundColor: i === step ? "var(--station-primary, #FF1685)" : "transparent",
            }}
          />
        ))}
      </div>

      <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--tv-cream)]/50">
        FREQUENCY CALIBRATION // 0{step + 1} OF 03
      </p>

      <AnimatePresence mode="wait">
        <motion.h3
          key={currentQ.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="font-serif italic text-2xl text-[var(--tv-white)]"
        >
          {currentQ.prompt}
        </motion.h3>
      </AnimatePresence>

      <div className="flex gap-3 justify-center">
        {[currentQ.a, currentQ.b].map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(currentQ.id, opt.value, opt.palette)}
            className="flex-1 max-w-[190px] py-2.5 px-4 bg-[var(--tv-charcoal)] border border-[rgba(247,245,239,0.2)] hover:border-[var(--station-primary,#FF1685)] text-xs font-mono tracking-wider uppercase text-[var(--tv-cream)] hover:text-[var(--tv-white)] cursor-pointer transition-all duration-200 rounded-[2px]"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
