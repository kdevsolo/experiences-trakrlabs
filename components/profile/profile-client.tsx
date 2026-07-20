"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageTransition } from "@/components/shell/page-transition";
import { MobileShell } from "@/components/shell/mobile-shell";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ListGroup, ListRow } from "@/components/ui/list-row";
import { UserAvatar } from "@/components/ui/user-avatar";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function ProfileClient({
  email,
  name,
  userId,
  spotifyConnected,
  spotifyStatus,
  spotifyErrorReason,
}: {
  email?: string;
  name?: string;
  userId?: string;
  spotifyConnected: boolean;
  spotifyStatus?: string;
  spotifyErrorReason?: string;
}) {
  const [sharingOpen, setSharingOpen] = useState(false);

  const spotifyMessage = getSpotifyStatusMessage(spotifyStatus, spotifyErrorReason);

  return (
    <PageTransition>
      <MobileShell>
        <div className="flex flex-col items-center py-6">
          <UserAvatar name={name} email={email} seed={userId ?? email} size="lg" />
          <h1 className="mt-4 text-section">{name ?? "Creator"}</h1>
          {email && <p className="mt-1 text-caption">{email}</p>}
        </div>

        <div className="space-y-6">
          {spotifyMessage && (
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                spotifyMessage.type === "success" && "bg-emerald-50 text-emerald-800",
                spotifyMessage.type === "error" && "bg-red-50 text-red-800"
              )}
            >
              {spotifyMessage.text}
            </div>
          )}

          <ListGroup title="Account">
            <ListRow title="Google connected" trailing={<span className="text-emerald-600">✓</span>} />
            <form action={signOut} className="w-full">
              <button type="submit" className="w-full text-left">
                <ListRow title="Sign out" />
              </button>
            </form>
          </ListGroup>

          <ListGroup title="Integrations">
            <ListRow
              href="/api/spotify/connect?returnTo=/profile"
              title="Spotify"
              subtitle={spotifyConnected ? "Connected" : "Connect for cassette experiences"}
              trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
            />
          </ListGroup>

          <ListGroup title="About">
            <ListRow
              title="How sharing works"
              onClick={() => setSharingOpen(true)}
            />
          </ListGroup>
        </div>
      </MobileShell>

      <BottomSheet open={sharingOpen} onClose={() => setSharingOpen(false)} title="How sharing works">
        <div className="space-y-4 pb-6 text-[15px] leading-relaxed">
          <p>
            When you publish, your work stays private. Only you can preview it while signed in.
          </p>
          <p>
            Pay ₹10 once to unlock a public link. Until payment, even if someone gets the URL, it will not open for them.
          </p>
          <Link
            href="/library"
            className="block rounded-2xl bg-accent-soft px-4 py-3 text-center font-medium text-accent"
          >
            View my published work
          </Link>
        </div>
      </BottomSheet>
    </PageTransition>
  );
}

function getSpotifyStatusMessage(status?: string, reason?: string) {
  if (status === "connected") {
    return { type: "success" as const, text: "Spotify connected successfully." };
  }
  if (status === "denied") {
    return { type: "error" as const, text: "Spotify connection was cancelled." };
  }
  if (status === "missing_config") {
    return {
      type: "error" as const,
      text: "Spotify is not configured. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.",
    };
  }
  if (status === "error") {
    const messages: Record<string, string> = {
      redirect_mismatch:
        "Redirect URI mismatch. In Spotify Developer Dashboard, add https://experiences.trakrlabs.com/api/spotify/callback (or your NEXT_PUBLIC_APP_URL + /api/spotify/callback).",
      save_failed: "Spotify authorized but saving the connection failed. Check that music_connections exists in Supabase.",
      token_exchange: "Could not exchange Spotify authorization code. Try connecting again.",
      missing_code: "Spotify did not return an authorization code.",
    };
    return {
      type: "error" as const,
      text: messages[reason ?? ""] ?? "Spotify connection failed. Please try again.",
    };
  }
  return null;
}
