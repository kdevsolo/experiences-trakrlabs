"use client";

import { motion } from "framer-motion";
import type { BirthdayPageConfig } from "@/types/experience";
import { BirthdaySlideshow } from "./birthday-slideshow";

export function BirthdayPageViewer({ config }: { config: BirthdayPageConfig; title: string }) {
  const slides = (config.slides ?? []).filter((slide) =>
    slide.type === "image" ? slide.imageUrl.trim().length > 0 : slide.body.trim().length > 0
  );

  const trackEmbed = config.spotifyTrackId
    ? `https://open.spotify.com/embed/track/${config.spotifyTrackId}?utm_source=generator&theme=0`
    : null;

  const ageLabel = config.age > 0 ? `${config.age}${ordinal(config.age)}` : "";

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-4 py-8 sm:min-h-[70vh] sm:p-8">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-6xl"
      >
        🎂
      </motion.div>
      <h1 className="mt-4 text-center font-serif text-2xl sm:text-4xl" style={{ color: config.accentColor }}>
        {config.name ? (
          <>
            Happy {ageLabel ? `${ageLabel} ` : ""}Birthday, {config.name}!
          </>
        ) : (
          "Happy Birthday!"
        )}
      </h1>
      {config.message ? <p className="mt-4 max-w-md text-center text-lg">{config.message}</p> : null}

      {slides.length > 0 ? (
        <div className="mt-8 w-full">
          <BirthdaySlideshow slides={slides} accentColor={config.accentColor} />
        </div>
      ) : null}

      {trackEmbed ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 w-full max-w-md overflow-hidden rounded-2xl border bg-muted/30 p-2 shadow-lg"
        >
          <iframe
            src={trackEmbed}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title={config.spotifyTrackName ?? "Birthday song"}
          />
        </motion.div>
      ) : null}
    </div>
  );
}

function ordinal(age: number): string {
  const mod100 = age % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  switch (age % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
