"use client";

import { Input, Label, Textarea } from "@/components/ui/input";
import type { DigitalCardConfig } from "@/types/experience";
import type { EditorProps } from "@/types/experience";

export function DigitalCardEditor({
  config,
  onChange,
}: EditorProps<DigitalCardConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName">Recipient name</Label>
        <Input
          id="recipientName"
          value={config.recipientName}
          onChange={(e) => onChange({ ...config, recipientName: e.target.value })}
          placeholder="Who is this for?"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="senderName">Your name</Label>
        <Input
          id="senderName"
          value={config.senderName}
          onChange={(e) => onChange({ ...config, senderName: e.target.value })}
          placeholder="From..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={config.message}
          onChange={(e) => onChange({ ...config, message: e.target.value })}
          placeholder="Write something heartfelt..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={config.imageUrl ?? ""}
          onChange={(e) => onChange({ ...config, imageUrl: e.target.value || undefined })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accentColor">Accent color</Label>
        <Input
          id="accentColor"
          type="color"
          value={config.accentColor}
          onChange={(e) => onChange({ ...config, accentColor: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="backgroundStyle">Background style</Label>
        <select
          id="backgroundStyle"
          className="flex h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          value={config.backgroundStyle}
          onChange={(e) =>
            onChange({
              ...config,
              backgroundStyle: e.target.value as DigitalCardConfig["backgroundStyle"],
            })
          }
        >
          <option value="gradient">Gradient</option>
          <option value="solid">Solid</option>
          <option value="pattern">Pattern</option>
        </select>
      </div>
    </div>
  );
}
