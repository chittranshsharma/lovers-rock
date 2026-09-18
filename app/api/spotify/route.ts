import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Token cache — reuse until expired
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    // Expire 60s early to avoid edge cases
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 1) {
      return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
    }

    const token = await getSpotifyToken();

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query.trim())}&type=track&limit=6`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!searchRes.ok) {
      throw new Error(`Spotify search failed: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();

    // Map to clean shape, never expose raw Spotify tokens to client
    const tracks = searchData.tracks?.items?.map((item: {
      id: string;
      name: string;
      preview_url: string | null;
      artists: Array<{ name: string }>;
      album: { name: string; images: Array<{ url: string }> };
      duration_ms: number;
    }) => ({
      id: item.id,
      name: item.name,
      artist: item.artists?.[0]?.name || "Unknown",
      album: item.album?.name || "",
      albumArt: item.album?.images?.[1]?.url || item.album?.images?.[0]?.url || null,
      previewUrl: item.preview_url,
      durationMs: item.duration_ms,
    })) || [];

    return NextResponse.json({ tracks });
  } catch (error: unknown) {
    const isConfigError = error instanceof Error && error.message.includes("credentials not configured");
    console.error("Spotify search error:", error);
    return NextResponse.json(
      {
        error: isConfigError
          ? "Spotify is not configured yet. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local"
          : "Spotify search unavailable",
        tracks: [],
      },
      { status: isConfigError ? 503 : 500 }
    );
  }
}
