import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "unknown";
  const moodsParam = searchParams.get("moods") || "";
  const moods = moodsParam.split(",").filter(Boolean).slice(0, 4);

  const moodEmojis: Record<string, string> = {
    soft: "🌸", "golden hour": "🌅", chaotic: "⚡", nostalgic: "📼",
    bloom: "🌿", midnight: "🌙", velvet: "🥀", dreaming: "✨",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0c0910 0%, #1a0f1e 50%, #160d1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background soft glow circles */}
        <div style={{
          position: "absolute", width: "500px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(243,166,184,0.08) 0%, transparent 70%)",
          top: "-100px", left: "-100px",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,162,97,0.06) 0%, transparent 70%)",
          bottom: "-80px", right: "50px",
          display: "flex",
        }} />

        {/* Title */}
        <div style={{
          fontSize: "22px",
          letterSpacing: "0.3em",
          color: "rgba(243,166,184,0.6)",
          textTransform: "uppercase",
          marginBottom: "20px",
          fontFamily: "serif",
        }}>
          living constellation
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: "64px",
          color: "#fff8f0",
          fontStyle: "italic",
          fontWeight: "300",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "900px",
          marginBottom: "40px",
          textShadow: "0 0 40px rgba(243,166,184,0.3)",
        }}>
          My Sky in {moods.length} Moods
        </div>

        {/* Mood chips */}
        {moods.length > 0 && (
          <div style={{ display: "flex", gap: "16px", marginBottom: "48px", flexWrap: "wrap", justifyContent: "center" }}>
            {moods.map((mood) => (
              <div key={mood} style={{
                background: "rgba(243,166,184,0.12)",
                border: "1px solid rgba(243,166,184,0.3)",
                borderRadius: "999px",
                padding: "10px 24px",
                fontSize: "22px",
                color: "#f3a6b8",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <span>{moodEmojis[mood] || "✨"}</span>
                <span>{mood}</span>
              </div>
            ))}
          </div>
        )}

        {/* Slug */}
        <div style={{
          fontSize: "16px",
          color: "rgba(243,166,184,0.5)",
          letterSpacing: "0.2em",
          fontFamily: "monospace",
        }}>
          #{slug}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
