"use client";

import { motion } from "framer-motion";
import type { SpotifyCassetteConfig } from "@/types/experience";

export function SpotifyCassetteViewer({
  config,
  title,
}: {
  config: SpotifyCassetteConfig;
  title: string;
}) {
  const playlistEmbed = config.playlistId
    ? `https://open.spotify.com/embed/playlist/${config.playlistId}`
    : null;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4 py-8 sm:min-h-[70vh] sm:gap-8 sm:p-8">
      <motion.div
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        className="relative w-full max-w-md rounded-[2rem] p-8 shadow-2xl"
        style={{ background: config.coverColor }}
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-black/20 text-4xl">
            📼
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{config.title || title}</h1>
            <p className="text-white/80">{config.subtitle || config.playlistName || "Your mixtape"}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="mx-auto h-20 w-20 rounded-full border-4 border-white/30"
        />
      </motion.div>
      {playlistEmbed && (
        <iframe
          src={playlistEmbed}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="max-w-md rounded-xl"
        />
      )}
    </div>
  );
}
