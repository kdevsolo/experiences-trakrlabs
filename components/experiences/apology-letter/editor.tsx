"use client";

import { Input, Label, Textarea } from "@/components/ui/input";
import type { ApologyLetterConfig, EditorProps } from "@/types/experience";

export function ApologyLetterEditor({ config, onChange }: EditorProps<ApologyLetterConfig>) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Recipient</Label>
          <Input
            value={config.recipientName}
            onChange={(e) => onChange({ ...config, recipientName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Your name</Label>
          <Input
            value={config.senderName}
            onChange={(e) => onChange({ ...config, senderName: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Greeting</Label>
        <Input
          value={config.greeting}
          onChange={(e) => onChange({ ...config, greeting: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Letter body</Label>
        <Textarea
          value={config.body}
          onChange={(e) => onChange({ ...config, body: e.target.value })}
          className="min-h-[180px]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Closing</Label>
          <Input
            value={config.closing}
            onChange={(e) => onChange({ ...config, closing: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Signature</Label>
          <Input
            value={config.signature}
            onChange={(e) => onChange({ ...config, signature: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Accent color</Label>
        <Input
          type="color"
          value={config.accentColor}
          onChange={(e) => onChange({ ...config, accentColor: e.target.value })}
        />
      </div>
    </div>
  );
}
