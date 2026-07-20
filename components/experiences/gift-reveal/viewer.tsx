"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GiftRevealConfig } from "@/types/experience";

export function GiftRevealViewer({ config, title }: { config: GiftRevealConfig; title: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8 text-center sm:min-h-[70vh] sm:p-8">
      <h1 className="mb-8 text-3xl font-serif">{config.title || title}</h1>
      {!revealed ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setRevealed(true)}
          className="rounded-3xl px-16 py-20 text-2xl font-semibold text-white shadow-xl"
          style={{ background: `linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}aa)` }}
        >
          {config.revealMessage || "Tap to reveal your gift"}
        </motion.button>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl border p-10">
          <div className="text-5xl">🎁</div>
          <p className="mt-4 text-xl">{config.giftDescription}</p>
        </motion.div>
      )}
    </div>
  );
}
