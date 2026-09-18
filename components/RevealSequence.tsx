"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";
import SnapshotButton from "./SnapshotButton";
import { Send } from "lucide-react";

interface RevealSequenceProps {
  slug: string;
  moodHistory: string[];
  generatedLines: string[];
  canvasElement: HTMLCanvasElement | null;
  onReset?: () => void;
  stationFreq?: string;
  stationPrimary?: string;
}

export default function RevealSequence({
  slug,
  moodHistory,
  generatedLines,
  canvasElement,
  onReset,
  stationFreq = "103.7",
  stationPrimary = "#FF1685",
}: RevealSequenceProps) {
  const [closingLine, setClosingLine] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyText, setReplyText] = useState<string>("");
  const [replySent, setReplySent] = useState<boolean>(false);
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);

  useEffect(() => {
    // TV Girl confetti: paper fragments, film strips — monochrome + accent only
    const colors = ["#F7F5EF", "#EEE8DA", "#D9D0BE", stationPrimary, "#AFA797"];

    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.55 },
        colors,
        scalar: 0.9,
        shapes: ["square"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 70,
          spread: 50,
          origin: { x: 0.1, y: 0.6 },
          colors,
          scalar: 0.7,
          shapes: ["square"],
        });
        confetti({
          particleCount: 30,
          angle: 110,
          spread: 50,
          origin: { x: 0.9, y: 0.6 },
          colors,
          scalar: 0.7,
          shapes: ["square"],
        });
      }, 350);
    } catch (err) {
      console.warn("Confetti error:", err);
    }

    // Fetch closing line from Groq (existing API route)
    async function fetchClosing() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/closing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moods: moodHistory, lines: generatedLines }),
        });
        const data = await res.json();
        setClosingLine(
          data.closingLine || "the sky you built tonight stays lit."
        );
      } catch {
        setClosingLine("the stars stay wherever you leave them.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchClosing();
  }, [moodHistory, generatedLines, stationPrimary]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;

    try {
      setIsSendingReply(true);
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message: replyText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setReplySent(true);
        setReplyText("");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto my-8 relative z-20"
    >
      {/* Header label */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-px flex-1"
          style={{ background: "var(--border-light)" }}
        />
        <p
          className="tv-mono"
          style={{ fontSize: "0.6rem", color: "var(--tv-muted)" }}
        >
          CONSTELLATION COMPLETE
        </p>
        <div
          className="h-px flex-1"
          style={{ background: "var(--border-light)" }}
        />
      </div>

      {/* Closing line card — paper feel */}
      <div
        className="tv-card p-6 sm:p-8 mb-6"
        style={{ borderColor: `${stationPrimary}33` }}
      >
        {isLoading ? (
          <div className="animate-soft-pulse">
            <p
              className="tv-body-serif"
              style={{ color: "var(--tv-muted)", fontSize: "1.15rem" }}
            >
              transmitting your sky...
            </p>
          </div>
        ) : (
          <Typewriter
            text={closingLine}
            speed={38}
            stationFreq={stationFreq}
            showAttribution
            className="text-xl sm:text-2xl"
            style={{ color: "var(--tv-white)" } as React.CSSProperties}
          />
        )}

        {/* Mood history tags */}
        {moodHistory.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Moods selected">
            {moodHistory.map((m, i) => (
              <span
                key={i}
                className="tv-mono"
                style={{
                  fontSize: "0.55rem",
                  color: stationPrimary,
                  border: `1px solid ${stationPrimary}44`,
                  borderRadius: "2px",
                  padding: "0.25em 0.7em",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <SnapshotButton canvasElement={canvasElement} slug={slug} />

        {onReset && (
          <button
            onClick={onReset}
            className="tv-btn-secondary"
            aria-label="Add more stars"
          >
            ADD MORE STARS
          </button>
        )}
      </div>

      {/* "LEAVE SOMETHING ON THE SIGNAL" — paper note UI */}
      <div
        className="tv-card p-6"
        style={{ transform: "rotate(-0.4deg)" }}
      >
        <p
          className="tv-mono mb-4"
          style={{ fontSize: "0.58rem", color: "var(--tv-muted)" }}
        >
          LEAVE SOMETHING ON THE SIGNAL
        </p>

        {replySent ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="tv-body-serif"
            style={{ color: "var(--tv-muted)", fontSize: "0.95rem" }}
          >
            transmitted. it stays in the signal.
          </motion.p>
        ) : (
          <form onSubmit={handleSendReply}>
            <div
              className="flex gap-3 items-start"
              style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="type here..."
                maxLength={200}
                rows={2}
                className="flex-1 bg-transparent resize-none text-sm outline-none placeholder-opacity-40"
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  color: "var(--tv-white)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  borderBottom: "1px solid var(--border-light)",
                  paddingBottom: "0.5rem",
                }}
              />
              <button
                type="submit"
                disabled={isSendingReply || !replyText.trim()}
                className="tv-btn-primary mt-1 flex-shrink-0"
                style={{
                  background: isSendingReply || !replyText.trim()
                    ? "var(--tv-surface)"
                    : stationPrimary,
                  opacity: isSendingReply || !replyText.trim() ? 0.4 : 1,
                }}
                aria-label="Send message"
              >
                <Send className="w-3 h-3" />
                SEND IT BACK
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
