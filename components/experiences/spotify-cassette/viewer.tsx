"use client";

import { motion } from "framer-motion";
import type { SpotifyCassetteConfig } from "@/types/experience";
import { CassetteVisual } from "./cassette-visual";

export function SpotifyCassetteViewer({
  config,
  title,
}: {
  config: SpotifyCassetteConfig;
  title: string;
}) {
  const playlistEmbed = config.playlistId
    ? `https://open.spotify.com/embed/playlist/${config.playlistId}?utm_source=generator&theme=0`
    : null;

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-8 overflow-hidden px-4 py-10 sm:min-h-[70vh] sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_55%),linear-gradient(180deg,#17120f_0%,#0b0a0f_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.35))]" />

      <motion.div
        initial={{ y: 24, opacity: 0, rotate: -4 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="relative z-10 w-full max-w-md"
      >
        <CassetteVisual config={config} title={title} spinning={Boolean(config.playlistId)} />
      </motion.div>

      {playlistEmbed ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-sm"
        >
          <iframe
            src={playlistEmbed}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title={config.playlistName ?? "Spotify playlist"}
          />
        </motion.div>
      ) : (
        <p className="relative z-10 text-sm text-white/50">No playlist selected yet</p>
      )}
    </div>
  );
}
