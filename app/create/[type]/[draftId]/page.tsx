import { notFound, redirect } from "next/navigation";
import { ExperienceBuilder } from "@/components/builder/experience-builder";
import { slugToType } from "@/lib/templates/registry";
import { createClient } from "@/lib/supabase/server";

export default async function EditDraftPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; draftId: string }>;
  searchParams: Promise<{ published?: string }>;
}) {
  const { type: typeSlug, draftId } = await params;
  const { published } = await searchParams;
  const experienceType = slugToType(typeSlug);
  if (!experienceType) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const returnPath = `/create/${typeSlug}/${draftId}${published === "1" ? "?published=1" : ""}`;

  if (!user) {
    redirect(`/?login=required&next=${encodeURIComponent(returnPath)}`);
  }

  if (published === "1") {
    const { data: experience } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", draftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!experience) notFound();

    return (
      <ExperienceBuilder
        experienceType={experienceType}
        user={user}
        initialExperience={experience}
      />
    );
  }

  const { data: draft } = await supabase
    .from("drafts")
    .select("*")
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!draft) notFound();

  return (
    <ExperienceBuilder
      experienceType={experienceType}
      user={user}
      initialDraft={draft}
    />
  );
}
