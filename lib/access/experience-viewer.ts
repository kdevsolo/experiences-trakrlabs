import { createServiceClient } from "@/lib/supabase/server";
import type { Experience } from "@/types/database";

export type ExperienceViewerResult =
  | { status: "not_found" }
  | { status: "ok"; experience: Experience };

/** Public viewer access: only paid app-issued share_slug links work. */
export async function resolveExperienceViewerAccess(
  shareSlug: string
): Promise<ExperienceViewerResult> {
  const service = await createServiceClient();

  const { data: experience, error } = await service
    .from("experiences")
    .select("*")
    .eq("share_slug", shareSlug)
    .eq("share_unlocked", true)
    .eq("status", "published")
    .maybeSingle();

  if (error || !experience) {
    return { status: "not_found" };
  }

  return { status: "ok", experience };
}

export async function getExperiencePublicMeta(shareSlug: string) {
  const service = await createServiceClient();
  const { data } = await service
    .from("experiences")
    .select("title, experience_type, config, share_unlocked, share_slug")
    .eq("share_slug", shareSlug)
    .eq("share_unlocked", true)
    .eq("status", "published")
    .maybeSingle();

  return data;
}
