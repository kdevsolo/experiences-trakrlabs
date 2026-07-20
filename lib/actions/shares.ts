"use server";

import { getPublicExperienceUrl } from "@/lib/sharing/share-slug";

export async function getShareUrl(shareSlug: string) {
  return getPublicExperienceUrl(shareSlug);
}
