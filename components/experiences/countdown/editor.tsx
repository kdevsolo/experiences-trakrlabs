"use client";

import { Input, Label, Textarea } from "@/components/ui/input";
import type { CountdownConfig, EditorProps } from "@/types/experience";

export function CountdownEditor({ config, onChange }: EditorProps<CountdownConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={config.title} onChange={(e) => onChange({ ...config, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea value={config.message} onChange={(e) => onChange({ ...config, message: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Target date</Label>
        <Input
          type="datetime-local"
          value={config.targetDate}
          onChange={(e) => onChange({ ...config, targetDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Accent color</Label>
        <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
      </div>
    </div>
  );
}
