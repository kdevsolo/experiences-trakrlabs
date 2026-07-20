import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { ConfessionEditor } from "./editor";
import { ConfessionViewer } from "./viewer";

export const confessionPlugin: ExperiencePlugin = {
  type: "confession",
  meta: { type: "confession", name: "Confession Page", description: "Share what is on your heart", icon: "🤫", available: true, sortOrder: 10 },
  defaultConfig: { configVersion: 1, message: "", accentColor: "#64748b", anonymous: false },
  configSchema: z.object({ configVersion: z.number(), message: z.string(), accentColor: z.string(), anonymous: z.boolean() }),
  Editor: ConfessionEditor,
  Viewer: ConfessionViewer,
};
