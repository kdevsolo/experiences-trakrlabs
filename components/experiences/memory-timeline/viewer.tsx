"use client";

import { motion } from "framer-motion";
import type { MemoryTimelineConfig } from "@/types/experience";

export function MemoryTimelineViewer({ config, title }: { config: MemoryTimelineConfig; title: string }) {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-10 text-center font-serif text-4xl" style={{ color: config.accentColor }}>{config.title || title}</h1>
      <div className="space-y-8 border-l-2 pl-8" style={{ borderColor: `${config.accentColor}66` }}>
        {config.memories.map((memory, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-sm text-muted-foreground">{memory.date}</p>
            <h3 className="text-xl font-semibold">{memory.title}</h3>
            <p className="mt-2 text-muted-foreground">{memory.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
