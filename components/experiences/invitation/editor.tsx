"use client";

import { Input, Textarea } from "@/components/ui/input";
import type { EditorProps, InvitationConfig } from "@/types/experience";

export function InvitationEditor({ config, onChange }: EditorProps<InvitationConfig>) {
  return (
    <div className="space-y-4">
      <Input placeholder="Event name" value={config.eventName} onChange={(e) => onChange({ ...config, eventName: e.target.value })} />
      <Input placeholder="Date & time" value={config.date} onChange={(e) => onChange({ ...config, date: e.target.value })} />
      <Input placeholder="Location" value={config.location} onChange={(e) => onChange({ ...config, location: e.target.value })} />
      <Textarea placeholder="Message" value={config.message} onChange={(e) => onChange({ ...config, message: e.target.value })} />
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
