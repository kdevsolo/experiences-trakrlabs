import { NextResponse } from "next/server";
import { completeShareUnlock } from "@/lib/actions/payments";
import { getDodoBearerToken, getDodoClient, getDodoEnvironment, getDodoWebhookKey } from "@/lib/payments/dodo";
import DodoPayments from "dodopayments";

type DodoWebhookPayload = {
  type?: string;
  data?: {
    metadata?: { payment_id?: string };
    payment_id?: string;
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookKey = getDodoWebhookKey();

  let payload: DodoWebhookPayload;

  if (webhookKey) {
    try {
      const client =
        getDodoClient() ??
        new DodoPayments({
          bearerToken: getDodoBearerToken() ?? "webhook-only",
          environment: getDodoEnvironment(),
          webhookKey,
        });

      payload = client.webhooks.unwrap(rawBody, {
        headers: Object.fromEntries(request.headers.entries()),
      }) as DodoWebhookPayload;
    } catch (err) {
      console.error("[webhooks/dodo] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    try {
      payload = JSON.parse(rawBody) as DodoWebhookPayload;
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }

  const paymentId = payload.data?.metadata?.payment_id;
  const providerPaymentId = payload.data?.payment_id;

  if (paymentId && payload.type === "payment.succeeded") {
    const result = await completeShareUnlock(paymentId, providerPaymentId);
    if (!result.success) {
      console.error("[webhooks/dodo] completeShareUnlock failed:", result.error);
    }
  }

  return NextResponse.json({ received: true });
}
