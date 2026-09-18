/**
 * GAP 5 — Simple in-memory rate limiter.
 * Resets on cold start. Sufficient for personal-link use cases.
 * For public-scale, swap with Redis/Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Returns true if the key has exceeded the allowed calls in the window.
 */
export function isRateLimited(
  key: string,
  maxPerWindow = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxPerWindow) {
    return true;
  }

  entry.count++;
  return false;
}
