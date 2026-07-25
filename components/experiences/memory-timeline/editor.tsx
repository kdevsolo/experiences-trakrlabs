"use client";

import { ArrowDown, ArrowUp, CalendarRange, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { EditorProps, MemoryTimelineConfig } from "@/types/experience";
import { TimelineTrack } from "./timeline-track";
import { sortMemories, toDateInputValue } from "./timeline-utils";

type MemoryFields = MemoryTimelineConfig["memories"][number];

const emptyMemory = (): MemoryFields => ({
  date: "",
  endDate: "",
  title: "",
  description: "",
});

export function MemoryTimelineEditor({ config, onChange }: EditorProps<MemoryTimelineConfig>) {
  const updateMemory = (index: number, patch: Partial<MemoryFields>) => {
    const memories = [...config.memories];
    memories[index] = { ...memories[index], ...patch };
    onChange({ ...config, memories });
  };

  const removeMemory = (index: number) => {
    onChange({ ...config, memories: config.memories.filter((_, i) => i !== index) });
  };

  const moveMemory = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= config.memories.length) return;
    const memories = [...config.memories];
    [memories[index], memories[next]] = [memories[next], memories[index]];
    onChange({ ...config, memories });
  };

  const sortByDate = () => {
    onChange({ ...config, memories: sortMemories(config.memories) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Timeline title</Label>
        <Input
          placeholder="Our story"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Accent color</Label>
        <Input
          type="color"
          className="h-12 w-full max-w-[8rem] cursor-pointer p-1"
          value={config.accentColor}
          onChange={(e) => onChange({ ...config, accentColor: e.target.value })}
        />
      </div>

      <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">Live preview</p>
            <p className="text-xs text-muted-foreground">
              Events connect in date order; gaps reflect time between starts. Optional end dates show as a span on the line.
            </p>
          </div>
        </div>
        <TimelineTrack memories={config.memories} accentColor={config.accentColor} compact animate={false} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="mb-0">Events</Label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={sortByDate} disabled={config.memories.length < 2}>
            <CalendarRange className="h-3.5 w-3.5" />
            Sort by date
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ ...config, memories: [...config.memories, emptyMemory()] })}
          >
            <Plus className="h-3.5 w-3.5" />
            Add event
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {config.memories.map((memory, i) => (
          <div key={i} className="space-y-3 rounded-2xl border p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Event {i + 1}</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Move event up"
                  disabled={i === 0}
                  onClick={() => moveMemory(i, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Move event down"
                  disabled={i === config.memories.length - 1}
                  onClick={() => moveMemory(i, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  aria-label="Remove event"
                  onClick={() => removeMemory(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={toDateInputValue(memory.date)}
                  onChange={(e) => updateMemory(i, { date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End date (optional)</Label>
                <Input
                  type="date"
                  value={toDateInputValue(memory.endDate ?? "")}
                  onChange={(e) => updateMemory(i, { endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="First trip together"
                value={memory.title}
                onChange={(e) => updateMemory(i, { title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What happened? How did it feel?"
                value={memory.description}
                onChange={(e) => updateMemory(i, { description: e.target.value })}
              />
            </div>
          </div>
        ))}

        {config.memories.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">No events yet. Add your first memory to start the timeline.</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => onChange({ ...config, memories: [emptyMemory()] })}
            >
              <Plus className="h-4 w-4" />
              Add first event
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
