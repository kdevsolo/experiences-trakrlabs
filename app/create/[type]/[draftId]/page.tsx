import { notFound, redirect } from "next/navigation";
import { ExperienceBuilder } from "@/components/builder/experience-builder";
import { slugToType } from "@/lib/templates/registry";
import { createClient } from "@/lib/supabase/server";
import { finalizeShareUnlockOnReturn } from "@/lib/actions/payments";

export default async function EditDraftPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; draftId: string }>;
  searchParams: Promise<{
    published?: string;
    payment?: string;
    pid?: string;
    payment_id?: string;
    status?: string;
    unlocked?: string;
  }>;
}) {
  const { type: typeSlug, draftId } = await params;
  const {
    published,
    payment,
    pid,
    payment_id: providerPaymentId,
    status,
    unlocked,
  } = await searchParams;
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
    let { data: experience } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", draftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!experience) notFound();

    let paymentJustUnlocked = false;
    const returningFromCheckout =
      Boolean(pid) && (payment === "success" || status === "succeeded");

    if (returningFromCheckout && pid) {
      const result = await finalizeShareUnlockOnReturn({
        paymentId: pid,
        providerPaymentId,
        status,
      });

      if (result.data?.experience) {
        experience = result.data.experience;
        paymentJustUnlocked = Boolean(result.data.shareSlug);
      }
    }

    const openShare =
      paymentJustUnlocked ||
      unlocked === "1" ||
      (returningFromCheckout && Boolean(experience.share_unlocked && experience.share_slug));

    return (
      <ExperienceBuilder
        experienceType={experienceType}
        user={user}
        initialExperience={experience}
        initialShareOpen={openShare}
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
