import DodoPayments from "dodopayments";
import { SHARE_UNLOCK_PRICE_INR } from "@/lib/payments/constants";

export { SHARE_UNLOCK_PRICE_INR as SHARE_UNLOCK_AMOUNT_INR };

type DodoEnvironment = "live_mode" | "test_mode";

function normalizeEnvValue(value?: string | null): string | undefined {
  return value?.trim().replace(/^["']|["']$/g, "").toLowerCase();
}

export function getDodoBearerToken(): string | undefined {
  return process.env.DODO_PAYMENTS_API_KEY?.trim() || undefined;
}

export function getDodoWebhookKey(): string | undefined {
  return (
    process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim() ||
    process.env.DODO_PAYMENTS_WEBHOOK_SECRET?.trim() ||
    undefined
  );
}

/** Resolve sandbox vs live. Must match the API key's environment. */
export function getDodoEnvironment(): DodoEnvironment {
  const configured =
    normalizeEnvValue(process.env.DODO_PAYMENTS_ENV) ??
    normalizeEnvValue(process.env.DODO_ENVIRONMENT) ??
    normalizeEnvValue(process.env.DODO_PAYMENTS_ENVIRONMENT);

  if (configured === "live_mode" || configured === "live" || configured === "production") {
    return "live_mode";
  }
  if (configured === "test_mode" || configured === "test" || configured === "sandbox") {
    return "test_mode";
  }

  const token = getDodoBearerToken() ?? "";
  if (token.startsWith("live_")) return "live_mode";
  if (token.startsWith("test_")) return "test_mode";

  return process.env.NODE_ENV === "production" ? "live_mode" : "test_mode";
}

export function getDodoClient() {
  const bearerToken = getDodoBearerToken();
  if (!bearerToken) return null;

  return new DodoPayments({
    bearerToken,
    environment: getDodoEnvironment(),
    webhookKey: getDodoWebhookKey() ?? null,
  });
}
