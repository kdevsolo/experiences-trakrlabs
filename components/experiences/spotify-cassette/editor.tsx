"use client";

import { Input, Label } from "@/components/ui/input";
import type { EditorProps, SpotifyCassetteConfig } from "@/types/experience";

export function SpotifyCassetteEditor({
  config,
  onChange,
}: EditorProps<SpotifyCassetteConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={config.title} onChange={(e) => onChange({ ...config, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={config.subtitle} onChange={(e) => onChange({ ...config, subtitle: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Spotify Playlist ID</Label>
        <Input
          value={config.playlistId ?? ""}
          onChange={(e) => onChange({ ...config, playlistId: e.target.value || undefined })}
          placeholder="37i9dQZF1DX..."
        />
      </div>
      <div className="space-y-2">
        <Label>Playlist name</Label>
        <Input
          value={config.playlistName ?? ""}
          onChange={(e) => onChange({ ...config, playlistName: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-2">
        <Label>Cassette color</Label>
        <Input
          type="color"
          value={config.coverColor}
          onChange={(e) => onChange({ ...config, coverColor: e.target.value })}
        />
      </div>
    </div>
  );
}
