"use client";

import { motion } from "framer-motion";
import type { DigitalCardConfig } from "@/types/experience";

export function DigitalCardViewer({
  config,
  title,
}: {
  config: DigitalCardConfig;
  title: string;
}) {
  const bg =
    config.backgroundStyle === "gradient"
      ? `linear-gradient(135deg, ${config.accentColor}22, ${config.accentColor}55)`
      : config.backgroundStyle === "pattern"
        ? `radial-gradient(circle at 20% 20%, ${config.accentColor}33, transparent 40%), ${config.accentColor}11`
        : `${config.accentColor}18`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto flex min-h-[100dvh] max-w-lg flex-col items-center justify-center px-4 py-8 sm:min-h-[70vh] sm:p-8"
    >
      <div
        className="w-full overflow-hidden rounded-3xl border border-white/20 p-8 shadow-2xl backdrop-blur"
        style={{ background: bg }}
      >
        {config.imageUrl && (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            src={config.imageUrl}
            alt=""
            className="mb-6 h-48 w-full rounded-2xl object-cover"
          />
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-2 text-sm uppercase tracking-[0.2em] text-muted-foreground"
        >
          {title}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 font-serif text-3xl sm:text-4xl"
          style={{ color: config.accentColor }}
        >
          {config.recipientName || "Someone special"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mb-8 whitespace-pre-wrap text-lg leading-relaxed"
        >
          {config.message || "Your message will appear here..."}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-right font-medium"
        >
          — {config.senderName || "You"}
        </motion.p>
      </div>
    </motion.div>
  );
}
