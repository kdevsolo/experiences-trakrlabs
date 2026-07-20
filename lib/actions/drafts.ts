"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getExperiencePluginOrThrow } from "@/lib/templates/registry";

export async function saveDraft(input: {
  id?: string;
  experienceType: string;
  title: string;
  config: Record<string, unknown>;
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

  if (input.id) {
    const { data, error } = await supabase
      .from("drafts")
      .update({
        title: input.title,
        config: parsed.data as Record<string, unknown>,
        experience_type: input.experienceType,
      })
      .eq("id", input.id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) return { error: error.message };
    revalidatePath("/dashboard/drafts");
    revalidatePath("/library");
    return { data };
  }

  const { data, error } = await supabase
    .from("drafts")
    .insert({
      user_id: user.id,
      experience_type: input.experienceType,
      title: input.title,
      config: parsed.data as Record<string, unknown>,
    })
    .select("*")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/drafts");
  revalidatePath("/library");
  return { data };
}

export async function getDraft(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("drafts").select("*").eq("id", id).maybeSingle();
  if (error) return { error: error.message };
  return { data };
}

export async function listDrafts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [] };

  const { data, error } = await supabase
    .from("drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function deleteDraft(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const { error } = await supabase.from("drafts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/drafts");
  revalidatePath("/library");
  return { success: true };
}
