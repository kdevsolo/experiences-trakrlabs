"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperienceImageUploadButton } from "@/components/ui/image-url-field";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { EditorProps, LoveLetterConfig } from "@/types/experience";

export function LoveLetterEditor({ config, onChange, isAuthenticated }: EditorProps<LoveLetterConfig>) {
  const photoUrls = config.photoUrls ?? [];

  return (
    <div className="space-y-4">
      <Input placeholder="Recipient" value={config.recipientName} onChange={(e) => onChange({ ...config, recipientName: e.target.value })} />
      <Input placeholder="Your name" value={config.senderName} onChange={(e) => onChange({ ...config, senderName: e.target.value })} />
      <Textarea placeholder="Your love letter..." value={config.message} onChange={(e) => onChange({ ...config, message: e.target.value })} />
      <div className="space-y-3">
        <Label>Photos</Label>
        <ExperienceImageUploadButton
          isAuthenticated={isAuthenticated}
          onUploaded={(url) => onChange({ ...config, photoUrls: [...photoUrls, url] })}
        />
        {photoUrls.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {photoUrls.map((url, i) => (
              <div key={`${url}-${i}`} className="relative">
                <img src={url} alt="" className="h-28 w-full rounded-xl object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full bg-background/80"
                  aria-label="Remove photo"
                  onClick={() => onChange({ ...config, photoUrls: photoUrls.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}
        <Input
          placeholder="Or paste URLs, comma separated"
          value={photoUrls.join(", ")}
          onChange={(e) =>
            onChange({
              ...config,
              photoUrls: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
      <Input type="color" value={config.accentColor} onChange={(e) => onChange({ ...config, accentColor: e.target.value })} />
    </div>
  );
}
