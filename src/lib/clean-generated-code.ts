/**
 * Strips markdown code fences and leading/trailing whitespace from
 * LLM-generated code.
 */
export function cleanGeneratedCode(code: string): string {
  return code
    .replace(/^```\w*\s*\n?/gm, "")
    .replace(/```\s*$/gm, "")
    .trim();
}
