"use client";

import { motion } from "framer-motion";
import type { MemoryTimelineConfig } from "@/types/experience";
import { TimelineJourney } from "./timeline-journey";

export function MemoryTimelineViewer({ config, title }: { config: MemoryTimelineConfig; title: string }) {
  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center font-serif text-3xl sm:text-4xl"
        style={{ color: config.accentColor }}
      >
        {config.title || title}
      </motion.h1>
      <TimelineJourney memories={config.memories} accentColor={config.accentColor} />
    </div>
  );
}
