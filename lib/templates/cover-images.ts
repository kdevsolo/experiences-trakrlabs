import type { ExperienceType } from "@/types/experience";

/** Curated Unsplash covers — w/h params for consistent tile crops */
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=750&q=80`;

export const experienceCoverImages: Record<ExperienceType, string> = {
  digital_card: UNSPLASH("photo-1513885535751-8b9238bd345a"),
  spotify_cassette: UNSPLASH("photo-1619983081563-430f63602796"),
  apology_letter: UNSPLASH("photo-1586953208448-b95a79798f07"),
  love_letter: UNSPLASH("photo-1518199266791-5375a83190b7"),
  birthday_page: UNSPLASH("photo-1606983340126-99ab4feaa64a"),
  memory_timeline: UNSPLASH("photo-1456513080510-7bf3a84b82f8"),
  countdown: UNSPLASH("photo-1506784365847-bbad939e9335"),
  invitation: UNSPLASH("photo-1519741497674-611481863552"),
  gift_reveal: UNSPLASH("photo-1512389142860-9c449e58a543"),
  confession: UNSPLASH("photo-1481627834876-b7833e8f5570"),
};

export function getExperienceCoverImage(type: string): string {
  if (type in experienceCoverImages) {
    return experienceCoverImages[type as ExperienceType];
  }
  return UNSPLASH("photo-1492684223066-81342ee5ff30");
}
