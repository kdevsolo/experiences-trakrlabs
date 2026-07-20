"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getDodoClient, SHARE_UNLOCK_AMOUNT_INR } from "@/lib/payments/dodo";
import { generateShareSlug, getPublicExperienceUrl } from "@/lib/sharing/share-slug";

function getShareUnlockProductId() {
  return process.env.DODO_SHARE_UNLOCK_PRODUCT_ID ?? process.env.DODO_PRO_PRODUCT_ID;
}

async function issuePublicShareLink(
  service: Awaited<ReturnType<typeof createServiceClient>>,
  experienceId: string,
  existingShareSlug?: string | null
) {
  const shareSlug = existingShareSlug ?? generateShareSlug();

  await service
    .from("experiences")
    .update({
      share_unlocked: true,
      share_slug: shareSlug,
    })
    .eq("id", experienceId);

  return shareSlug;
}

export async function createShareUnlockCheckout(experienceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" as const };
  }

  const { data: experience, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", experienceId)
    .eq("user_id", user.id)
    .single();

  if (error || !experience) {
    return { error: "Experience not found" as const };
  }

  if (experience.share_unlocked && experience.share_slug) {
    return {
      data: {
        alreadyUnlocked: true,
        url: getPublicExperienceUrl(experience.share_slug),
        shareSlug: experience.share_slug,
      },
    };
  }

  const dodo = getDodoClient();
  const productId = getShareUnlockProductId();
  const devAutoUnlock =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_AUTO_UNLOCK_SHARE === "true";

  if ((!dodo || !productId) && devAutoUnlock) {
    const service = await createServiceClient();
    await service.from("payments").insert({
      user_id: user.id,
      experience_id: experienceId,
      amount_inr: SHARE_UNLOCK_AMOUNT_INR,
      status: "pending",
    });

    const shareSlug = await issuePublicShareLink(service, experienceId, experience.share_slug);

    await service
      .from("payments")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("experience_id", experienceId)
      .eq("user_id", user.id);

    revalidatePath("/dashboard/experiences");
    revalidatePath("/library");
    return {
      data: {
        alreadyUnlocked: true,
        devMode: true,
        url: getPublicExperienceUrl(shareSlug),
        shareSlug,
      },
    };
  }

  if (!dodo || !productId) {
    return { error: "Share unlock payments are not configured yet." as const };
  }

  const service = await createServiceClient();
  const { data: payment, error: paymentError } = await service
    .from("payments")
    .insert({
      user_id: user.id,
      experience_id: experienceId,
      amount_inr: SHARE_UNLOCK_AMOUNT_INR,
      status: "pending",
    })
    .select("*")
    .single();

  if (paymentError) {
    return { error: paymentError.message };
  }

  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      billing_currency: "INR",
      customer: {
        email: user.email ?? "creator@example.com",
        name: user.user_metadata?.full_name ?? user.user_metadata?.name,
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?payment=success&experience=${experienceId}`,
      metadata: {
        payment_id: payment.id,
        experience_id: experienceId,
        user_id: user.id,
      },
    });

    return {
      data: {
        checkoutUrl: session.checkout_url,
        sessionId: session.session_id,
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Payment failed" };
  }
}

export async function completeShareUnlock(paymentId: string, providerPaymentId?: string) {
  const service = await createServiceClient();

  const { data: payment } = await service
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .maybeSingle();

  if (!payment || payment.status === "completed") {
    return { success: true };
  }

  const { data: experience } = await service
    .from("experiences")
    .select("share_slug")
    .eq("id", payment.experience_id)
    .maybeSingle();

  await service
    .from("payments")
    .update({
      status: "completed",
      provider_payment_id: providerPaymentId ?? payment.provider_payment_id,
      completed_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  await issuePublicShareLink(service, payment.experience_id, experience?.share_slug);

  revalidatePath("/dashboard/experiences");
  revalidatePath("/library");
  return { success: true };
}
