import { NextResponse } from "next/server";
import { logVisit } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    // GAP 6 — Uses correct UPSERT SQL via updated db.ts
    const result = await logVisit(slug);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Visit API error:", error);
    return NextResponse.json({ visit_count: 1, is_return: false, stars_built: 0 });
  }
}
