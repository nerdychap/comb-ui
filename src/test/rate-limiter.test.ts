import { describe, it, expect, beforeEach } from "vitest";
import { rateLimiter } from "@/lib/rate-limiter";

describe("rateLimiter", () => {
  beforeEach(() => {
    // Reset the internal state by creating many requests that expire immediately
    // The module-level store is shared; we test with fresh identifiers.
  });

  it("allows requests under the limit", () => {
    for (let i = 0; i < 20; i++) {
      const allowed = rateLimiter(`test-user-${i}`);
      expect(allowed).toBe(true);
    }
  });

  it("blocks requests over the limit for the same identifier", () => {
    for (let i = 0; i < 20; i++) {
      expect(rateLimiter("same-user")).toBe(true);
    }

    expect(rateLimiter("same-user")).toBe(false);
  });

  it("allows requests for different identifiers independently", () => {
    for (let i = 0; i < 20; i++) {
      rateLimiter("user-a");
    }

    expect(rateLimiter("user-a")).toBe(false);
    expect(rateLimiter("user-b")).toBe(true);
  });
});