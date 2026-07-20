"use client";

import { Input, Textarea } from "@/components/ui/input";
import type { EditorProps, GiftRevealConfig } from "@/types/experience";

export function GiftRevealEditor({ config, onChange }: EditorProps<GiftRevealConfig>) {
  return (
    <div className="space-y-4">
      <Input placeholder="Title" value={config.title} onChange={(e) => onChange({ ...config, title: e.target.value })} />
      <Input placeholder="Reveal message" value={config.revealMessage} onChange={(e) => onChange({ ...config, revealMessage: e.target.value })} />
      <Textarea placeholder="Gift description" value={config.giftDescription} onChange={(e) => onChange({ ...config, giftDescription: e.target.value })} />
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
