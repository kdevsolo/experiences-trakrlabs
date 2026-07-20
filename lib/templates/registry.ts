import type { ExperiencePlugin, ExperienceType } from "@/types/experience";
import { digitalCardPlugin } from "@/components/experiences/digital-card";
import { spotifyCassettePlugin } from "@/components/experiences/spotify-cassette";
import { apologyLetterPlugin } from "@/components/experiences/apology-letter";
import { loveLetterPlugin } from "@/components/experiences/love-letter";
import { birthdayPagePlugin } from "@/components/experiences/birthday-page";
import { memoryTimelinePlugin } from "@/components/experiences/memory-timeline";
import { countdownPlugin } from "@/components/experiences/countdown";
import { invitationPlugin } from "@/components/experiences/invitation";
import { giftRevealPlugin } from "@/components/experiences/gift-reveal";
import { confessionPlugin } from "@/components/experiences/confession";

export const experienceRegistry: ExperiencePlugin[] = [
  digitalCardPlugin,
  spotifyCassettePlugin,
  apologyLetterPlugin,
  loveLetterPlugin,
  birthdayPagePlugin,
  memoryTimelinePlugin,
  countdownPlugin,
  invitationPlugin,
  giftRevealPlugin,
  confessionPlugin,
];

export function getExperiencePlugin(type: string): ExperiencePlugin | undefined {
  return experienceRegistry.find((plugin) => plugin.type === type);
}

export function getExperiencePluginOrThrow(type: string): ExperiencePlugin {
  const plugin = getExperiencePlugin(type);
  if (!plugin) throw new Error(`Unknown experience type: ${type}`);
  return plugin;
}

export function listExperienceOfferings() {
  return [...experienceRegistry]
    .sort((a, b) => a.meta.sortOrder - b.meta.sortOrder)
    .map((plugin) => plugin.meta);
}

export function isExperienceType(value: string): value is ExperienceType {
  return experienceRegistry.some((plugin) => plugin.type === value);
}

export function typeToSlug(type: ExperienceType): string {
  return type.replace(/_/g, "-");
}

export function slugToType(slug: string): ExperienceType | null {
  const type = slug.replace(/-/g, "_");
  return isExperienceType(type) ? type : null;
}
