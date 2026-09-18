"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, Download, RotateCcw } from "lucide-react";

interface DreamDateReceiptProps {
  displayName?: string;
  color?: string;
  isAlreadyCompleted?: boolean;
  onComplete?: () => void;
}

interface Question {
  id: string;
  emoji: string;
  question: string;
  options: { label: string; receiptItem: string; price: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "setting",
    emoji: "🌃",
    question: "where does the date happen?",
    options: [
      { label: "late night diner", receiptItem: "Booth at the End of the World", price: "3:47 AM" },
      { label: "rooftop under stars", receiptItem: "Rooftop Cinema, Midnight Show", price: "starlit" },
      { label: "vinyl record shop", receiptItem: "Corner of Aisle B, French Exit LP", price: "timeless" },
      { label: "empty movie theater", receiptItem: "Back Row of the Last Showing", price: "quiet" },
    ],
  },
  {
    id: "drink",
    emoji: "🍵",
    question: "what do you order?",
    options: [
      { label: "matcha latte", receiptItem: "Matcha Latte (extra foam, extra care)", price: "$6.50" },
      { label: "cherry soda", receiptItem: "Cherry Soda Float w/ heart straw", price: "$4.25" },
      { label: "black coffee", receiptItem: "Black Coffee, no explanation needed", price: "$2.75" },
      { label: "strawberry milk", receiptItem: "Strawberry Milk (extra pink)", price: "$5.00" },
    ],
  },
  {
    id: "gift",
    emoji: "🎁",
    question: "what do they bring you?",
    options: [
      { label: "a vinyl record", receiptItem: "Vinyl: French Exit (slightly worn)", price: "priceless" },
      { label: "handwritten letter", receiptItem: "Letter: 2 pages, smudged ink", price: "irreplaceable" },
      { label: "wildflowers", receiptItem: "Wildflowers (picked, not bought)", price: "∞" },
      { label: "a polaroid", receiptItem: "Polaroid: The Two of You, Blurry", price: "forever" },
    ],
  },
  {
    id: "song",
    emoji: "🎵",
    question: "what song plays?",
    options: [
      { label: "Lovers Rock", receiptItem: "BGM: Lovers Rock (TV Girl)", price: "215 sec" },
      { label: "Birds Don't Sing", receiptItem: "BGM: Birds Don't Sing (TV Girl)", price: "193 sec" },
      { label: "Cigarettes out the Window", receiptItem: "BGM: Cigarettes (TV Girl)", price: "211 sec" },
      { label: "Heaven is a Bedroom", receiptItem: "BGM: Heaven is a Bedroom", price: "223 sec" },
    ],
  },
  {
    id: "moment",
    emoji: "✨",
    question: "the best moment is...",
    options: [
      { label: "when they laughed", receiptItem: "That Laugh × 1 (unrepeatable)", price: "∞" },
      { label: "the comfortable silence", receiptItem: "Comfortable Silence: 4 min 12 sec", price: "priceless" },
      { label: "hand accidentally touching", receiptItem: "Accidental Hand Touch (prolonged)", price: "everything" },
      { label: "\"i think about you a lot\"", receiptItem: "Confession: the soft kind", price: "your whole heart" },
    ],
  },
];

interface ReceiptLine {
  item: string;
  price: string;
}

export default function DreamDateReceipt({
  displayName = "you",
  isAlreadyCompleted,
  onComplete,
}: DreamDateReceiptProps) {
  const [step, setStep] = useState<"questions" | "receipt">(isAlreadyCompleted ? "receipt" : "questions");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<ReceiptLine[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(isAlreadyCompleted ?? false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const receiptDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const receiptTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleAnswer = (option: Question["options"][number]) => {
    setSelected(option.label);
    setTimeout(() => {
      const newAnswers = [...answers, { item: option.receiptItem, price: option.price }];
      setAnswers(newAnswers);
      setSelected(null);

      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setStep("receipt");
        if (!done) {
          setDone(true);
          onComplete?.();
        }
      }
    }, 400);
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setStep("questions");
  };

  if (step === "questions") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ) / QUESTIONS.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="font-display font-black text-xl uppercase" style={{ color: "#4A0E2E" }}>
            🧾 DREAM DATE RECEIPT
          </h2>
          <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
            design your perfect date · get a receipt of affection
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono" style={{ color: "#9D4A6E" }}>
            <span>QUESTION {currentQ + 1} / {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(244,114,182,0.2)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #EC4899, #A855F7)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="rounded-2xl p-6 space-y-5"
            style={{ background: "rgba(255,240,245,0.85)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(244,114,182,0.3)" }}
          >
            <div className="text-center space-y-2">
              <div className="text-4xl">{q.emoji}</div>
              <p className="font-serif italic text-lg" style={{ color: "#4A0E2E" }}>
                {q.question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {q.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => !selected && handleAnswer(opt)}
                  className="p-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: selected === opt.label
                      ? "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(192,132,252,0.15))"
                      : "rgba(255,240,245,0.7)",
                    border: selected === opt.label
                      ? "1.5px solid #EC4899"
                      : "1.5px solid rgba(244,114,182,0.25)",
                    transform: selected === opt.label ? "scale(0.97)" : "scale(1)",
                    opacity: selected && selected !== opt.label ? 0.5 : 1,
                  }}
                >
                  <span className="font-serif italic text-sm block" style={{ color: "#4A0E2E" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Receipt view
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="font-display font-black text-xl uppercase" style={{ color: "#4A0E2E" }}>
          🧾 YOUR RECEIPT
        </h2>
        <p className="font-serif italic text-sm" style={{ color: "#9D4A6E" }}>
          keep this forever, {displayName}.
        </p>
      </div>

      {/* The Receipt */}
      <motion.div
        ref={receiptRef}
        initial={{ opacity: 0, y: 20, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        className="mx-auto max-w-sm rounded-lg overflow-hidden shadow-2xl"
        style={{ background: "#FFFEF7", border: "1px solid rgba(0,0,0,0.08)", fontFamily: "Courier New, monospace" }}
      >
        {/* Receipt Header */}
        <div className="text-center py-5 px-4 border-b border-dashed border-gray-300">
          <div className="text-2xl mb-1">💌</div>
          <div className="font-bold text-lg text-gray-800">RECEIPT OF AFFECTION</div>
          <div className="text-xs text-gray-500 mt-0.5">TV GIRL UNIVERSE · LOVERS ROCK BRANCH</div>
          <div className="text-xs text-gray-400 mt-1">{receiptDate} · {receiptTime}</div>
          <div className="text-xs text-gray-500 mt-0.5">ORDER #: {Math.floor(Math.random() * 9000) + 1000}</div>
        </div>

        {/* Line items */}
        <div className="px-4 py-4 border-b border-dashed border-gray-300 space-y-3">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase mb-1">
            <span>ITEM</span>
            <span>QTY/PRICE</span>
          </div>
          {answers.map((line, i) => (
            <div key={i} className="flex justify-between gap-2">
              <span className="text-xs text-gray-700 flex-1" style={{ wordBreak: "break-word" }}>{line.item}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap shrink-0 ml-2">{line.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-4 py-4 border-b border-dashed border-gray-300 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>SUBTOTAL</span>
            <span>immeasurable</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>FEELING TAX (♡)</span>
            <span>included</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-gray-800 pt-1">
            <span>TOTAL</span>
            <span className="text-pink-600">PRICELESS ♡</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 px-4 text-[10px] text-gray-400 space-y-1">
          <div>PAYMENT METHOD: YOUR HEART</div>
          <div>THANK YOU, {displayName.toUpperCase()}</div>
          <div className="font-bold mt-2" style={{ letterSpacing: "3px" }}>
            ♡ · ♡ · ♡ · ♡ · ♡
          </div>
          <div className="mt-2 text-[9px]">*** KEEP THIS RECEIPT FOREVER ***</div>
          <div className="text-[8px] font-mono tracking-widest mt-1">|||| |||| ||| || |||| ||||| ||| |||</div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <button onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wide transition-all hover:scale-105"
          style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#BE185D" }}>
          <RotateCcw className="w-3 h-3" />
          <span>NEW DATE</span>
        </button>
      </div>
    </div>
  );
}
