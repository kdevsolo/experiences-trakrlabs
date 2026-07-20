"use client";

import { motion } from "framer-motion";
import type { ConfessionConfig } from "@/types/experience";

export function ConfessionViewer({ config }: { config: ConfessionConfig; title: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:min-h-[70vh] sm:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg rounded-3xl border p-10 text-center shadow-xl" style={{ borderColor: `${config.accentColor}44` }}>
        <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
          {config.anonymous ? "Anonymous confession" : "A confession"}
        </p>
        <p className="whitespace-pre-wrap text-xl leading-relaxed">{config.message}</p>
      </motion.div>
    </div>
  );
}
