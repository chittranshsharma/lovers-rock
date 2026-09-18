import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

// GAP 4 — Hardcoded fallback lines per mood
const FALLBACKS: Record<string, string> = {
  soft: "Dust and static softly dissolving into something warm.",
  "golden hour": "The afternoon dissolves gold into everything it touches.",
  chaotic: "Everything scattered, everything moving, everything alive.",
  nostalgic: "An old film frame you almost forgot, but never did.",
  bloom: "Something quiet is growing in the spaces between thoughts.",
  midnight: "The deep blue hour where nothing moves but the stars.",
  velvet: "Soft edges and the smell of something almost remembered.",
  dreaming: "Somewhere between asleep and aware, the best thoughts live.",
};

const PALETTE_FALLBACKS: Record<string, { bg: string; accent: string; glow: string; star: string }> = {
  soft:           { bg: "#16111e", accent: "#f3a6b8", glow: "#e29578", star: "#fff0f3" },
  "golden hour":  { bg: "#1c140d", accent: "#f4a261", glow: "#e76f51", star: "#ffe8d6" },
  chaotic:        { bg: "#140a18", accent: "#d8b4fe", glow: "#f43f5e", star: "#fae8ff" },
  nostalgic:      { bg: "#0d141e", accent: "#93c5fd", glow: "#f472b6", star: "#e0f2fe" },
  bloom:          { bg: "#0f1a14", accent: "#86efac", glow: "#facc15", star: "#f0fdf4" },
  midnight:       { bg: "#080a14", accent: "#a5b4fc", glow: "#818cf8", star: "#e0e7ff" },
  velvet:         { bg: "#1a0914", accent: "#fda4af", glow: "#c084fc", star: "#fff1f2" },
  dreaming:       { bg: "#13101c", accent: "#f0abfc", glow: "#38bdf8", star: "#fdf4ff" },
};

export async function POST(req: Request) {
  try {
    const { mood, slug } = await req.json();
    if (!mood || typeof mood !== "string") {
      return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
    }

    const cleanMood = mood.toLowerCase().trim();
    const rateLimitKey = `caption:${slug || "anon"}`;

    // GAP 5 — Rate limiting: 12 calls/min per slug
    if (isRateLimited(rateLimitKey, 12, 60_000)) {
      const fallbackLine = FALLBACKS[cleanMood] || FALLBACKS.soft;
      return NextResponse.json({
        line: fallbackLine,
        tone: cleanMood,
        paletteHint: PALETTE_FALLBACKS[cleanMood] || PALETTE_FALLBACKS.soft,
        fromFallback: true,
      });
    }

    const systemPrompt = `You are a TV Girl-inspired lo-fi aesthetic poetic caption generator for a Living Constellation web experience.
Given a mood, write ONE short, evocative, warm, lo-fi poetic line (strictly under 15 words). Never sappy or cliché, slightly bittersweet, film-grain dreamy.
Respond strictly in raw valid JSON format:
{
  "line": "your single poetic sentence here under 15 words",
  "tone": "the mood vibe",
  "paletteHint": {
    "bg": "#hex for dark background",
    "accent": "#hex for text/glow accent",
    "glow": "#hex for particle core color",
    "star": "#hex for vibrant star color"
  }
}`;

    // Use available model on user's Groq key (openai/gpt-oss-120b or llama-3.3-70b-versatile)
    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Mood choice: ${cleanMood}` },
        ],
        temperature: 0.85,
        max_tokens: 150,
        response_format: { type: "json_object" },
      });
    } catch {
      // Fallback model attempt if needed
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Mood choice: ${cleanMood}` },
        ],
        temperature: 0.85,
        max_tokens: 150,
        response_format: { type: "json_object" },
      });
    }

    const responseText = completion.choices[0]?.message?.content || "";
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      // GAP 4 — Groq returned unparseable content → use fallback
      data = {
        line: FALLBACKS[cleanMood] || FALLBACKS.soft,
        tone: cleanMood,
        paletteHint: PALETTE_FALLBACKS[cleanMood] || PALETTE_FALLBACKS.soft,
      };
    }

    if (!data.paletteHint?.bg) {
      data.paletteHint = PALETTE_FALLBACKS[cleanMood] || PALETTE_FALLBACKS.soft;
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Groq caption error:", error);
    // GAP 4 — Network/API error fallback
    const mood = "soft";
    return NextResponse.json({
      line: FALLBACKS[mood],
      tone: mood,
      paletteHint: PALETTE_FALLBACKS[mood],
      fromFallback: true,
    });
  }
}
