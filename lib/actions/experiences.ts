"use server";

import { revalidatePath } from "next/cache";
import { customAlphabet } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { getClientIp } from "@/lib/ip";
import { getExperiencePluginOrThrow } from "@/lib/templates/registry";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export async function publishExperience(input: {
  draftId?: string;
  experienceType: string;
  title: string;
  config: Record<string, unknown>;
  experienceId?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" as const };
  }

  const plugin = getExperiencePluginOrThrow(input.experienceType);
  const parsed = plugin.configSchema.safeParse(input.config);
  if (!parsed.success) {
    return { error: "Invalid configuration" as const };
  }

  const creatorIp = await getClientIp();
  const slug = nanoid();

  if (input.experienceId) {
    const { data, error } = await supabase
      .from("experiences")
      .update({
        title: input.title,
        config: parsed.data as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.experienceId)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) return { error: error.message };
    revalidatePath("/dashboard/experiences");
    revalidatePath("/library");
    return { data };
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert({
      user_id: user.id,
      experience_type: input.experienceType,
      title: input.title,
      slug,
      config: parsed.data as Record<string, unknown>,
      status: "published",
      creator_ip: creatorIp,
      share_unlocked: false,
      published_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) return { error: error.message };

  if (input.draftId) {
    await supabase.from("drafts").delete().eq("id", input.draftId).eq("user_id", user.id);
  }

  revalidatePath("/dashboard/experiences");
  revalidatePath("/dashboard/drafts");
  revalidatePath("/library");
  return { data };
}

export async function getExperienceBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) return { error: error.message };
  return { data };
}

export async function listExperiences() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function getExperience(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return { error: error.message };
  return { data };
}
