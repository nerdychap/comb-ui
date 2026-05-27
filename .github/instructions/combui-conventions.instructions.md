---
description: "Use when writing React components, hooks, utilities, API routes, or tests under src/. Enforces CombUI project conventions: default exports, fetch over axios, named JSX handlers, Tailwind with inline styles allowed, class ErrorBoundary, kebab-case files, PascalCase components, camelCase hooks."
applyTo: "src/**"
---

# CombUI Project Conventions

These are **hard rules** for all code under `src/`.

### Naming Conventions

- **Files:** kebab-case (e.g., `live-preview-wrapper.tsx`, `use-stream.ts`, `stream-parser.ts`)
- **React components:** PascalCase (`GeneratorView`, `PromptInput`)
- **Hooks:** camelCase with `use` prefix (`useStream`, `useClipboard`, `useTheme`)
- **Utilities/functions:** camelCase (`streamParser`, `cleanGeneratedCode`, `sanitizePrompt`)

### Folder Structure

- **`src/app/`** — Next.js App Router pages and API routes
- **`src/components/`** — React components (one concern per file)
- **`src/constants/`** — Shared constant values
- **`src/context/`** — Context definitions (one file: context object + type)
- **`src/hooks/`** — Custom React hooks
- **`src/providers/`** — Context provider components
- **`src/lib/`** — Utilities, parsers, shared logic
- **`src/test/`** — Unit tests mirroring `src/` structure
- **`e2e/`** — Playwright E2E tests
- **`docs/`** — Project documentation (e.g., `implementation.md`)
- **`.github/`** — CI workflows and instruction files

## Exports

- Use **default exports** for all components and pages: `export default function Component()`
- Named exports are acceptable for utility functions and types in `src/lib/`

## Component Patterns

- **Functional components only.** The sole exception is `ErrorBoundary`, which must remain a class component (React requirement for `componentDidCatch`).
- **No classes** in any other file.
- Prefer `const` over `let`. Never use `var`.
- **Props types** must be declared as a separate named type above the component (e.g., `type PromptInputProps = { ... }`), referenced in the component signature.

## JSX Handler Functions

- **No anonymous arrow functions in JSX props.** Define named handler functions as variables or `useCallback` before the `return` statement.
- ✅ `const handleSubmit = (e) => { ... }; return <form onSubmit={handleSubmit}>`
- ❌ `return <form onSubmit={(e) => { ... }}>`
- **Cancel/reset handlers inside `<form>` elements must call `e.preventDefault()`** to prevent React re-rendering (triggered by state changes inside the handler) from causing unintended form submission. This is a known pattern — the Cancel button changes DOM state within the same event cycle, which can produce a new submit button that the original event then activates.
- ✅ `const handleCancel = (e: React.MouseEvent) => { e.preventDefault(); onCancel?.(); }`

## `"use client"` Directive

- Only add `"use client"` to **`.tsx` files** that use hooks, custom hooks, web/browser APIs, or event handlers.
- Do **not** add `"use client"` to plain `.ts` files — they are not components.

## HTTP Requests

- Use the **native `fetch` API** for all HTTP requests.
- Do **not** use `axios` or other HTTP client libraries.

## Styling

- Use **Tailwind CSS** via `className` strings for the app's own UI components.
- **Inline `style={{...}}` objects are acceptable** when needed (e.g., dynamic values, third-party component theming).
- No separate CSS files beyond `globals.css`.

## Hooks

- Custom hooks encapsulate data fetching and side effects.
- Avoid `useEffect` unless strictly necessary. Favor event-driven patterns or derived state.
- React `useState` for local UI state; TanStack Query for server state.

## State & Data Flow

- **Stream state** is shared via `StreamProvider` + `useStreamContext`. Wrap the relevant subtree at the top level so multiple components (e.g., `StreamCodeDisplay`, `GeneratorViewInner`) read from the same stream state.
- **TanStack Query** for server state (prompt history, saved generations).
- **React useState** for local UI state (prompt input, UI flags, copy status).

## Error Handling

- Minimal error handling: `try/catch` in API routes and hooks; display generic error messages to the user.
- Use `console.error` for logging failures.
- Wrap react-live rendered components in an `ErrorBoundary`.

## CI / GitHub Actions

- A **pull request workflow** (`.github/workflows/pull-request.yml`) runs on every PR to `main`.
- It executes **lint**, **test**, **Playwright E2E tests**, and **build** steps in order using Node.js 20 with `npm ci`.
- Playwright browsers (Chromium) are installed before the E2E step.
- Always verify the workflow passes locally before pushing: `npm run lint && npm test && npm run build`.

## Testing

- **Vitest** as the unit test runner.
- **Playwright** for E2E tests in `e2e/`.
- Unit tests cover critical logic: stream parser, custom hooks, utilities, components (using `@testing-library/react`).
- E2E tests cover key user flows: rendering, submit, cancel, error states.
- Use `@testing-library/react` for component and hook tests.

## Anti-patterns — Avoid

- ❌ Anonymous arrow functions in JSX
- ❌ `axios` (use `fetch`)
- ❌ Class components (except `ErrorBoundary`)
- ❌ `var` or unnecessary `let`
- ❌ Inline `type` definitions in component props — separate named type required
- ❌ Separate CSS files beyond `globals.css`