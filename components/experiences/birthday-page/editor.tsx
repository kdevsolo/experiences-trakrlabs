"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperienceImageUploadButton, ImageUrlField } from "@/components/ui/image-url-field";
import { Input, Label, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BirthdayPageConfig, BirthdaySlide, EditorProps } from "@/types/experience";

type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | null;
};

export function BirthdayPageEditor({
  config,
  onChange,
  isAuthenticated,
  returnPath = "/profile",
}: EditorProps<BirthdayPageConfig>) {
  const slides = config.slides ?? [];

  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackResults, setTrackResults] = useState<SpotifyTrack[]>([]);
  const [searching, setSearching] = useState(false);

  const connectHref = `/api/spotify/connect?returnTo=${encodeURIComponent(returnPath)}`;

  useEffect(() => {
    if (!isAuthenticated) {
      setSpotifyLoading(false);
      setSpotifyConnected(false);
      return;
    }

    let cancelled = false;
    fetch("/api/spotify/playlists")
      .then((res) => (res.ok ? res.json() : { connected: false }))
      .then((data: { connected?: boolean }) => {
        if (!cancelled) setSpotifyConnected(Boolean(data.connected));
      })
      .catch(() => {
        if (!cancelled) setSpotifyConnected(false);
      })
      .finally(() => {
        if (!cancelled) setSpotifyLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !spotifyConnected || trackQuery.trim().length < 2) {
      setTrackResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true);
      fetch(`/api/spotify/search?q=${encodeURIComponent(trackQuery.trim())}`)
        .then(async (res) => {
          if (!res.ok) return { tracks: [] as SpotifyTrack[] };
          return res.json() as Promise<{ tracks: SpotifyTrack[] }>;
        })
        .then((data) => {
          if (!cancelled) setTrackResults(data.tracks ?? []);
        })
        .catch(() => {
          if (!cancelled) setTrackResults([]);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trackQuery, isAuthenticated, spotifyConnected]);

  const setSlides = (next: BirthdaySlide[]) => onChange({ ...config, slides: next });

  const updateSlide = (index: number, patch: Partial<BirthdaySlide>) => {
    const next = [...slides];
    next[index] = { ...next[index], ...patch } as BirthdaySlide;
    setSlides(next);
  };

  const removeSlide = (index: number) => setSlides(slides.filter((_, i) => i !== index));

  const moveSlide = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
  };

  const addImageSlide = () => setSlides([...slides, { type: "image", imageUrl: "", caption: "" }]);
  const addTextSlide = () => setSlides([...slides, { type: "text", heading: "", body: "" }]);

  const selectTrack = (track: SpotifyTrack) => {
    onChange({
      ...config,
      spotifyTrackId: track.id,
      spotifyTrackName: track.name,
      spotifyTrackArtist: track.artist,
      spotifyTrackImageUrl: track.imageUrl ?? undefined,
    });
  };

  const clearTrack = () => {
    onChange({
      ...config,
      spotifyTrackId: undefined,
      spotifyTrackName: undefined,
      spotifyTrackArtist: undefined,
      spotifyTrackImageUrl: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="Sam" value={config.name} onChange={(e) => onChange({ ...config, name: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Age</Label>
        <Input
          type="number"
          min={0}
          placeholder="25"
          value={config.age || ""}
          onChange={(e) => onChange({ ...config, age: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="space-y-2">
        <Label>Birthday message</Label>
        <Textarea
          placeholder="Wishing you the happiest day…"
          value={config.message}
          onChange={(e) => onChange({ ...config, message: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Accent color</Label>
        <Input
          type="color"
          className="h-12 max-w-[8rem] cursor-pointer p-1"
          value={config.accentColor}
          onChange={(e) => onChange({ ...config, accentColor: e.target.value })}
        />
      </div>

      <div className="space-y-3 border-t pt-6">
        <div>
          <Label>Photo & text slideshow</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Mix image slides with text slides — they play in order on the birthday page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addImageSlide}>
            <ImageIcon className="h-4 w-4" />
            Add photo slide
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addTextSlide}>
            <Type className="h-4 w-4" />
            Add text slide
          </Button>
        </div>

        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={i} className="space-y-3 rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Slide {i + 1} · {slide.type === "image" ? "Photo" : "Text"}
                </span>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={i === 0} onClick={() => moveSlide(i, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={i === slides.length - 1}
                    onClick={() => moveSlide(i, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSlide(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {slide.type === "image" ? (
                <>
                  <ImageUrlField
                    label="Photo"
                    value={slide.imageUrl}
                    onChange={(imageUrl) => updateSlide(i, { imageUrl })}
                    isAuthenticated={isAuthenticated}
                    urlPlaceholder="Or paste an image URL"
                  />
                  <div className="space-y-2">
                    <Label>Caption (optional)</Label>
                    <Input
                      placeholder="Remember this day?"
                      value={slide.caption ?? ""}
                      onChange={(e) => updateSlide(i, { caption: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Heading (optional)</Label>
                    <Input
                      placeholder="To my favorite person"
                      value={slide.heading ?? ""}
                      onChange={(e) => updateSlide(i, { heading: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slide text</Label>
                    <Textarea
                      placeholder="Write something sweet for this slide…"
                      value={slide.body}
                      onChange={(e) => updateSlide(i, { body: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
          {slides.length === 0 ? (
            <p className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
              No slides yet. Add photos or text cards for a slideshow.
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 border-t pt-6">
        <Label>Birthday song (Spotify)</Label>

        {!isAuthenticated && (
          <div className="rounded-2xl bg-muted px-4 py-4 text-sm text-muted-foreground">
            Sign in to connect Spotify and attach a song to this page.
          </div>
        )}

        {isAuthenticated && spotifyLoading && (
          <div className="rounded-2xl bg-muted px-4 py-4 text-sm text-muted-foreground">Checking Spotify…</div>
        )}

        {isAuthenticated && !spotifyLoading && !spotifyConnected && (
          <div className="rounded-2xl border border-[#1db95433] bg-[#1db95412] px-4 py-4">
            <p className="text-sm font-medium">Connect Spotify to add a song</p>
            <p className="mt-1 text-sm text-muted-foreground">Link your account to search tracks and embed one on the birthday page.</p>
            <Link
              href={connectHref}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#1db954] text-sm font-medium text-white hover:bg-[#1ed760]"
            >
              Connect Spotify
            </Link>
          </div>
        )}

        {isAuthenticated && !spotifyLoading && spotifyConnected && (
          <>
            {config.spotifyTrackId ? (
              <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                {config.spotifyTrackImageUrl ? (
                  <img src={config.spotifyTrackImageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background text-lg">♫</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{config.spotifyTrackName}</p>
                  <p className="truncate text-xs text-muted-foreground">{config.spotifyTrackArtist}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={clearTrack}>
                  Remove
                </Button>
              </div>
            ) : null}

            <Input
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="Search for a song…"
            />
            {searching && <p className="text-xs text-muted-foreground">Searching…</p>}
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-2xl bg-muted p-2">
              {trackResults.length === 0 && trackQuery.trim().length >= 2 && !searching ? (
                <p className="px-2 py-3 text-sm text-muted-foreground">No tracks found.</p>
              ) : (
                trackResults.map((track) => {
                  const selected = config.spotifyTrackId === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => selectTrack(track)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                        selected ? "bg-accent-soft ring-2 ring-accent" : "hover:bg-background/70"
                      )}
                    >
                      {track.imageUrl ? (
                        <img src={track.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">♫</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{track.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
                      </div>
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
    </div>
  );
}
