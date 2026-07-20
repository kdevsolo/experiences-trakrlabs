export const SPOTIFY_CALLBACK_PATH = "/api/spotify/callback";

function isLocalHost(host: string): boolean {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export function normalizeAppUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/** Canonical app origin. Prefers NEXT_PUBLIC_APP_URL when set. */
export function getAppUrl(request?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return normalizeAppUrl(fromEnv);

  if (request) {
    const url = new URL(request.url);
    const host =
      request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
      request.headers.get("host") ??
      url.host;
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProto ?? (isLocalHost(host) ? "http" : "https");
    return `${protocol}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3002";
}

/** Absolute path on the app origin, e.g. appPath("/profile", request). */
export function appPath(path: string, request?: Request): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getAppUrl(request)}/`).href;
}

/** Must match Spotify Developer Dashboard redirect URI exactly. */
export function getSpotifyRedirectUri(request?: Request): string {
  return new URL(SPOTIFY_CALLBACK_PATH, `${getAppUrl(request)}/`).href;
}
