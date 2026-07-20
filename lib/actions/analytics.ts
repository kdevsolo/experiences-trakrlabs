"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { AnalyticsEventType } from "@/types/database";

export async function trackAnalyticsEvent(
  experienceId: string,
  eventType: AnalyticsEventType,
  metadata?: Record<string, unknown>
) {
  const service = await createServiceClient();
  await service.from("analytics").insert({
    experience_id: experienceId,
    event_type: eventType,
    metadata: metadata ?? {},
  });
}

export async function getExperienceAnalytics(experienceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const { data: experience } = await supabase
    .from("experiences")
    .select("id")
    .eq("id", experienceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!experience) return { error: "Experience not found" };

  const { data, error } = await supabase
    .from("analytics")
    .select("*")
    .eq("experience_id", experienceId)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };

  const counts = (data ?? []).reduce<Record<string, number>>((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] ?? 0) + 1;
    return acc;
  }, {});

  return { data: { events: data ?? [], counts } };
}

export async function getDashboardAnalytics() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: { totalViews: 0, experiences: [] } };

  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, title, slug, share_slug, share_unlocked")
    .eq("user_id", user.id);

  if (!experiences?.length) return { data: { totalViews: 0, experiences: [] } };

  const ids = experiences.map((e) => e.id);
  const { data: events } = await supabase
    .from("analytics")
    .select("experience_id, event_type")
    .in("experience_id", ids);

  const viewCounts = (events ?? []).reduce<Record<string, number>>((acc, event) => {
    if (event.event_type === "view") {
      acc[event.experience_id] = (acc[event.experience_id] ?? 0) + 1;
    }
    return acc;
  }, {});

  const enriched = experiences.map((exp) => ({
    ...exp,
    views: viewCounts[exp.id] ?? 0,
  }));

  const totalViews = enriched.reduce((sum, exp) => sum + exp.views, 0);
  return { data: { totalViews, experiences: enriched } };
}
