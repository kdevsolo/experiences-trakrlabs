import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify/token";
import { createClient } from "@/lib/supabase/server";

export type SpotifyTrackResult = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ connected: false, tracks: [] });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ connected: false, tracks: [] }, { status: 401 });
  }

  const accessToken = await getSpotifyAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json({ connected: false, tracks: [] });
  }

  const spotifyUrl = new URL("https://api.spotify.com/v1/search");
  spotifyUrl.searchParams.set("q", query);
  spotifyUrl.searchParams.set("type", "track");
  spotifyUrl.searchParams.set("limit", "20");

  const response = await fetch(spotifyUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("[spotify/search] Spotify API error:", await response.text());
    return NextResponse.json({ connected: true, tracks: [] }, { status: 502 });
  }

  const data = (await response.json()) as {
    tracks?: {
      items?: Array<{
        id: string;
        name: string;
        artists?: Array<{ name: string }>;
        album?: { images?: Array<{ url: string }> };
      }>;
    };
  };

  const tracks: SpotifyTrackResult[] = (data.tracks?.items ?? []).map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists?.map((a) => a.name).join(", ") ?? "Unknown artist",
    imageUrl: track.album?.images?.[0]?.url ?? null,
  }));

  return NextResponse.json({ connected: true, tracks });
}
