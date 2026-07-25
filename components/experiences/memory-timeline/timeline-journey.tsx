"use client";

import { animate } from "framer-motion";
import { Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  buildJourneyLayout,
  carRotationOnPath,
  daysBetweenMemories,
  formatDaysBetween,
  formatMemoryRange,
  measureStopDistances,
  sortMemories,
  type MemoryEntry,
} from "./timeline-utils";

type Phase = "idle" | "playing" | "done";

type TimelineJourneyProps = {
  memories: MemoryEntry[];
  accentColor: string;
};

export function TimelineJourney({ memories, accentColor }: TimelineJourneyProps) {
  const sorted = useMemo(() => sortMemories(memories), [memories]);
  const layout = useMemo(() => buildJourneyLayout(sorted), [sorted]);

  const roadRef = useRef<SVGPathElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState(0);
  const [legLabel, setLegLabel] = useState<string | null>(null);
  const [roadDrawn, setRoadDrawn] = useState(0);
  const [car, setCar] = useState({
    x: layout.points[0]?.x ?? 0,
    y: layout.points[0]?.y ?? 0,
    rotate: 90,
  });
  const runIdRef = useRef(0);

  const accentSoft = `${accentColor}44`;
  const accentRoad = `${accentColor}99`;

  useEffect(() => {
    if (phase !== "idle") return;
    const first = layout.points[0];
    if (!first) return;
    setCar({ x: first.x, y: first.y, rotate: 90 });
    setActiveIndex(0);
    setRoadDrawn(0);
    setLegLabel(null);
  }, [layout, phase]);

  const playJourney = useCallback(async () => {
    const path = roadRef.current;
    if (!path || layout.points.length === 0) return;

    const runId = ++runIdRef.current;
    setPhase("playing");
    setActiveIndex(0);
    setLegLabel(null);

    const stopDistances = measureStopDistances(path, layout.points);
    const totalLength = path.getTotalLength();

    setCar({
      x: layout.points[0].x,
      y: layout.points[0].y,
      rotate: carRotationOnPath(path, stopDistances[0]),
    });

    if (layout.points.length === 1) {
      setRoadDrawn(1);
      setActiveIndex(0);
      setPhase("done");
      return;
    }

    await animate(0, stopDistances[0] / totalLength, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) => {
        if (runId !== runIdRef.current) return;
        setRoadDrawn(t);
      },
    }).then(() => undefined);

    for (let leg = 0; leg < layout.points.length - 1; leg++) {
      if (runId !== runIdRef.current) return;

      const days = daysBetweenMemories(sorted, leg);
      setLegLabel(formatDaysBetween(days));

      const from = stopDistances[leg];
      const to = stopDistances[leg + 1];
      const legDays = days ?? 14;
      const duration = Math.min(4, Math.max(1.2, 0.8 + legDays * 0.06));

      await animate(from, to, {
        duration,
        ease: "linear",
        onUpdate: (len) => {
          if (runId !== runIdRef.current) return;
          const point = path.getPointAtLength(len);
          setCar({
            x: point.x,
            y: point.y,
            rotate: carRotationOnPath(path, len),
          });
          setRoadDrawn(len / totalLength);
        },
      }).then(() => undefined);

      if (runId !== runIdRef.current) return;
      setActiveIndex(leg + 1);
      setLegLabel(null);
      await new Promise((r) => setTimeout(r, 400));
    }

    if (runId !== runIdRef.current) return;
    setPhase("done");
  }, [layout.points, sorted]);

  if (sorted.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        Add dated memories to take a trip through your story.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        {phase === "playing" ? (
          <p className="text-sm text-muted-foreground">Driving through your memories…</p>
        ) : (
          <Button type="button" variant="accent" onClick={playJourney}>
            <Play className="h-4 w-4" />
            {phase === "done" ? "Watch again" : "Start journey"}
          </Button>
        )}
      </div>

      <div
        className="relative mx-auto w-full max-w-lg overflow-visible rounded-3xl border bg-muted/20"
        style={{ aspectRatio: `${layout.viewWidth} / ${layout.viewHeight}` }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${layout.viewWidth} ${layout.viewHeight}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <path
            d={layout.pathD}
            fill="none"
            stroke={accentSoft}
            strokeWidth={18}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={roadRef}
            d={layout.pathD}
            fill="none"
            stroke={accentRoad}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - roadDrawn}
          />
          <path
            d={layout.pathD}
            fill="none"
            stroke={accentColor}
            strokeWidth={3}
            strokeDasharray="8 10"
            strokeLinecap="round"
            opacity={0.85}
            pathLength={1}
            strokeDashoffset={1 - roadDrawn}
          />
        </svg>

        <div
          className="pointer-events-none absolute z-20 text-2xl drop-shadow-md"
          style={{
            left: `${(car.x / layout.viewWidth) * 100}%`,
            top: `${(car.y / layout.viewHeight) * 100}%`,
            transform: `translate(-50%, -50%) rotate(${car.rotate}deg)`,
          }}
          aria-hidden
        >
          🚗
        </div>

        {legLabel ? (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-4">
            <div
              className="rounded-full px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm"
              style={{ backgroundColor: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}55` }}
            >
              {legLabel}
            </div>
          </div>
        ) : null}

        {layout.points.map((point) => {
          const revealed = phase === "idle" ? point.index === 0 : point.index <= activeIndex;
          return (
            <div
              key={`${point.memory.title}-${point.index}`}
              className="absolute z-10 w-[42%] transition-all duration-500"
              style={{
                left: point.x > layout.viewWidth / 2 ? "4%" : "auto",
                right: point.x > layout.viewWidth / 2 ? "auto" : "4%",
                top: `${(point.y / layout.viewHeight) * 100}%`,
                transform: "translateY(-50%)",
                opacity: revealed ? 1 : 0.3,
                filter: revealed ? "none" : "grayscale(0.5)",
              }}
            >
              <div
                className="rounded-2xl border bg-background/95 p-2.5 shadow-md backdrop-blur-sm sm:p-3"
                style={{ borderColor: revealed ? `${accentColor}66` : undefined }}
              >
                <p className="text-[10px] text-muted-foreground sm:text-xs">{formatMemoryRange(point.memory) || "Date TBD"}</p>
                <p className="mt-0.5 text-xs font-semibold leading-tight sm:text-sm">{point.memory.title || "Untitled"}</p>
                {point.memory.description && revealed ? (
                  <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground sm:text-xs">{point.memory.description}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {phase === "idle" ? (
        <p className="text-center text-xs text-muted-foreground">
          The road winds between each stop. While the car travels, you&apos;ll see how many days passed until the next memory.
        </p>
      ) : null}
    </div>
  );
}
