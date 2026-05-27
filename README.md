# CombUI - AI Component Generator

Generate React components from text prompts. Describe what you want and watch the component come to life in real time with streaming code generation and a live preview.

## Architecture

```
src/
├── app/api/generate/route.ts   # Streaming API endpoint (OpenRouter)
├── components/
│   ├── error-boundary.tsx         # Error boundary for live preview
│   ├── generator-view.tsx         # Wraps inner view in StreamProvider
│   ├── generator-view-inner.tsx   # Main view with code & preview panes
│   ├── live-preview-wrapper.tsx   # react-live render panel
│   ├── prompt-input.tsx           # Prompt input form
│   ├── resizable-split.tsx        # Draggable split pane for code/preview
│   ├── stream-code-display.tsx    # Real-time code display with states
│   ├── stream-empty-state.tsx     # Empty placeholder state
│   ├── stream-loading-state.tsx   # Loading indicator state
│   ├── stream-state-panel.tsx     # Streaming status overview panel
│   └── theme-toggle.tsx           # Dark/light mode toggle
├── context/
│   └── stream-context.ts          # Context definition + type
├── providers/
│   └── stream-provider.tsx        # Provider component
├── hooks/
│   ├── use-clipboard.ts           # Clipboard copy hook
│   ├── use-stream.ts              # Streaming state management hook
│   ├── use-stream-context.tsx     # Consumer hook
│   └── use-theme.ts               # Dark/light mode hook
├── lib/
│   ├── clean-generated-code.ts    # Post-processing of LLM output
│   ├── ensure-render-call.ts      # Ensures render() call in generated code
│   ├── rate-limiter.ts            # In-memory sliding window rate limiter
│   ├── sanitize.ts                # Prompt sanitization & HTML escaping
│   └── stream-parser.ts           # SSE stream parser
└── test/                        # Vitest unit tests
```

**Key technologies:**
- **Next.js 16 (App Router)** - single application, no separate backend
- **OpenRouter API** - streaming LLM completions (Gemini Flash)
- **react-live** - renders generated code in a live preview panel
- **TanStack Query** - server state management
- **Tailwind CSS v4** - utility-first styling
- **Vitest** - unit tests for stream parser, hooks, and utilities
- **GitHub Actions** - CI pipeline (lint → test → build) on every PR to `main`

## How It Works

1. **Enter a prompt** describing the React component you want (e.g. "A pricing card with three tiers")
2. **Code streams in real time** - tokens appear as the LLM generates them
3. **Live preview renders** once streaming completes - see your component come to life
4. **Copy the code** or refine your prompt to iterate

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
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
