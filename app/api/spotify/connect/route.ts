import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const profileUrl = (params: Record<string, string>) => {
  const url = new URL("/profile", process.env.NEXT_PUBLIC_APP_URL!);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?login=required&next=/profile`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(profileUrl({ spotify: "missing_config" }));
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") ?? "/profile";
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`;
  const scope = ["playlist-read-private", "playlist-read-collaborative"].join(" ");

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", returnTo);

  return NextResponse.redirect(authUrl.toString());
}
