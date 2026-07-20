"use client";

import { getExperiencePluginOrThrow } from "@/lib/templates/registry";
import { ExperienceViewport } from "@/components/experiences/shared/experience-viewport";

export function ExperienceRenderer({
  experienceType,
  config,
  title,
  experienceId,
}: {
  experienceType: string;
  config: Record<string, unknown>;
  title: string;
  experienceId?: string;
}) {
  const plugin = getExperiencePluginOrThrow(experienceType);
  const parsed = plugin.configSchema.safeParse(config);
  const safeConfig = parsed.success ? parsed.data : plugin.defaultConfig;
  const Viewer = plugin.Viewer;

  return (
    <ExperienceViewport>
      <Viewer config={safeConfig} title={title} experienceId={experienceId} />
    </ExperienceViewport>
  );
}
