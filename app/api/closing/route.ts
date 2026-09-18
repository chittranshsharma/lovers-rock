import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { moods, lines } = await req.json();

    const moodList = Array.isArray(moods) ? moods.join(", ") : "soft dreams";
    const lineList = Array.isArray(lines) ? lines.join(" / ") : "";

    const systemPrompt = `You are a TV Girl aesthetic narrator completing a personal living constellation experience.
Given the mood picks and generated lines during this session, compose ONE breathtaking, warm, slightly nostalgic closing sentence (under 18 words).
It should weave their choices into a quiet climax.
Return JSON strictly:
{
  "closingLine": "your single beautiful closing sentence"
}`;

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Mood sequence: [${moodList}]\nLines generated: [${lineList}]`,
          },
        ],
        temperature: 0.85,
        max_tokens: 120,
        response_format: { type: "json_object" },
      });
    } catch {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Mood sequence: [${moodList}]\nLines generated: [${lineList}]`,
          },
        ],
        temperature: 0.85,
        max_tokens: 120,
        response_format: { type: "json_object" },
      });
    }

    const content = completion.choices[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { closingLine: `And just like that, all your ${moodList} moments turned into light.` };
    }

    return NextResponse.json({
      closingLine: parsed.closingLine || `Your constellation is complete, softly shining across time.`,
    });
  } catch (error) {
    console.error("Groq closing error:", error);
    return NextResponse.json({
      closingLine: "Underneath the warm cassette haze, every star you touched stays glowing.",
    });
  }
}
