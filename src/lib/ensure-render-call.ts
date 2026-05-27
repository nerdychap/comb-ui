/**
 * Prepares code for react-live's noInline mode.
 * - Strips import, export, and require statements (not available in sandbox)
 * - Ensures the code ends with a `render(<ComponentName />)` call
 */
export function ensureRenderCall(code: string): string {
  // Strip `import ... from ...` and `export ...` statements
  const cleaned = code
    .replace(/^import\s+.*?(?:from\s+["'].*?["']\s*)?;?\s*$/gm, "")
    .replace(/^export\s+(default\s+)?/gm, "")
    .replace(/require\s*\(.*?\)\s*;?\s*/g, "")
    .replace(/^const\s+\w+\s*=\s*require\s*\(.*?\)\s*;?\s*$/gm, "");

  if (/render\s*\(/.test(cleaned)) {
    return cleaned;
  }

  // Match: `function ComponentName(...)` or `const ComponentName = ...`
  const fnMatch = cleaned.match(/(?:export\s+)?(?:function|const)\s+(\w+)\s*(?:[=:]|$)/);
  if (fnMatch) {
    const componentName = fnMatch[1];

    // Skip common non-component names
    if (!/^[A-Z]/.test(componentName)) {
      return cleaned;
    }

    return `${cleaned}\n\nrender(<${componentName} />)`;
  }

  return cleaned;
}
