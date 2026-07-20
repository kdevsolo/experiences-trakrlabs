"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CountdownConfig } from "@/types/experience";

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export function CountdownViewer({ config, title }: { config: CountdownConfig; title: string }) {
  const [time, setTime] = useState(getTimeLeft(config.targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(config.targetDate)), 1000);
    return () => clearInterval(timer);
  }, [config.targetDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8 text-center sm:min-h-[70vh] sm:p-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-4xl font-serif">
        {config.title || title}
      </motion.h1>
      <p className="mb-10 text-muted-foreground">{config.message}</p>
      {time.done ? (
        <p className="text-2xl font-semibold" style={{ color: config.accentColor }}>
          It is time!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {units.map((unit) => (
            <motion.div
              key={unit.label}
              className="rounded-2xl border p-6"
              style={{ borderColor: `${config.accentColor}44` }}
            >
              <div className="text-4xl font-bold" style={{ color: config.accentColor }}>
                {unit.value}
              </div>
              <div className="text-sm text-muted-foreground">{unit.label}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
