import { NextResponse } from "next/server";
import { completeShareUnlock } from "@/lib/actions/payments";

export async function POST(request: Request) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
  const rawBody = await request.text();

  let payload: {
    type?: string;
    data?: {
      metadata?: { payment_id?: string };
      payment_id?: string;
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const signature = request.headers.get("dodo-signature") ?? request.headers.get("x-dodo-signature");
  if (secret && signature !== secret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const paymentId = payload.data?.metadata?.payment_id;
  const providerPaymentId = payload.data?.payment_id;

  if (
    paymentId &&
    (payload.type === "payment.succeeded" ||
      payload.type === "checkout.session.completed" ||
      payload.type === "payment.completed")
  ) {
    await completeShareUnlock(paymentId, providerPaymentId);
  }

  return NextResponse.json({ received: true });
}
