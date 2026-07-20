import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { LoveLetterEditor } from "./editor";
import { LoveLetterViewer } from "./viewer";

export const loveLetterPlugin: ExperiencePlugin = {
  type: "love_letter",
  meta: { type: "love_letter", name: "Love Letter", description: "Romantic letter with photo gallery", icon: "❤️", available: true, sortOrder: 4 },
  defaultConfig: { configVersion: 1, recipientName: "", senderName: "", message: "", accentColor: "#e11d48", photoUrls: [] },
  configSchema: z.object({ configVersion: z.number(), recipientName: z.string(), senderName: z.string(), message: z.string(), accentColor: z.string(), photoUrls: z.array(z.string()) }),
  Editor: LoveLetterEditor,
  Viewer: LoveLetterViewer,
};
