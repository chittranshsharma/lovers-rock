"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Sunset, CloudRain, Disc, Radio, Home, Compass, Heart } from "lucide-react";
import { UserPreferences } from "@/lib/userState";
import { SemanticAccent } from "@/lib/themes/types";

interface PersonalityPicksProps {
  displayName: string;
  initialPreferences?: UserPreferences;
  initialAccent?: SemanticAccent;
  isAlreadyCompleted?: boolean;
  onComplete: (prefs: UserPreferences, accent: SemanticAccent, vibeSummary: string) => void;
}

interface PickOption<T> {
  label: string;
  value: T;
  icon: React.ReactNode;
  hint: string;
}

interface Question<T> {
  id: string;
  category: string;
  question: string;
  options: [PickOption<T>, PickOption<T>];
}

export default function PersonalityPicks({
  displayName,
  initialPreferences,
  initialAccent = "pink",
  isAlreadyCompleted = false,
  onComplete,
}: PersonalityPicksProps) {
  const [atmosphere, setAtmosphere] = useState<"sunset" | "rain">(initialPreferences?.atmosphere || "rain");
  const [music, setMusic] = useState<"vinyl" | "cassette">(initialPreferences?.music || "vinyl");
  const [social, setSocial] = useState<"stay-in" | "go-out">(initialPreferences?.social || "stay-in");
  const [accent, setAccent] = useState<SemanticAccent>(initialAccent);
  const [step, setStep] = useState(isAlreadyCompleted ? 4 : 0);
  const [isSaved, setIsSaved] = useState(isAlreadyCompleted);

  const QUESTIONS = [
    {
      title: "ATMOSPHERE",
      question: "which light do you prefer?",
      optionA: { label: "golden hour / sunset", value: "sunset" as const, desc: "warm analog glow" },
      optionB: { label: "late night / rain", value: "rain" as const, desc: "quiet pavement reflection" },
      selected: atmosphere,
      onSelect: (v: "sunset" | "rain") => setAtmosphere(v),
    },
    {
      title: "SOUND",
      question: "which format has more soul?",
      optionA: { label: "vinyl record", value: "vinyl" as const, desc: "warm groove crackle" },
      optionB: { label: "cassette tape", value: "cassette" as const, desc: "magnetic tape hiss" },
      selected: music,
      onSelect: (v: "vinyl" | "cassette") => setMusic(v),
    },
    {
      title: "EVENING",
      question: "a perfect saturday night is...",
      optionA: { label: "staying inside", value: "stay-in" as const, desc: "curtains closed, records spinning" },
      optionB: { label: "night drive somewhere", value: "go-out" as const, desc: "windows cracked, 2 am neon" },
      selected: social,
      onSelect: (v: "stay-in" | "go-out") => setSocial(v),
    },
    {
      title: "TONE",
      question: "pick an accent color for your world",
      optionA: { label: "hot pink", value: "pink" as const, desc: "#FF1685 · motel neon" },
      optionB: { label: "electric blue", value: "blue" as const, desc: "#145BFF · dusk hour" },
      selected: accent,
      onSelect: (v: SemanticAccent) => setAccent(v),
    },
  ];

  const currentQ = QUESTIONS[step];

  const handleChoice = (isA: boolean) => {
    if (step === 0) setAtmosphere(isA ? "sunset" : "rain");
    if (step === 1) setMusic(isA ? "vinyl" : "cassette");
    if (step === 2) setSocial(isA ? "stay-in" : "go-out");
    if (step === 3) {
      const chosenAccent: SemanticAccent = isA ? "pink" : "blue";
      setAccent(chosenAccent);

      // Finish picks
      const finalPrefs: UserPreferences = {
        atmosphere,
        music,
        social,
      };
      const vibeSummary = `${atmosphere === "rain" ? "rainy night" : "golden sunset"} · ${music} · ${social === "stay-in" ? "quiet evening" : "night drive"}`;
      setIsSaved(true);
      setStep(4);
      onComplete(finalPrefs, chosenAccent, vibeSummary);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const vibeSummary = `${atmosphere === "rain" ? "late night rain" : "golden sunset"} · ${music} · ${social === "stay-in" ? "stay in" : "night drive"}`;

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      <div className="relative bg-[#111114] border border-[rgba(247,245,239,0.18)] rounded-[3px] overflow-hidden p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#145BFF]" />
            <span>03 // PERSONALITY PICKS</span>
          </div>
          <div className="flex items-center gap-1">
            <span>STEP:</span>
            <span className="font-bold text-white px-1.5 py-0.5 bg-black/60 rounded-[2px] border border-white/10">
              {Math.min(step + 1, 4)} / 4
            </span>
          </div>
        </div>

        {/* Question View */}
        {!isSaved && currentQ ? (
          <div className="py-6 px-2 sm:px-4 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#AFA797] uppercase">
                [ QUESTION {step + 1} OF 4 · {currentQ.title} ]
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl text-[#F7F5EF]">
                {currentQ.question}
              </h3>
            </div>

            {/* 2 Big Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleChoice(true)}
                className="group p-4 bg-[#151518] hover:bg-[#1C1C22] border border-white/10 hover:border-pink-500/50 rounded-[2px] text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <div>
                  <span className="text-[9px] font-mono text-[#AFA797] uppercase tracking-wider block mb-1">
                    OPTION A
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-[#F7F5EF] group-hover:text-white block">
                    {currentQ.optionA.label}
                  </span>
                </div>
                <span className="text-[11px] font-serif italic text-[#AFA797] block pt-2">
                  {currentQ.optionA.desc}
                </span>
              </button>

              <button
                onClick={() => handleChoice(false)}
                className="group p-4 bg-[#151518] hover:bg-[#1C1C22] border border-white/10 hover:border-blue-500/50 rounded-[2px] text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px]"
              >
                <div>
                  <span className="text-[9px] font-mono text-[#AFA797] uppercase tracking-wider block mb-1">
                    OPTION B
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-[#F7F5EF] group-hover:text-white block">
                    {currentQ.optionB.label}
                  </span>
                </div>
                <span className="text-[11px] font-serif italic text-[#AFA797] block pt-2">
                  {currentQ.optionB.desc}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Completion State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 px-4 text-center space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-[2px] text-[10px] font-mono text-[#D9D0BE] uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#FF1685]" />
              <span>OKAY... WE&apos;VE GOT YOUR VIBE</span>
            </div>

            <h3 className="font-display font-black text-xl text-[#F7F5EF] uppercase">
              {vibeSummary}
            </h3>

            <p className="font-serif italic text-sm text-[#AFA797] max-w-sm mx-auto">
              the site&apos;s lighting, accent colors, and the mixtape cassette in your archive have adapted to this exact mood.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setStep(0);
                  setIsSaved(false);
                }}
                className="px-3 py-1 bg-[#1A1A1E] hover:bg-[#25252A] border border-white/15 text-[10px] font-mono uppercase tracking-widest text-[#D9D0BE] rounded-[2px] transition-colors cursor-pointer"
              >
                [ Change Answers ]
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
