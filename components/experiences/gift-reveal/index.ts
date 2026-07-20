import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { GiftRevealEditor } from "./editor";
import { GiftRevealViewer } from "./viewer";

export const giftRevealPlugin: ExperiencePlugin = {
  type: "gift_reveal",
  meta: { type: "gift_reveal", name: "Gift Reveal", description: "Scratch to reveal a surprise gift", icon: "🎁", available: true, sortOrder: 9 },
  defaultConfig: { configVersion: 1, title: "", revealMessage: "", giftDescription: "", accentColor: "#ec4899" },
  configSchema: z.object({ configVersion: z.number(), title: z.string(), revealMessage: z.string(), giftDescription: z.string(), accentColor: z.string() }),
  Editor: GiftRevealEditor,
  Viewer: GiftRevealViewer,
};
