import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { ApologyLetterEditor } from "./editor";
import { ApologyLetterViewer } from "./viewer";

export const apologyLetterPlugin: ExperiencePlugin = {
  type: "apology_letter",
  meta: {
    type: "apology_letter",
    name: "Apology Letter",
    description: "Interactive letter with envelope reveal",
    icon: "🙏",
    available: true,
    sortOrder: 3,
  },
  defaultConfig: {
    configVersion: 1,
    recipientName: "",
    senderName: "",
    greeting: "Dear",
    body: "",
    closing: "With love",
    signature: "",
    accentColor: "#6366f1",
  },
  configSchema: z.object({
    configVersion: z.number(),
    recipientName: z.string(),
    senderName: z.string(),
    greeting: z.string(),
    body: z.string(),
    closing: z.string(),
    signature: z.string(),
    accentColor: z.string(),
  }),
  Editor: ApologyLetterEditor,
  Viewer: ApologyLetterViewer,
};
