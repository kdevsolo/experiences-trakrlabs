import { headers } from "next/headers";

export async function getClientIp(): Promise<string | null> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }
  return headerStore.get("x-real-ip") ?? null;
}

export function normalizeIp(ip: string | null): string | null {
  if (!ip) return null;
  if (ip === "::1") return "127.0.0.1";
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  return ip;
}

export function ipsMatch(a: string | null, b: string | null): boolean {
  const left = normalizeIp(a);
  const right = normalizeIp(b);
  return Boolean(left && right && left === right);
}
