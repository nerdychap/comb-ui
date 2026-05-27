---
description: "Use when writing React components, hooks, utilities, API routes, or tests under src/. Enforces CombUI project conventions: default exports, fetch over axios, named JSX handlers, Tailwind with inline styles allowed, class ErrorBoundary, kebab-case files, PascalCase components, camelCase hooks."
applyTo: "src/**"
---

# CombUI Project Conventions

These are **hard rules** for all code under `src/`.

## File & Naming Conventions

- **Files:** kebab-case (e.g., `live-preview-wrapper.tsx`, `use-stream.ts`, `stream-parser.ts`)
- **React components:** PascalCase (`GeneratorView`, `PromptInput`)
- **Hooks:** camelCase with `use` prefix (`useStream`, `useClipboard`, `useTheme`)
- **Utilities/functions:** camelCase (`streamParser`, `cleanGeneratedCode`, `sanitizePrompt`)

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

- **TanStack Query** for server state (streaming responses, prompt history, saved generations).
- **React useState** for local UI state (prompt input, UI flags, copy status).

## Error Handling

- Minimal error handling: `try/catch` in API routes and hooks; display generic error messages to the user.
- Use `console.error` for logging failures.
- Wrap react-live rendered components in an `ErrorBoundary`.

## Testing

- **Vitest** as the test runner.
- Unit tests for critical logic: stream parser, custom hooks, utilities.
- No component or E2E tests.
- Use `@testing-library/react` for hook tests with `renderHook`.

## Anti-patterns — Avoid

- ❌ Anonymous arrow functions in JSX
- ❌ `axios` (use `fetch`)
- ❌ Class components (except `ErrorBoundary`)
- ❌ `var` or unnecessary `let`
- ❌ Inline `type` definitions in component props — separate named type required
- ❌ Separate CSS files beyond `globals.css`