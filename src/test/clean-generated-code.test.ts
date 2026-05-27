import { describe, it, expect } from "vitest";
import { cleanGeneratedCode } from "@/lib/clean-generated-code";

describe("cleanGeneratedCode", () => {
  it("removes markdown fences with a language identifier", () => {
    const input = "```tsx\nconst el = <div />;\n```";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const el = <div />;");
  });

  it("removes fences with no language identifier", () => {
    const input = "```\nconst x = 1;\n```";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const x = 1;");
  });

  it("handles fences with trailing whitespace", () => {
    const input = "```tsx  \nconst el = <div />;\n```";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const el = <div />;");
  });

  it("trims leading and trailing whitespace", () => {
    const input = "  \nconst x = 1;\n  ";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const x = 1;");
  });

  it("returns the string unchanged when there are no fences", () => {
    const input = "const x = 1;";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const x = 1;");
  });

  it("returns an empty string when given an empty string", () => {
    expect(cleanGeneratedCode("")).toBe("");
  });

  it("returns empty string when only fences are present", () => {
    const input = "```tsx\n```";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("");
  });

  it("strips multiple fence occurrences", () => {
    const input = "```\nconst a = 1;\n```\n\nSome text\n\n```\nconst b = 2;\n```";
    const result = cleanGeneratedCode(input);
    // The \s* in the fence regex consumes blank lines adjacent to fences
    expect(result).toBe("const a = 1;\nSome text\n\nconst b = 2;");
  });

  it("handles fences with language identifiers of various lengths", () => {
    const input = "```typescript\nconst x: number = 1;\n```";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const x: number = 1;");
  });

  it("removes fences with a leading newline only", () => {
    const input = "```\nconst x = 1;\n```\n";
    const result = cleanGeneratedCode(input);
    expect(result).toBe("const x = 1;");
  });
});