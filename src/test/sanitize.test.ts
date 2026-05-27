import { sanitizePrompt } from "@/lib/sanitize";
import { describe, expect, it } from "vitest";

describe("sanitizePrompt", () => {
  it("returns trimmed prompt when given a valid string", () => {
    const result = sanitizePrompt("  hello world  ");
    expect(result).toBe("hello world");
  });

  it("throws an error when given an empty string", () => {
    expect(() => sanitizePrompt("")).toThrow("Prompt must be a non-empty string");
  });

  it("throws an error when given only whitespace", () => {
    expect(() => sanitizePrompt("   ")).toThrow("Prompt must be a non-empty string");
  });

  it("throws an error when given a non-string value", () => {
    expect(() => sanitizePrompt(null)).toThrow("Prompt must be a non-empty string");
    expect(() => sanitizePrompt(undefined)).toThrow("Prompt must be a non-empty string");
    expect(() => sanitizePrompt(123)).toThrow("Prompt must be a non-empty string");
  });

  it("truncates prompt to 4000 characters", () => {
    const longPrompt = "a".repeat(5000);
    const result = sanitizePrompt(longPrompt);
    expect(result.length).toBe(4000);
  });
});
