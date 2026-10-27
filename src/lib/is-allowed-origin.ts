/**
 * Accepts requests with no Origin header (same-origin GET, server tools) and
 * requests whose Origin host matches the Host header. Rejects other sites and
 * the opaque "null" origin that the sandboxed preview iframe sends.
 */
export function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  if (origin === null) {
    return true;
  }

  try {
    return host !== null && new URL(origin).host === host;
  } catch {
    return false;
  }
}
