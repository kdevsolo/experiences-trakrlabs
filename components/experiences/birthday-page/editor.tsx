"use client";

import { Input, Textarea } from "@/components/ui/input";
import type { BirthdayPageConfig, EditorProps } from "@/types/experience";

export function BirthdayPageEditor({ config, onChange }: EditorProps<BirthdayPageConfig>) {
  return (
    <div className="space-y-4">
      <Input placeholder="Name" value={config.name} onChange={(e) => onChange({ ...config, name: e.target.value })} />
      <Input type="number" placeholder="Age" value={config.age || ""} onChange={(e) => onChange({ ...config, age: Number(e.target.value) || 0 })} />
      <Textarea placeholder="Birthday message" value={config.message} onChange={(e) => onChange({ ...config, message: e.target.value })} />
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
