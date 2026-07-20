"use client";

import { motion } from "framer-motion";
import type { BirthdayPageConfig } from "@/types/experience";

export function BirthdayPageViewer({ config }: { config: BirthdayPageConfig; title: string }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8 text-center sm:min-h-[70vh] sm:p-8">
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl">🎂</motion.div>
      <h1 className="mt-4 font-serif text-2xl sm:text-4xl" style={{ color: config.accentColor }}>Happy {config.age}th Birthday, {config.name}!</h1>
      <p className="mt-4 max-w-md text-lg">{config.message}</p>
    </div>
  );
}
