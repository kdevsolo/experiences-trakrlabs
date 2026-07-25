"use client";

import { motion } from "framer-motion";
import {
  connectorMinHeightAfter,
  eventSpanHeight,
  formatMemoryRange,
  sortMemories,
  type MemoryEntry,
} from "./timeline-utils";

type TimelineTrackProps = {
  memories: MemoryEntry[];
  accentColor: string;
  /** Smaller typography and spacing for the builder preview. */
  compact?: boolean;
  animate?: boolean;
};

export function TimelineTrack({ memories, accentColor, compact = false, animate = true }: TimelineTrackProps) {
  const sorted = sortMemories(memories);
  const accentSoft = `${accentColor}55`;
  const accentMuted = `${accentColor}33`;
  const nodeSize = compact ? 12 : 16;

  if (sorted.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Add events with dates to see your timeline connect from one moment to the next.
      </p>
    );
  }

  const Node = animate ? motion.div : "div";
  const Line = animate ? motion.div : "div";
  const Card = animate ? motion.div : "div";

  const nodeProps = (delay: number) =>
    animate
      ? {
          initial: { scale: 0, opacity: 0 },
          whileInView: { scale: 1, opacity: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: { type: "spring" as const, stiffness: 320, damping: 22, delay },
        }
      : {};

  const lineProps = (delay: number) =>
    animate
      ? {
          initial: { scaleY: 0, opacity: 0.4 },
          whileInView: { scaleY: 1, opacity: 1 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
        }
      : {};

  const cardProps = (delay: number) =>
    animate
      ? {
          initial: { opacity: 0, x: compact ? 0 : 16 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.45, delay: delay + 0.08 },
        }
      : {};

  return (
    <div className={compact ? "space-y-0" : "mx-auto max-w-2xl"}>
      {sorted.map((memory, index) => {
        const spanH = eventSpanHeight(memory, compact ? { minPx: 8, maxPx: 48 } : undefined);
        const minConnector = connectorMinHeightAfter(
          sorted,
          index,
          compact ? { minPx: 32, maxPx: 80, defaultPx: 40 } : undefined
        );
        const isLast = index === sorted.length - 1;
        const delay = index * 0.12;

        return (
          <div key={`${memory.title}-${memory.date}-${index}`} className="flex gap-4 sm:gap-6">
            <div
              className="flex w-8 shrink-0 flex-col items-center self-stretch sm:w-10"
              style={{ minHeight: isLast ? undefined : minConnector + nodeSize + spanH }}
            >
              <Node
                className="relative z-10 shrink-0 rounded-full border-[3px] bg-background shadow-sm"
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderColor: accentColor,
                  boxShadow: `0 0 0 4px ${accentMuted}`,
                }}
                {...nodeProps(delay)}
              />
              {spanH > 0 ? (
                <Line
                  className="mt-0.5 w-1 shrink-0 origin-top rounded-full"
                  style={{ height: spanH, backgroundColor: accentSoft }}
                  {...lineProps(delay + 0.04)}
                />
              ) : null}
              {!isLast ? (
                <Line
                  className="mt-0.5 w-0.5 min-h-0 flex-1 origin-top rounded-full"
                  style={{
                    minHeight: Math.max(0, minConnector - spanH),
                    backgroundColor: accentColor,
                  }}
                  {...lineProps(delay + 0.08)}
                />
              ) : null}
            </div>

            <Card className={compact ? "min-w-0 flex-1 pb-4" : "min-w-0 flex-1 pb-10 sm:pb-12"} {...cardProps(delay)}>
              <p className={compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>
                {formatMemoryRange(memory) || "Date not set"}
              </p>
              <h3
                className={
                  compact ? "mt-0.5 truncate text-sm font-semibold" : "mt-1 text-xl font-semibold"
                }
              >
                {memory.title || "Untitled moment"}
              </h3>
              {memory.description ? (
                <p
                  className={
                    compact
                      ? "mt-1 line-clamp-2 text-xs text-muted-foreground"
                      : "mt-2 text-muted-foreground"
                  }
                >
                  {memory.description}
                </p>
              ) : null}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
