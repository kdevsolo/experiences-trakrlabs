import { Suspense } from "react";
import { redirect } from "next/navigation";
import { listDrafts } from "@/lib/actions/drafts";
import { listExperiences } from "@/lib/actions/experiences";
import { finalizeShareUnlockOnReturn } from "@/lib/actions/payments";
import { LibraryClient, LibrarySkeleton } from "@/components/library/library-client";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { typeToSlug } from "@/lib/templates/registry";
import type { ExperienceType } from "@/types/experience";

async function resolvePaymentIdForReturn(input: {
  pid?: string;
  experienceId?: string;
  userId: string;
}) {
  if (input.pid) return input.pid;
  if (!input.experienceId) return null;

  const service = await createServiceClient();
  const { data: payment } = await service
    .from("payments")
    .select("id")
    .eq("user_id", input.userId)
    .eq("experience_id", input.experienceId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return payment?.id ?? null;
}

async function LibraryContent({
  payment,
  experienceId,
  pid,
  providerPaymentId,
  status,
}: {
  payment?: string;
  experienceId?: string;
  pid?: string;
  providerPaymentId?: string;
  status?: string;
}) {
  const returningFromCheckout = payment === "success" || status === "succeeded";

  // Legacy checkout return_url landed on /library — fulfill + send back to the experience.
  if (returningFromCheckout) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const paymentId = await resolvePaymentIdForReturn({
        pid,
        experienceId,
        userId: user.id,
      });

      if (paymentId && providerPaymentId) {
        await finalizeShareUnlockOnReturn({
          paymentId,
          providerPaymentId,
          status,
        });
      }

      const targetExperienceId = experienceId;
      if (targetExperienceId) {
        const { data: experience } = await supabase
          .from("experiences")
          .select("id, experience_type")
          .eq("id", targetExperienceId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (experience) {
          const typeSlug = typeToSlug(experience.experience_type as ExperienceType);
          redirect(`/create/${typeSlug}/${experience.id}?published=1&unlocked=1`);
        }
      }
    }
  }

  const [draftsResult, experiencesResult] = await Promise.all([
    listDrafts(),
    listExperiences(),
  ]);

  return (
    <LibraryClient
      drafts={draftsResult.data ?? []}
      experiences={experiencesResult.data ?? []}
    />
  );
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment?: string;
    experience?: string;
    pid?: string;
    payment_id?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryContent
        payment={params.payment}
        experienceId={params.experience}
        pid={params.pid}
        providerPaymentId={params.payment_id}
        status={params.status}
      />
    </Suspense>
  );
}
