# CombUI - AI Component Generator

Generate React components from text prompts. Describe what you want and watch the component come to life in real time with streaming code generation and a live preview.

## Architecture

```
src/
├── app/
│   ├── api/generate/route.ts   # Streaming API endpoint (OpenRouter)
│   ├── globals.css                # Global Tailwind styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Entry page (wraps QueryClient + GeneratorView)
├── components/
│   ├── error-boundary.tsx         # Class error boundary for live preview
│   ├── generator-view.tsx         # Wraps inner view in StreamProvider
│   ├── generator-view-inner.tsx   # Main view: prompt, code & preview panes
│   ├── live-preview-wrapper.tsx   # react-live render panel
│   ├── prompt-input.tsx           # Prompt form with Cancel support
│   ├── resizable-split.tsx        # Draggable split pane for code/preview
│   ├── stream-code-display.tsx    # Real-time code display with states
│   ├── stream-empty-state.tsx     # Empty placeholder state
│   ├── stream-loading-state.tsx   # Loading indicator state
│   ├── stream-state-panel.tsx     # Streaming status overview panel
│   └── theme-toggle.tsx           # Dark/light mode toggle
├── constants/
│   └── contants.ts                # Shared constants
├── context/
│   └── stream-context.ts          # Stream context definition + type
├── hooks/
│   ├── use-clipboard.ts           # Clipboard copy hook
│   ├── use-stream.ts              # Streaming state management (fetch + AbortController)
│   ├── use-stream-context.tsx     # Stream context consumer hook
│   └── use-theme.ts               # Dark/light mode hook
├── lib/
│   ├── clean-generated-code.ts    # Post-processing of LLM output
│   ├── ensure-render-call.ts      # Ensures render() call in generated code
│   ├── rate-limiter.ts            # In-memory sliding window rate limiter
│   ├── sanitize.ts                # Prompt sanitization & HTML escaping
│   └── stream-parser.ts           # SSE stream parser (AbortSignal-aware)
├── providers/
│   └── stream-provider.tsx        # Stream context provider
└── test/
    ├── setup.ts                   # Vitest setup (@testing-library/jest-dom)
    ├── api/generate.test.ts               # API route tests
    ├── components/*.test.tsx               # Component unit tests
    ├── clean-generated-code.test.ts        # Utility tests
    ├── ensure-render-call.test.ts          # Utility tests
    ├── rate-limiter.test.ts                # Utility tests
    ├── sanitize.test.ts                    # Utility tests
    ├── stream-parser.test.ts               # Stream parser tests
    ├── use-clipboard.test.ts               # Hook tests
    ├── use-stream.test.tsx                 # Hook tests
    ├── use-stream-context.test.tsx         # Hook tests
    └── use-theme.test.ts                   # Hook tests
docs/
└── implementation.md           # Original design document
e2e/
└── combui.spec.ts              # Playwright E2E tests
.github/
├── workflows/
│   └── pull-request.yml        # CI: lint → test → e2e → build on PRs
└── instructions/
    └── combui-conventions.instructions.md  # Project conventions for Copilot
```

**Key technologies:**
- **Next.js 16 (App Router)** — single application, no separate backend
- **OpenRouter API** — streaming LLM completions (Gemini Flash)
- **react-live** — renders generated code in a live preview panel
- **TanStack Query** — server state management
- **Tailwind CSS v4** — utility-first styling
- **Vitest** — unit tests for stream parser, hooks, components, and utilities
- **Playwright** — E2E tests for critical user flows
- **GitHub Actions** — CI pipeline (lint → test → e2e → build) on every PR to `main`

## How It Works

1. **Enter a prompt** describing the React component you want (e.g. "A pricing card with three tiers")
2. **Code streams in real time** — tokens appear as the LLM generates them
3. **Live preview renders** once streaming completes — see your component come to life
4. **Copy the code** or refine your prompt to iterate
5. **Cancel** an in-flight generation at any time — the stream is aborted and input resets cleanly

## Getting Started

```bash
# Install dependencies
npm install

# Set your OpenRouter API key
export OPENROUTER_API_KEY=your-key-here

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests (headless) |
| `npm run test:e2e:ui` | Run Playwright E2E tests (UI mode) |

## Project Conventions

- **kebab-case** file names, **PascalCase** components, **camelCase** hooks
- **Default exports** for components and pages; named exports for utilities
- **`fetch` API** for all HTTP requests (no `axios`)
- **Named handler functions** in JSX (no anonymous arrow functions)
- **`e.preventDefault()`** on Cancel buttons inside `<form>` elements to prevent React re-render from triggering form submission
- **Tailwind CSS** via `className` strings
- **Unit tests** mirror `src/` structure under `src/test/`
- See `.github/instructions/combui-conventions.instructions.md` for the full convention set.
