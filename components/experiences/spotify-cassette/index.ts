import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { SpotifyCassetteEditor } from "./editor";
import { SpotifyCassetteViewer } from "./viewer";

export const spotifyCassettePlugin: ExperiencePlugin = {
  type: "spotify_cassette",
  meta: {
    type: "spotify_cassette",
    name: "Spotify Cassette",
    description: "Share a playlist as a retro cassette tape",
    icon: "📼",
    available: true,
    sortOrder: 2,
  },
  defaultConfig: {
    configVersion: 1,
    title: "",
    subtitle: "",
    coverColor: "#1db954",
  },
  configSchema: z.object({
    configVersion: z.number(),
    title: z.string(),
    subtitle: z.string(),
    playlistId: z.string().optional(),
    playlistName: z.string().optional(),
    playlistImageUrl: z.string().optional(),
    coverColor: z.string(),
    customCoverUrl: z.string().optional(),
  }),
  Editor: SpotifyCassetteEditor,
  Viewer: SpotifyCassetteViewer,
};
