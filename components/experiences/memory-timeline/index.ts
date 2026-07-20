import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { MemoryTimelineEditor } from "./editor";
import { MemoryTimelineViewer } from "./viewer";

export const memoryTimelinePlugin: ExperiencePlugin = {
  type: "memory_timeline",
  meta: { type: "memory_timeline", name: "Memory Timeline", description: "Scroll through cherished memories", icon: "📅", available: true, sortOrder: 6 },
  defaultConfig: { configVersion: 1, title: "", memories: [], accentColor: "#8b5cf6" },
  configSchema: z.object({
    configVersion: z.number(),
    title: z.string(),
    memories: z.array(z.object({ date: z.string(), title: z.string(), description: z.string() })),
    accentColor: z.string(),
  }),
  Editor: MemoryTimelineEditor,
  Viewer: MemoryTimelineViewer,
};
