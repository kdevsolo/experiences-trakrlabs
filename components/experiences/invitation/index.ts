import { z } from "zod";
import type { ExperiencePlugin } from "@/types/experience";
import { InvitationEditor } from "./editor";
import { InvitationViewer } from "./viewer";

export const invitationPlugin: ExperiencePlugin = {
  type: "invitation",
  meta: { type: "invitation", name: "Invitation", description: "Elegant event invitations with RSVP", icon: "🎟️", available: true, sortOrder: 8 },
  defaultConfig: { configVersion: 1, eventName: "", date: "", location: "", message: "", accentColor: "#10b981" },
  configSchema: z.object({ configVersion: z.number(), eventName: z.string(), date: z.string(), location: z.string(), message: z.string(), accentColor: z.string() }),
  Editor: InvitationEditor,
  Viewer: InvitationViewer,
};
