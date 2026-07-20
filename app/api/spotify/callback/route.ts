import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const profileUrl = (appUrl: string, params: Record<string, string>) => {
  const url = new URL("/profile", appUrl);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export async function GET(request: Request) {
  const appUrl = getAppUrl(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const spotifyError = searchParams.get("error");

  if (spotifyError) {
    console.error("[spotify/callback] Spotify returned error:", spotifyError);
    return NextResponse.redirect(profileUrl(appUrl, { spotify: "denied" }));
  }

  if (!code) {
    return NextResponse.redirect(profileUrl(appUrl, { spotify: "error", reason: "missing_code" }));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(profileUrl(appUrl, { spotify: "missing_config" }));
  }

  const redirectUri = `${appUrl}/api/spotify/callback`;
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error("[spotify/callback] Token exchange failed:", tokenData);
    const reason =
      tokenData.error === "invalid_grant"
        ? "redirect_mismatch"
        : tokenData.error ?? "token_exchange";
    return NextResponse.redirect(profileUrl(appUrl, { spotify: "error", reason }));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/?login=required&next=/profile`);
  }

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null;

  const service = await createServiceClient();

  await service
    .from("music_connections")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", "spotify");

  const { error: insertError } = await service.from("music_connections").insert({
    user_id: user.id,
    provider: "spotify",
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token ?? null,
    expires_at: expiresAt,
  });

  if (insertError) {
    console.error("[spotify/callback] Failed to save connection:", insertError);
    return NextResponse.redirect(profileUrl(appUrl, { spotify: "error", reason: "save_failed" }));
  }

  const returnTo = state && state.startsWith("/") ? state : "/profile";
  const successUrl = new URL(returnTo, appUrl);
  successUrl.searchParams.set("spotify", "connected");
  return NextResponse.redirect(successUrl.toString());
}
