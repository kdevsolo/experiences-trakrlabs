import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { CountdownEditor } from "./editor";
import { CountdownViewer } from "./viewer";

export const countdownPlugin: ExperiencePlugin = {
  type: "countdown",
  meta: {
    type: "countdown",
    name: "Countdown Page",
    description: "Build anticipation to a special date",
    icon: "⏳",
    available: true,
    sortOrder: 7,
  },
  defaultConfig: {
    configVersion: 1,
    title: "",
    message: "",
    targetDate: "",
    accentColor: "#06b6d4",
  },
  configSchema: z.object({
    configVersion: z.number(),
    title: z.string(),
    message: z.string(),
    targetDate: z.string(),
    accentColor: z.string(),
  }),
  Editor: CountdownEditor,
  Viewer: CountdownViewer,
};
