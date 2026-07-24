"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { AuthenticationError } from "dodopayments";
import { getAppUrlFromHeaders } from "@/lib/app-url";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  getDodoClient,
  getDodoEnvironment,
  SHARE_UNLOCK_AMOUNT_INR,
} from "@/lib/payments/dodo";
import { generateShareSlug, getPublicExperienceUrl } from "@/lib/sharing/share-slug";
import { typeToSlug } from "@/lib/templates/registry";
import type { ExperienceType } from "@/types/experience";

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

function revalidateSharePaths(experienceId: string, experienceType?: string | null) {
  revalidatePath("/dashboard/experiences");
  revalidatePath("/library");
  if (experienceType) {
    revalidatePath(`/create/${typeToSlug(experienceType as ExperienceType)}/${experienceId}`);
  }
}

function formatDodoError(err: unknown): string {
  if (err instanceof AuthenticationError) {
    return `Dodo Payments authentication failed (401). Use a ${getDodoEnvironment() === "live_mode" ? "live" : "test"} API key and set DODO_PAYMENTS_ENV=${getDodoEnvironment()} on your server.`;
  }
  if (err instanceof Error) return err.message;
  return "Payment failed";
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

    revalidateSharePaths(experienceId, experience.experience_type);
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

  const appUrl = getAppUrlFromHeaders(await headers());
  const typeSlug = typeToSlug(experience.experience_type as ExperienceType);
  const returnUrl = new URL(`${appUrl}/create/${typeSlug}/${experienceId}`);
  returnUrl.searchParams.set("published", "1");
  returnUrl.searchParams.set("payment", "success");
  returnUrl.searchParams.set("pid", payment.id);

  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      billing_currency: "INR",
      customer: {
        email: user.email ?? "creator@example.com",
        name: user.user_metadata?.full_name ?? user.user_metadata?.name,
      },
      return_url: returnUrl.toString(),
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
    console.error("[payments] Dodo checkout failed:", err);
    return { error: formatDodoError(err) };
  }
}

export async function completeShareUnlock(paymentId: string, providerPaymentId?: string) {
  const service = await createServiceClient();

  const { data: payment } = await service
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .maybeSingle();

  if (!payment) {
    return { success: false as const, error: "Payment not found" as const };
  }

  const { data: experience } = await service
    .from("experiences")
    .select("share_slug, experience_type, share_unlocked")
    .eq("id", payment.experience_id)
    .maybeSingle();

  if (payment.status !== "completed") {
    await service
      .from("payments")
      .update({
        status: "completed",
        provider_payment_id: providerPaymentId ?? payment.provider_payment_id,
        completed_at: new Date().toISOString(),
      })
      .eq("id", paymentId);
  } else if (providerPaymentId && !payment.provider_payment_id) {
    await service
      .from("payments")
      .update({ provider_payment_id: providerPaymentId })
      .eq("id", paymentId);
  }

  const shareSlug = await issuePublicShareLink(
    service,
    payment.experience_id,
    experience?.share_slug
  );

  revalidateSharePaths(payment.experience_id, experience?.experience_type);
  return {
    success: true as const,
    shareSlug,
    url: getPublicExperienceUrl(shareSlug),
    experienceId: payment.experience_id,
  };
}

/**
 * Fulfill share unlock on checkout return. Verifies the charge with Dodo so unlock
 * still works when the webhook never reaches the app (local/dev, misconfigured secret).
 */
export async function finalizeShareUnlockOnReturn(input: {
  paymentId: string;
  providerPaymentId?: string | null;
  status?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" as const };
  }

  const service = await createServiceClient();
  const { data: payment } = await service
    .from("payments")
    .select("*")
    .eq("id", input.paymentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!payment) {
    return { error: "Payment not found" as const };
  }

  const { data: experience } = await service
    .from("experiences")
    .select("*")
    .eq("id", payment.experience_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!experience) {
    return { error: "Experience not found" as const };
  }

  if (experience.share_unlocked && experience.share_slug) {
    return {
      data: {
        alreadyUnlocked: true,
        experience,
        shareSlug: experience.share_slug,
        url: getPublicExperienceUrl(experience.share_slug),
      },
    };
  }

  const providerPaymentId = input.providerPaymentId?.trim() || null;
  if (!providerPaymentId) {
    return { error: "Missing payment reference. Please refresh or contact support." as const };
  }

  const dodo = getDodoClient();
  if (!dodo) {
    return { error: "Payment verification is not configured." as const };
  }

  try {
    const dodoPayment = await dodo.payments.retrieve(providerPaymentId);
    if (dodoPayment.status !== "succeeded") {
      return { error: "Payment not completed yet. Please wait a moment and refresh." as const };
    }
    const metaPaymentId = dodoPayment.metadata?.payment_id;
    if (typeof metaPaymentId === "string" && metaPaymentId && metaPaymentId !== payment.id) {
      return { error: "Payment mismatch" as const };
    }
  } catch (err) {
    console.error("[payments] Failed to verify Dodo payment on return:", err);
    return { error: "Could not verify payment. Please refresh in a moment." as const };
  }

  const result = await completeShareUnlock(payment.id, providerPaymentId ?? undefined);
  if (!result.success) {
    return { error: result.error ?? "Failed to unlock sharing" };
  }

  const { data: unlocked } = await service
    .from("experiences")
    .select("*")
    .eq("id", payment.experience_id)
    .single();

  return {
    data: {
      alreadyUnlocked: false,
      experience: unlocked ?? { ...experience, share_unlocked: true, share_slug: result.shareSlug },
      shareSlug: result.shareSlug,
      url: result.url,
    },
  };
}
