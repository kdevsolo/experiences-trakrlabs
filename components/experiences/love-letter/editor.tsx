"use client";

import { Input, Label, Textarea } from "@/components/ui/input";
import type { EditorProps, LoveLetterConfig } from "@/types/experience";

export function LoveLetterEditor({ config, onChange }: EditorProps<LoveLetterConfig>) {
  return (
    <div className="space-y-4">
      <Input placeholder="Recipient" value={config.recipientName} onChange={(e) => onChange({ ...config, recipientName: e.target.value })} />
      <Input placeholder="Your name" value={config.senderName} onChange={(e) => onChange({ ...config, senderName: e.target.value })} />
      <Textarea placeholder="Your love letter..." value={config.message} onChange={(e) => onChange({ ...config, message: e.target.value })} />
      <div className="space-y-2">
        <Label>Photo URLs (comma separated)</Label>
        <Input
          value={config.photoUrls.join(", ")}
          onChange={(e) => onChange({ ...config, photoUrls: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
      </div>
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
