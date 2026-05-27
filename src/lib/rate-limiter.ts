type RequestEntry = {
  timestamp: number;
};

const store = new Map<string, RequestEntry[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function rateLimiter(identifier: string): boolean {
  const now = Date.now();
  const entries = store.get(identifier) ?? [];

  const activeEntries = entries.filter((entry) => now - entry.timestamp < WINDOW_MS);

  if (activeEntries.length >= MAX_REQUESTS) {
    store.set(identifier, activeEntries);
    return false;
  }

  activeEntries.push({ timestamp: now });
  store.set(identifier, activeEntries);
  return true;
}
