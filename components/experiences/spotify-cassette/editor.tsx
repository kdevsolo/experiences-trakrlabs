"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { EditorProps, SpotifyCassetteConfig } from "@/types/experience";

type SpotifyPlaylist = {
  id: string;
  name: string;
  imageUrl: string | null;
  trackCount: number;
};

export function SpotifyCassetteEditor({
  config,
  onChange,
  isAuthenticated,
  returnPath = "/profile",
}: EditorProps<SpotifyCassetteConfig>) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setConnected(false);
      setPlaylists([]);
      return;
    }

    let cancelled = false;

    const loadPlaylists = () => {
      setLoading(true);
      fetch("/api/spotify/playlists")
        .then(async (response) => {
          if (response.status === 401) {
            return { connected: false, playlists: [] as SpotifyPlaylist[] };
          }
          return response.json() as Promise<{ connected: boolean; playlists: SpotifyPlaylist[] }>;
        })
        .then((data) => {
          if (cancelled) return;
          setConnected(data.connected);
          setPlaylists(data.playlists ?? []);
        })
        .catch(() => {
          if (cancelled) return;
          setConnected(false);
          setPlaylists([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    loadPlaylists();
    window.addEventListener("focus", loadPlaylists);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", loadPlaylists);
    };
  }, [isAuthenticated]);

  const connectHref = `/api/spotify/connect?returnTo=${encodeURIComponent(returnPath)}`;
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectPlaylist = (playlist: SpotifyPlaylist) => {
    onChange({
      ...config,
      playlistId: playlist.id,
      playlistName: playlist.name,
      playlistImageUrl: playlist.imageUrl ?? undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Cassette label title</Label>
        <Input
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="For You"
        />
      </div>
      <div className="space-y-2">
        <Label>Cassette label subtitle</Label>
        <Input
          value={config.subtitle}
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          placeholder="Summer road trip mix"
        />
      </div>

      <div className="space-y-3">
        <Label>Spotify playlist</Label>

        {!isAuthenticated && (
          <div className="rounded-2xl bg-muted px-4 py-4">
            <p className="text-sm text-muted-foreground">
              Sign in to connect Spotify and pick a playlist for this cassette.
            </p>
          </div>
        )}

        {isAuthenticated && loading && (
          <div className="rounded-2xl bg-muted px-4 py-6 text-sm text-muted-foreground">
            Loading your Spotify playlists…
          </div>
        )}

        {isAuthenticated && !loading && !connected && (
          <div className="rounded-2xl border border-[#1db95433] bg-[#1db95412] px-4 py-4">
            <p className="text-sm font-medium">Connect Spotify to choose a playlist</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Link your account to browse your playlists and attach one to this mixtape.
            </p>
            <Link
              href={connectHref}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#1db954] text-sm font-medium text-white hover:bg-[#1ed760]"
            >
              Connect Spotify
            </Link>
          </div>
        )}

        {isAuthenticated && !loading && connected && (
          <>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search playlists"
            />
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-2xl bg-muted p-2">
              {filteredPlaylists.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted-foreground">No playlists found.</p>
              ) : (
                filteredPlaylists.map((playlist) => {
                  const selected = config.playlistId === playlist.id;
                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      onClick={() => selectPlaylist(playlist)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        selected ? "bg-accent-soft ring-2 ring-accent" : "hover:bg-background/70"
                      )}
                    >
                      {playlist.imageUrl ? (
                        <img
                          src={playlist.imageUrl}
                          alt=""
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-background text-lg">
                          ♫
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{playlist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {playlist.trackCount} track{playlist.trackCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      {selected && <span className="text-xs font-semibold text-accent">Selected</span>}
                    </button>
                  );
                })
              )}
            </div>
            <Link href={connectHref} className="inline-block text-sm text-accent">
              Reconnect Spotify
            </Link>
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label>Shell color</Label>
        <Input
          type="color"
          value={config.coverColor}
          onChange={(e) => onChange({ ...config, coverColor: e.target.value })}
          className="h-12 cursor-pointer p-1"
        />
      </div>
    </div>
  );
}
