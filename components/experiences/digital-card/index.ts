import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { DigitalCardEditor } from "./editor";
import { DigitalCardViewer } from "./viewer";

export const digitalCardSchema = z.object({
  configVersion: z.number(),
  recipientName: z.string(),
  senderName: z.string(),
  message: z.string(),
  accentColor: z.string(),
  backgroundStyle: z.enum(["gradient", "solid", "pattern"]),
  imageUrl: z.string().optional(),
});

export const digitalCardPlugin: ExperiencePlugin = {
  type: "digital_card",
  meta: {
    type: "digital_card",
    name: "Digital Card",
    description: "Beautiful animated cards for any occasion",
    icon: "💌",
    available: true,
    sortOrder: 1,
  },
  defaultConfig: {
    configVersion: 1,
    recipientName: "",
    senderName: "",
    message: "",
    accentColor: "#e11d48",
    backgroundStyle: "gradient",
  },
  configSchema: digitalCardSchema,
  Editor: DigitalCardEditor,
  Viewer: DigitalCardViewer,
};
