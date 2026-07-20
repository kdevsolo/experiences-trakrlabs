"use client";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import type { EditorProps, MemoryTimelineConfig } from "@/types/experience";

export function MemoryTimelineEditor({ config, onChange }: EditorProps<MemoryTimelineConfig>) {
  const updateMemory = (index: number, field: keyof MemoryTimelineConfig["memories"][0], value: string) => {
    const memories = [...config.memories];
    memories[index] = { ...memories[index], [field]: value };
    onChange({ ...config, memories });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Timeline title" value={config.title} onChange={(e) => onChange({ ...config, title: e.target.value })} />
      {config.memories.map((memory, i) => (
        <div key={i} className="space-y-2 rounded-xl border p-4">
          <Input placeholder="Date" value={memory.date} onChange={(e) => updateMemory(i, "date", e.target.value)} />
          <Input placeholder="Title" value={memory.title} onChange={(e) => updateMemory(i, "title", e.target.value)} />
          <Textarea placeholder="Description" value={memory.description} onChange={(e) => updateMemory(i, "description", e.target.value)} />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange({ ...config, memories: [...config.memories, { date: "", title: "", description: "" }] })}>
        Add memory
      </Button>
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
