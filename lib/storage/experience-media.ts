import { createClient } from "@/lib/supabase/client";

export const EXPERIENCE_MEDIA_BUCKET = "experience-media";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp"]);

export async function uploadExperienceImage(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sign in to upload images.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = ALLOWED_EXT.has(rawExt) ? rawExt : "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(EXPERIENCE_MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(EXPERIENCE_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
