import { NextRequest } from "next/server";
import { sanitizePrompt } from "@/lib/sanitize";
import { rateLimiter } from "@/lib/rate-limiter";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

    if (!rateLimiter(clientIp)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const prompt = sanitizePrompt(body.prompt);

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "deepseek/deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a React component generator. Generate ONLY valid React functional component code using inline styles (style={{...}} objects) for all visual styling and make them look visually appealing and responsive. The container style should always include height of 100%. Use TypeScript syntax (type annotations, interfaces) — it is supported. The code must start with a named function or arrow function component and end with `render(<YourComponentName />)`. Do Not use backticks to wrap the code. Do NOT include markdown code fences, explanations, or any text outside the code. Do NOT use import, export, require, or Tailwind CSS class names — only style objects. Use `React.useState`, `React.useEffect`, `React.useCallback`, etc. instead of bare hook names — the `React` global is available.",
          },
          {
            role: "user",
            content: `Generate a React component with inline styles for the following description. Remember to end the code with \`render(<YourComponent />)\`:\n\n${prompt}`,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to generate component" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Generate endpoint error:", error);

    if (error instanceof Error && error.message === "Prompt must be a non-empty string") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
