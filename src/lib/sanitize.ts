export function sanitizePrompt(prompt: unknown): string {
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new Error("Prompt must be a non-empty string");
  }

  return prompt.trim().slice(0, 4000);
}
