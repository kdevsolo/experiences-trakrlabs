import type { MemoryTimelineConfig } from "@/types/experience";

export type MemoryEntry = MemoryTimelineConfig["memories"][number];

export function parseMemoryDate(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export function sortMemories(memories: MemoryEntry[]): MemoryEntry[] {
  return memories
    .map((memory, index) => ({ memory, index }))
    .sort((a, b) => {
      const aTime = parseMemoryDate(a.memory.date);
      const bTime = parseMemoryDate(b.memory.date);
      if (aTime !== null && bTime !== null) return aTime - bTime;
      if (aTime !== null) return -1;
      if (bTime !== null) return 1;
      return a.index - b.index;
    })
    .map(({ memory }) => memory);
}

/** Minimum connector length after event at `index` before the next event (date-proportional). */
export function connectorMinHeightAfter(
  sorted: MemoryEntry[],
  index: number,
  options?: { minPx?: number; maxPx?: number; defaultPx?: number }
): number {
  const { minPx = 48, maxPx = 220, defaultPx = 72 } = options ?? {};
  if (index >= sorted.length - 1) return 0;

  const start = parseMemoryDate(sorted[index].date);
  const nextStart = parseMemoryDate(sorted[index + 1].date);
  if (start === null || nextStart === null) return defaultPx;

  const days = Math.max(0, (nextStart - start) / (1000 * 60 * 60 * 24));
  return Math.min(maxPx, Math.max(minPx, minPx + days * 3));
}

/** Height of the on-axis span when an event has a distinct end date. */
export function eventSpanHeight(
  memory: MemoryEntry,
  options?: { minPx?: number; maxPx?: number }
): number {
  const { minPx = 16, maxPx = 120 } = options ?? {};
  const start = parseMemoryDate(memory.date);
  const end = parseMemoryDate(memory.endDate ?? "");
  if (start === null || end === null || end <= start) return 0;

  const days = (end - start) / (1000 * 60 * 60 * 24);
  return Math.min(maxPx, Math.max(minPx, minPx + days * 2));
}

export function formatMemoryDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const parsed = parseMemoryDate(trimmed);
  if (parsed === null) return trimmed;
  return new Date(parsed).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMemoryRange(memory: MemoryEntry): string {
  const start = formatMemoryDate(memory.date);
  const end = memory.endDate?.trim() ? formatMemoryDate(memory.endDate) : "";
  if (!start) return end;
  if (!end || end === start) return start;
  return `${start} – ${end}`;
}

export function toDateInputValue(value: string): string {
  const parsed = parseMemoryDate(value);
  if (parsed === null) return "";
  const d = new Date(parsed);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetweenMemories(sorted: MemoryEntry[], fromIndex: number): number | null {
  if (fromIndex >= sorted.length - 1) return null;
  const start = parseMemoryDate(sorted[fromIndex].date);
  const next = parseMemoryDate(sorted[fromIndex + 1].date);
  if (start === null || next === null) return null;
  return Math.max(0, Math.round((next - start) / (1000 * 60 * 60 * 24)));
}

export function formatDaysBetween(days: number | null): string {
  if (days === null) return "Time between memories unknown";
  if (days === 0) return "0 days passed";
  if (days === 1) return "1 day passed";
  return `${days} days passed`;
}

export type JourneyPoint = {
  x: number;
  y: number;
  memory: MemoryEntry;
  index: number;
};

const JOURNEY_VIEW_W = 360;

export function buildJourneyLayout(sorted: MemoryEntry[]): {
  viewWidth: number;
  viewHeight: number;
  points: JourneyPoint[];
  pathD: string;
} {
  const paddingTop = 48;
  const paddingBottom = 48;
  const leftX = 72;
  const rightX = JOURNEY_VIEW_W - 72;
  const minSegment = 100;
  const maxSegment = 220;

  const points: JourneyPoint[] = [];
  let y = paddingTop;

  sorted.forEach((memory, index) => {
    const x = index % 2 === 0 ? leftX : rightX;
    points.push({ x, y, memory, index });
    if (index < sorted.length - 1) {
      const days = daysBetweenMemories(sorted, index);
      const dayFactor = days === null ? 40 : Math.min(120, Math.max(0, days * 2));
      y += Math.min(maxSegment, Math.max(minSegment, minSegment + dayFactor));
    }
  });

  const viewHeight = y + paddingBottom;
  const pathD = buildWindingPathD(points);

  return { viewWidth: JOURNEY_VIEW_W, viewHeight, points, pathD };
}

function buildWindingPathD(points: JourneyPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const bow = i % 2 === 1 ? JOURNEY_VIEW_W * 0.92 : JOURNEY_VIEW_W * 0.08;
    d += ` C ${bow} ${prev.y + 24}, ${bow} ${curr.y - 24}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/** Arc length along the curved path where each stop sits. */
export function measureStopDistances(pathEl: SVGPathElement, points: JourneyPoint[]): number[] {
  const total = pathEl.getTotalLength();
  return points.map((point) => {
    let bestLength = 0;
    let bestDist = Infinity;
    for (let len = 0; len <= total; len += 3) {
      const sample = pathEl.getPointAtLength(len);
      const dist = (sample.x - point.x) ** 2 + (sample.y - point.y) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        bestLength = len;
      }
    }
    return bestLength;
  });
}

/** Align 🚗 (faces east at 0°) to the path without flipping upside down. */
export function carRotationOnPath(pathEl: SVGPathElement, length: number): number {
  const total = pathEl.getTotalLength();
  const a = pathEl.getPointAtLength(Math.max(0, length - 3));
  const b = pathEl.getPointAtLength(Math.min(total, length + 3));
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angle > 90) angle -= 180;
  if (angle < -90) angle += 180;
  return angle;
}
