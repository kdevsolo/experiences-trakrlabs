"use client";

import { motion } from "framer-motion";
import type { LoveLetterConfig } from "@/types/experience";

export function LoveLetterViewer({ config, title }: { config: LoveLetterConfig; title: string }) {
  return (
    <div className="mx-auto max-w-xl p-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 font-serif text-4xl" style={{ color: config.accentColor }}>
        For {config.recipientName || title}
      </motion.h1>
      {config.photoUrls?.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3">
          {config.photoUrls.map((url, i) => (
            <motion.img key={url + i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} src={url} alt="" className="h-32 w-full rounded-2xl object-cover" />
          ))}
        </div>
      )}
      <p className="whitespace-pre-wrap text-lg leading-relaxed">{config.message}</p>
      <p className="mt-8 text-right font-medium">— {config.senderName}</p>
    </div>
  );
}
