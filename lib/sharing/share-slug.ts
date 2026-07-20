import { customAlphabet } from "nanoid";

const shareSlugAlphabet = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);

export function generateShareSlug() {
  return shareSlugAlphabet();
}

export function getPublicExperienceUrl(shareSlug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base}/e/${shareSlug}`;
}
