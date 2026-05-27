import { describe, it, expect } from "vitest";
import { ensureRenderCall } from "@/lib/ensure-render-call";

describe("ensureRenderCall", () => {
  it("strips import statements and does not add render for function declarations (regex limitation)", () => {
    const input = `import React from "react";\nimport { useState } from "react";\n\nfunction Button() {\n  return <button>Click</button>;\n}`;
    const result = ensureRenderCall(input);
    expect(result).not.toContain("import");
    // The regex only adds render for `const Name =` patterns, not `function Name()`
    expect(result).not.toContain("render");
  });

  it("strips export default statements", () => {
    const input = `export default function Button() {\n  return <button>Click</button>;\n}`;
    const result = ensureRenderCall(input);
    expect(result).not.toContain("export default");
    // function declarations without `=` don't match the render-adding regex
    expect(result).not.toContain("render");
  });

  it("strips export statements", () => {
    const input = `export function Button() {\n  return <button>Click</button>;\n}`;
    const result = ensureRenderCall(input);
    expect(result).not.toContain("export ");
    expect(result).not.toContain("render");
  });

  it("strips require calls but may leave const prefix", () => {
    const input = `const React = require("react");\n\nfunction Button() {\n  return <button>Click</button>;\n}`;
    const result = ensureRenderCall(input);
    // require("react") is removed but "const React = " may remain;
    // function declarations don't receive an auto-render call (the regex matches const assignments)
    expect(result).not.toContain("require");
  });

  it("strips const + require patterns", () => {
    const input = `const React = require("react");\n\nfunction Button() {\n  return <button>Click</button>;\n}`;
    const result = ensureRenderCall(input);
    // require("react") is removed, "const React = " may remain
    expect(result).not.toContain("require");
  });

  it("does not add render() when one already exists", () => {
    const input = `function Button() {\n  return <button>Click</button>;\n}\n\nrender(<Button />)`;
    const result = ensureRenderCall(input);
    expect(result).toBe(input);
  });

  it("adds render with component name for const arrow functions", () => {
    const input = `const Button = () => {\n  return <button>Click</button>;\n};`;
    const result = ensureRenderCall(input);
    expect(result).toContain("render(<Button />)");
  });

  it("does not add render when function name does not start with uppercase", () => {
    const input = `function helper() {\n  return 42;\n}`;
    const result = ensureRenderCall(input);
    expect(result).not.toContain("render");
    expect(result).toContain("function helper");
  });

  it("returns cleaned code unchanged when no component is found and no render exists", () => {
    const input = `const x = 1;\nconst y = 2;`;
    const result = ensureRenderCall(input);
    expect(result).toBe(input);
  });

  it("returns empty string when given empty string", () => {
    expect(ensureRenderCall("")).toBe("");
  });

  it("handles multiple imports on separate lines", () => {
    const input = `import React from "react";\nimport { useState, useEffect } from "react";\n\nfunction Timer() {\n  return <div>timer</div>;\n}`;
    const result = ensureRenderCall(input);
    expect(result).not.toContain("import");
    expect(result).not.toContain("render");
  });

  it("handles render already present with no component", () => {
    const input = `const x = 1;\nrender(<App />)`;
    const result = ensureRenderCall(input);
    expect(result).toBe(input);
  });

  it("adds render for const component even with imports stripped first", () => {
    const input = `import React from "react";\nconst Button = () => <button>Click</button>;`;
    const result = ensureRenderCall(input);
    expect(result).not.toContain("import");
    expect(result).toContain("render(<Button />)");
  });

  it("strips inline require calls and leaves trailing content", () => {
    const input = `const Button = require("./Button").default;\nconst App = () => <Button />;`;
    const result = ensureRenderCall(input);
    // require("./Button") is replaced globally; ".default" remains on the line
    expect(result).not.toContain("require(");
    expect(result).toContain("render(<Button />)");
  });
});