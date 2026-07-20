import { createServiceClient } from "@/lib/supabase/server";

type SpotifyTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
};

async function refreshSpotifyAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { error: "missing_config" };
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return response.json() as Promise<SpotifyTokenResponse>;
}

export async function getSpotifyAccessToken(userId: string): Promise<string | null> {
  const service = await createServiceClient();
  const { data: connection } = await service
    .from("music_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "spotify")
    .maybeSingle();

  if (!connection?.access_token) return null;

  const expiresAt = connection.expires_at ? new Date(connection.expires_at).getTime() : null;
  const isExpired = expiresAt ? expiresAt <= Date.now() + 60_000 : false;

  if (!isExpired) return connection.access_token;
  if (!connection.refresh_token) return null;

  const refreshed = await refreshSpotifyAccessToken(connection.refresh_token);
  if (!refreshed.access_token) return null;

  const nextExpiresAt = refreshed.expires_in
    ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
    : null;

  await service
    .from("music_connections")
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token ?? connection.refresh_token,
      expires_at: nextExpiresAt,
    })
    .eq("id", connection.id);

  return refreshed.access_token;
}
