import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

const { mockRateLimiter, mockSanitizePrompt } = vi.hoisted(() => ({
  mockRateLimiter: vi.fn(),
  mockSanitizePrompt: vi.fn(),
}));

vi.mock("@/lib/rate-limiter", () => ({
  rateLimiter: mockRateLimiter,
}));

vi.mock("@/lib/sanitize", () => ({
  sanitizePrompt: mockSanitizePrompt,
}));

function makeRequest({
  prompt = "build a button",
  ip = "127.0.0.1",
}: { prompt?: string; ip?: string } = {}): NextRequest {
  return new NextRequest("http://localhost:3000/api/generate", {
    method: "POST",
    headers: { "x-forwarded-for": ip, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.stubEnv("OPENROUTER_API_KEY", "sk-test-key");
    vi.stubEnv("AI_MODEL", "test-model");
    mockRateLimiter.mockReturnValue(true);
    mockSanitizePrompt.mockImplementation((p: unknown) =>
      typeof p === "string" ? p.trim() : ""
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns 429 when rate limited", async () => {
    mockRateLimiter.mockReturnValue(false);

    const response = await POST(makeRequest());

    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.error).toBe("Too many requests. Please try again later.");
  });

  it("returns 400 when prompt is empty (sanitizePrompt throws)", async () => {
    mockSanitizePrompt.mockImplementation(() => {
      throw new Error("Prompt must be a non-empty string");
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Prompt must be a non-empty string");
  });

  it("returns 500 when API key is not configured", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");

    const response = await POST(makeRequest());

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("API key not configured");
  });

  it("returns a streaming response on success", async () => {
    const encoder = new TextEncoder();
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'
          )
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(mockStream, { status: 200 })
    );

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    expect(response.headers.get("Cache-Control")).toBe("no-cache");
    expect(response.headers.get("Connection")).toBe("keep-alive");
    expect(response.body).toBe(mockStream);
  });

  it("uses default AI_MODEL when env var is not set", async () => {
    vi.stubEnv("AI_MODEL", "");

    const encoder = new TextEncoder();
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(mockStream, { status: 200 }));

    await POST(makeRequest());

    const fetchCall = fetchSpy.mock.calls[0];
    const body = JSON.parse(fetchCall[1]!.body as string);
    expect(body.model).toBe("deepseek/deepseek-v4-flash");

    fetchSpy.mockRestore();
  });

  it("forwards the configured AI_MODEL when set", async () => {
    vi.stubEnv("AI_MODEL", "anthropic/claude-3-opus");

    const encoder = new TextEncoder();
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(mockStream, { status: 200 }));

    await POST(makeRequest());

    const fetchCall = fetchSpy.mock.calls[0];
    const body = JSON.parse(fetchCall[1]!.body as string);
    expect(body.model).toBe("anthropic/claude-3-opus");

    fetchSpy.mockRestore();
  });

  it("sends the sanitized prompt in the user message", async () => {
    const encoder = new TextEncoder();
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(mockStream, { status: 200 }));

    // After the beforeEach default implementation, override with a known return
    mockSanitizePrompt.mockReset();
    mockSanitizePrompt.mockReturnValue("a red card");

    await POST(makeRequest({ prompt: "  a red card  " }));

    // The route calls sanitizePrompt(body.prompt) with the raw JSON value
    expect(mockSanitizePrompt).toHaveBeenCalledWith("  a red card  ");

    const fetchCall = fetchSpy.mock.calls[0];
    const body = JSON.parse(fetchCall[1]!.body as string);
    expect(body.messages[1].content).toContain("a red card");

    fetchSpy.mockRestore();
  });

  it("forwards OpenRouter error status codes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Upstream error", { status: 502 })
    );

    const response = await POST(makeRequest());

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toBe("Failed to generate component");
  });

  it("returns 500 for unexpected errors", async () => {
    mockSanitizePrompt.mockImplementation(() => {
      throw new Error("Something weird happened");
    });

    const response = await POST(makeRequest());

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("An unexpected error occurred");
  });

  it("uses the client IP for rate limiting", async () => {
    mockRateLimiter.mockReturnValue(false);

    const response = await POST(makeRequest({ ip: "10.0.0.1" }));

    expect(mockRateLimiter).toHaveBeenCalledWith("10.0.0.1");
    expect(response.status).toBe(429);
  });

  it("uses 'anonymous' when x-forwarded-for header is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "test" }),
    });

    mockRateLimiter.mockReturnValue(true);

    const encoder = new TextEncoder();
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(mockStream, { status: 200 })
    );

    await POST(request);

    expect(mockRateLimiter).toHaveBeenCalledWith("anonymous");
  });
});