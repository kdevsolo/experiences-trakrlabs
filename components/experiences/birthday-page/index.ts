import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { BirthdayPageEditor } from "./editor";
import { BirthdayPageViewer } from "./viewer";

const birthdaySlideSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    imageUrl: z.string(),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("text"),
    heading: z.string().optional(),
    body: z.string(),
  }),
]);

export const birthdayPagePlugin: ExperiencePlugin = {
  type: "birthday_page",
  meta: { type: "birthday_page", name: "Birthday Page", description: "Celebrate with confetti and age counter", icon: "🎂", available: true, sortOrder: 5 },
  defaultConfig: {
    configVersion: 1,
    name: "",
    age: 0,
    message: "",
    accentColor: "#f59e0b",
    slides: [],
  },
  configSchema: z.object({
    configVersion: z.number(),
    name: z.string(),
    age: z.number(),
    message: z.string(),
    accentColor: z.string(),
    slides: z.array(birthdaySlideSchema).optional(),
    spotifyTrackId: z.string().optional(),
    spotifyTrackName: z.string().optional(),
    spotifyTrackArtist: z.string().optional(),
    spotifyTrackImageUrl: z.string().optional(),
  }),
  Editor: BirthdayPageEditor,
  Viewer: BirthdayPageViewer,
};
