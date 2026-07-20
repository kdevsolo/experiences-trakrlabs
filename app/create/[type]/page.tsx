import { notFound } from "next/navigation";
import { ExperienceBuilder } from "@/components/builder/experience-builder";
import { slugToType } from "@/lib/templates/registry";
import { createClient } from "@/lib/supabase/server";

export default async function CreateExperiencePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: typeSlug } = await params;
  const experienceType = slugToType(typeSlug);
  if (!experienceType) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ExperienceBuilder experienceType={experienceType} user={user} />
  );
}
