import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify/token";
import { createClient } from "@/lib/supabase/server";

type SpotifyPlaylist = {
  id: string;
  name: string;
  imageUrl: string | null;
  trackCount: number;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ connected: false, playlists: [] }, { status: 401 });
  }

  const accessToken = await getSpotifyAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json({ connected: false, playlists: [] });
  }

  const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("[spotify/playlists] Spotify API error:", await response.text());
    return NextResponse.json({ connected: true, playlists: [] }, { status: 502 });
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      name: string;
      tracks?: { total?: number };
      images?: Array<{ url: string }>;
    }>;
  };

  const playlists: SpotifyPlaylist[] = (data.items ?? []).map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    imageUrl: playlist.images?.[0]?.url ?? null,
    trackCount: playlist.tracks?.total ?? 0,
  }));

  return NextResponse.json({ connected: true, playlists });
}
