import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { BirthdayPageEditor } from "./editor";
import { BirthdayPageViewer } from "./viewer";

export const birthdayPagePlugin: ExperiencePlugin = {
  type: "birthday_page",
  meta: { type: "birthday_page", name: "Birthday Page", description: "Celebrate with confetti and age counter", icon: "🎂", available: true, sortOrder: 5 },
  defaultConfig: { configVersion: 1, name: "", age: 0, message: "", accentColor: "#f59e0b" },
  configSchema: z.object({ configVersion: z.number(), name: z.string(), age: z.number(), message: z.string(), accentColor: z.string() }),
  Editor: BirthdayPageEditor,
  Viewer: BirthdayPageViewer,
};
