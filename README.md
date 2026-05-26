# CombUI - AI Component Generator

Generate React+Tailwind components from text prompts. Describe what you want and watch the component come to life in real time with streaming code generation and a live preview.

## Architecture

```
src/
├── app/api/generate/route.ts   # Streaming API endpoint (OpenRouter)
├── components/
│   ├── prompt-input.tsx        # Prompt input form
│   ├── stream-component.tsx    # Real-time code display
│   ├── live-preview-wrapper.tsx # react-live render panel
│   └── error-boundary.tsx      # Error boundary for live preview
├── hooks/
│   ├── use-stream.ts           # Streaming state management hook
│   └── use-clipboard.ts        # Clipboard copy hook
├── lib/
│   ├── stream-parser.ts        # SSE stream parser
│   ├── rate-limiter.ts         # In-memory sliding window rate limiter
│   └── sanitize.ts             # Prompt sanitization & HTML escaping
└── test/                       # Vitest unit tests
```

**Key technologies:**
- **Next.js 16 (App Router)** - single application, no separate backend
- **OpenRouter API** - streaming LLM completions (Gemini Flash)
- **react-live** - renders generated code in a live preview panel
- **TanStack Query** - server state management
- **Tailwind CSS v4** - utility-first styling
- **Vitest** - unit tests for stream parser, hooks, and utilities

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
