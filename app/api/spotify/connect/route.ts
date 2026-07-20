import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";

const profileUrl = (appUrl: string, params: Record<string, string>) => {
  const url = new URL("/profile", appUrl);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export async function GET(request: Request) {
  const appUrl = getAppUrl(request);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/?login=required&next=/profile`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(profileUrl(appUrl, { spotify: "missing_config" }));
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") ?? "/profile";
  const redirectUri = `${appUrl}/api/spotify/callback`;
  const scope = ["playlist-read-private", "playlist-read-collaborative"].join(" ");

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", returnTo);

  return NextResponse.redirect(authUrl.toString());
}
