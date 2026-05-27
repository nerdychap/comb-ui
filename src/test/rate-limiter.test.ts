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

  it("allows the 20th request and blocks the 21st", () => {
    for (let i = 0; i < 20; i++) {
      const allowed = rateLimiter("edge-user");
      if (i < 19) {
        expect(allowed).toBe(true);
      } else {
        // 20th request (index 19) — still allowed (0-indexed: entries 0-19 = 20 total)
        expect(allowed).toBe(true);
      }
    }

    expect(rateLimiter("edge-user")).toBe(false);
  });

  it("handles requests with empty string identifier", () => {
    for (let i = 0; i < 20; i++) {
      expect(rateLimiter("")).toBe(true);
    }

    expect(rateLimiter("")).toBe(false);
  });

  it("handles requests with special character identifiers", () => {
    expect(rateLimiter("user@123!")).toBe(true);
  });

  it("handles very long identifier strings", () => {
    const longId = "a".repeat(1000);
    expect(rateLimiter(longId)).toBe(true);
  });
});