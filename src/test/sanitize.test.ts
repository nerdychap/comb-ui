import { describe, it, expect } from "vitest";
import { sanitizePrompt, escapeHtml } from "@/lib/sanitize";

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

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    const input = '<div class="test">&</div>';
    const result = escapeHtml(input);
    expect(result).toBe(
      "&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;"
    );
  });

  it("returns plain text unchanged", () => {
    const input = "Hello, world!";
    expect(escapeHtml(input)).toBe("Hello, world!");
  });
});