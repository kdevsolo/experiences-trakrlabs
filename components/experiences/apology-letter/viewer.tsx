"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ApologyLetterConfig } from "@/types/experience";
import { trackApologyAccept } from "@/components/experiences/shared/analytics-client";

export function ApologyLetterViewer({
  config,
  experienceId,
}: {
  config: ApologyLetterConfig;
  title: string;
  experienceId?: string;
}) {
  const [opened, setOpened] = useState(false);
  const [accepted, setAccepted] = useState(false);

  if (!opened) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:min-h-[70vh] sm:p-8">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpened(true)}
          className="rounded-3xl border border-border bg-card px-10 py-16 shadow-xl"
          style={{ borderColor: `${config.accentColor}55` }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl"
          >
            ✉️
          </motion.div>
          <p className="mt-4 text-lg font-medium">Tap to open your letter</p>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl p-8"
    >
      <div
        className="rounded-3xl border p-8 shadow-xl"
        style={{ borderColor: `${config.accentColor}44`, background: `${config.accentColor}10` }}
      >
        <p className="mb-2 text-sm text-muted-foreground">
          {config.greeting} {config.recipientName},
        </p>
        <div className="mb-8 whitespace-pre-wrap text-lg leading-relaxed">{config.body}</div>
        <p className="mb-2">{config.closing},</p>
        <p className="font-serif text-xl">{config.signature || config.senderName}</p>
      </div>
      {!accepted && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setAccepted(true);
            if (experienceId) trackApologyAccept(experienceId);
          }}
          className="mt-6 w-full rounded-full py-3 font-medium text-white"
          style={{ background: config.accentColor }}
        >
          I accept your apology
        </motion.button>
      )}
      {accepted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center text-emerald-600"
        >
          Apology accepted 💚
        </motion.p>
      )}
    </motion.div>
  );
}
