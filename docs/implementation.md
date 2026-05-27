# 1. Project Goal & Exact Outcome

- **Core flow:** User enters a text prompt → the app streams the generated React+Tailwind code and displays it in real time → once streaming finishes, the component renders live via react-live in a side-by-side panel.
- **User actions:** Copy the generated code, or edit the prompt to refine the result.
- **Streaming visibility:** Code appears as tokens arrive; rendering happens only after the full stream completes.

# 2. Architecture Style

- **Single Next.js App Router application. No separate backend.**
- **The existing workspace is a bare‑bones Next.js app; build on top of it.**

# 3. Folder Structure & Code Organization

- **Flat‑by‑type structure:**
  - `src/components/` – React components (e.g., PromptInput, LivePreviewWrapper)
  - `src/app/api/generate/route.ts` – streaming endpoint
  - `src/lib/` – utilities, parsers, rate limiter
  - `src/hooks/` – custom hooks (useStream, useClipboard)
- **Do not follow the existing project conventions; use this flat structure.**

# 4. Naming Conventions

- **Files:** kebab‑case (live-preview.tsx, use-stream.ts, stream-code-display.ts)
- **Components:** PascalCase (LivePreview, PromptInput)
- **Hooks:** camelCase with use prefix (useStream)
- **Utilities/functions:** camelCase (streamComponent, parseChunks)
- **No default exports – use named exports everywhere.**
- **Props types:** Declare as a separate named type (e.g., LivePreviewProps), referenced in the component signature; no inline object types.

# 5. Coding Practices & Anti‑Patterns

- **Functional components only. No classes.**
- **Prefer const over let; no var.**
- **Handler functions must be named and passed as variables (no anonymous arrow functions in JSX).**
- **Avoid useEffect unless strictly necessary. Favor event‑driven patterns or derived state.**
- **Use axios for all HTTP requests (no fetch).**
- **Do not introduce new architectural patterns without approval.**
- **Do not modify files outside the feature scope without approval.**

# 6. State Management & Data Flow

- **TanStack Query for server state: streaming responses, future prompt history, and saved generations.**
- **React useState for local UI state (prompt input, UI flags, copy status).**
- **Custom hooks encapsulate data fetching and side effects.**

# 7. UI, Styling & Component Conventions

- **Pure Tailwind CSS via className strings. No separate CSS files beyond globals.css.**
- **Desktop layout:** code output (left) and live render (right) in a side‑by‑side pane.
- **Mobile layout:** agent may propose a stacked or tabbed layout (since side‑by‑side is too cramped).
- **react-live handles both:**
  - Code display (syntax‑highlighted editor/read‑only view)
  - Live component rendering (LiveProvider, LivePreview)
- **Do not build custom code‑view or live‑preview components.**
- **Semantic HTML for inputs, buttons, and controls.**

# 8. Testing

- **Vitest as the test runner.**
- **Unit tests only for critical logic: the streaming parser and custom hooks (useStream, etc.).**
- **No component or E2E tests at this stage.**

# 9. Error Handling, Logging, Validation & Rate Limiting

- **Minimal error handling:** try/catch in the API route and the hook; display a generic error message to the user.
- **Console.error for logging failures.**
- **No Zod or structured validation of prompts beyond a non‑empty check (simple if guard).**
- **Rate limiting on the /api/generate endpoint to prevent token abuse – agent may add a lightweight library (e.g., an in‑memory sliding window limiter) or implement a simple custom solution. (Open question: in‑memory vs. external store remains to be decided.)**

# 10. Dependencies & Constraints

- **Approved dependencies:** axios, react-live, @tanstack/react-query, a rate‑limiting utility, and any small well‑known packages needed to implement the feature.
- **No major framework additions (no new state management, no new CSS framework, no new build tool) without approval.**
- **LLM provider:** OpenRouter API, key stored in OPENROUTER_API_KEY environment variable.

# 11. Repository Rules & Tooling

- **Respect the existing ESLint config. Do not overwrite or disable it.**
- **Add Pretter for code formatting (if not already present). Match its config with the existing ESLint rules.**
- **No other existing conventions to follow.**

# 12. Security, Accessibility & Performance

- **Baseline sensible defaults:**
  - Error boundary around the react‑live rendered component.
  - Semantic HTML.
  - Modern evergreen browsers only (Chrome, Firefox, Safari).
  - No legacy browser support required.
- **react‑live already scopes the rendered component; no additional iframe or CSP sandboxing.**
- **Prompt sanitization:** escape the prompt before displaying it in the UI (basic XSS prevention).

# 13. Documentation & Comments

- **Self‑documenting code with clear names.**
- **No JSDoc comments on functions.**
- **Add a section to README.md describing the streaming component feature, architecture, and how to run it.**

# 14. Implementation Boundaries

- **Agent may independently decide:**
  - Hook implementations, stream parsing logic, component composition, error boundary structure, and Tailwind class design.
  - Internal file organization within the agreed src/ folders.
- **Agent must pause and ask before:**
  - Adding any new dependency not explicitly listed above.
  - Changing files outside the feature scope (e.g., next.config.js, tailwind.config.ts, package.json scripts, global layouts).
  - Introducing new architectural patterns or abstractions.
  - Modifying the existing ESLint config (except to add Prettier).