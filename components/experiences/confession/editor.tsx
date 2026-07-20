"use client";

import { Input, Textarea } from "@/components/ui/input";
import type { ConfessionConfig, EditorProps } from "@/types/experience";

export function ConfessionEditor({ config, onChange }: EditorProps<ConfessionConfig>) {
  return (
    <div className="space-y-4">
      <Textarea placeholder="Your confession..." value={config.message} onChange={(e) => onChange({ ...config, message: e.target.value })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={config.anonymous} onChange={(e) => onChange({ ...config, anonymous: e.target.checked })} />
        Stay anonymous
      </label>
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
