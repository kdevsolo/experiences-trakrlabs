"use client";

import { motion } from "framer-motion";
import type { SpotifyCassetteConfig } from "@/types/experience";
import { cn } from "@/lib/utils";

function TapeReel({ spinning, reverse }: { spinning?: boolean; reverse?: boolean }) {
  return (
    <motion.div
      animate={spinning ? { rotate: reverse ? -360 : 360 } : undefined}
      transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
      className="relative h-[3.4rem] w-[3.4rem] rounded-full border-2 border-neutral-500 bg-neutral-800 shadow-inner"
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <div
          key={deg}
          className="absolute left-1/2 top-1/2 h-[42%] w-[3px] origin-bottom rounded-full bg-neutral-500/80"
          style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
        />
      ))}
      <div className="absolute inset-[22%] rounded-full border border-neutral-600 bg-neutral-950" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400" />
    </motion.div>
  );
}

function Screw({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full border border-black/40 bg-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
        className
      )}
    />
  );
}

export function CassetteVisual({
  config,
  title,
  spinning = true,
  className,
}: {
  config: SpotifyCassetteConfig;
  title: string;
  spinning?: boolean;
  className?: string;
}) {
  const shell = config.coverColor || "#3d3d3d";
  const labelTitle = config.title || title || "Mixtape";
  const labelSubtitle = config.subtitle || config.playlistName || "Spotify playlist";

  return (
    <div className={cn("mx-auto w-full max-w-[340px]", className)}>
      <div
        className="relative overflow-hidden rounded-[1.1rem] px-5 pb-5 pt-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${shell} 70%, white) 0%, ${shell} 38%, color-mix(in srgb, ${shell} 75%, black) 100%)`,
        }}
      >
        <Screw className="absolute left-3 top-3" />
        <Screw className="absolute right-3 top-3" />
        <Screw className="absolute bottom-3 left-3" />
        <Screw className="absolute bottom-3 right-3" />

        <div className="mb-4 rounded-md border border-black/25 bg-[#efe3c8] p-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)]">
          <div className="flex items-start gap-3">
            {config.playlistImageUrl ? (
              <img
                src={config.playlistImageUrl}
                alt=""
                className="h-14 w-14 shrink-0 rounded-sm border border-black/15 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-black/15 bg-[#ddd0b4] text-xl">
                ♫
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[15px] font-bold leading-tight text-[#1f1a14]">
                {labelTitle}
              </p>
              <p className="mt-0.5 truncate text-[11px] uppercase tracking-[0.14em] text-[#5c5348]">
                {labelSubtitle}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6a6156]">
            <span>Side A</span>
            <span>Chrome</span>
            <span>90 min</span>
          </div>
        </div>

        <div className="relative mx-auto w-[88%] rounded-lg border-[3px] border-black/35 bg-[#121212] px-4 py-3 shadow-[inset_0_4px_12px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between">
            <TapeReel spinning={spinning} />
            <div className="mx-2 h-9 flex-1 rounded-sm bg-gradient-to-b from-neutral-700/70 to-neutral-900/90 shadow-inner" />
            <TapeReel spinning={spinning} reverse />
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-2.5 w-2.5 rounded-full border border-black/30 bg-black/70 shadow-inner"
            />
          ))}
        </div>

        <div className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-black/35">
          Stereo · High Bias
        </div>
      </div>
    </div>
  );
}
