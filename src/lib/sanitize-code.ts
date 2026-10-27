const MAX_CODE_LENGTH = 30_000;

/**
 * Validates the optional code that a refine request sends with the prompt.
 * Returns undefined when no usable code is present.
 */
export function sanitizeCode(code: unknown): string | undefined {
  if (typeof code !== "string" || code.trim().length === 0) {
    return undefined;
  }

  return code.trim().slice(0, MAX_CODE_LENGTH);
}
