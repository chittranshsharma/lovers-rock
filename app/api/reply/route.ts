import { NextResponse } from "next/server";
import { recordReply } from "@/lib/db";
import { isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { slug, message } = await req.json();
    if (!slug || !message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // GAP 5 — Rate limit: max 3 replies per slug per minute
    if (isRateLimited(`reply:${slug}`, 3, 60_000)) {
      return NextResponse.json({ error: "Too many replies. Try again in a minute." }, { status: 429 });
    }

    // GAP 8 — Message guard in db.ts handles sanitization and length check
    const result = await recordReply(slug, message);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Could not save message" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply API error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
