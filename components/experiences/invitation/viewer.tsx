"use client";

import { motion } from "framer-motion";
import type { InvitationConfig } from "@/types/experience";

export function InvitationViewer({ config }: { config: InvitationConfig; title: string }) {
  return (
    <div className="mx-auto max-w-lg p-8 text-center">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl border p-10 shadow-xl" style={{ borderColor: `${config.accentColor}55` }}>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">You are invited</p>
        <h1 className="mt-4 font-serif text-4xl" style={{ color: config.accentColor }}>{config.eventName}</h1>
        <p className="mt-6 text-lg">{config.date}</p>
        <p className="text-muted-foreground">{config.location}</p>
        <p className="mt-8 whitespace-pre-wrap">{config.message}</p>
      </motion.div>
    </div>
  );
}
