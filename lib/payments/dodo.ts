import DodoPayments from "dodopayments";

let client: DodoPayments | null = null;

export function getDodoClient() {
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    return null;
  }
  if (!client) {
    client = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY,
      environment: process.env.DODO_PAYMENTS_ENV === "live_mode" ? "live_mode" : "test_mode",
    });
  }
  return client;
}

export const SHARE_UNLOCK_AMOUNT_INR = 1000;
