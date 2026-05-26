import { describe, it, expect, vi } from "vitest";
import { streamParser } from "@/lib/stream-parser";

function createMockResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  let chunkIndex = 0;

  const readable = new ReadableStream({
    async pull(controller) {
      if (chunkIndex >= chunks.length) {
        controller.close();
        return;
      }

      controller.enqueue(encoder.encode(chunks[chunkIndex]));
      chunkIndex++;

      await new Promise((resolve) => setTimeout(resolve, 0));
    },
  });

  return new Response(readable);
}

describe("streamParser", () => {
  it("calls onToken for each content token in the stream", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk =
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":" World"}}]}\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(2);
    expect(onToken).toHaveBeenNthCalledWith(1, "Hello");
    expect(onToken).toHaveBeenNthCalledWith(2, " World");
    expect(onError).not.toHaveBeenCalled();
  });

  it("calls onDone when [DONE] is received", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk = 'data: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("skips malformed JSON lines without error", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk =
      'data: {invalid json}\n\ndata: {"choices":[{"delta":{"content":"valid"}}]}\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith("valid");
    expect(onError).not.toHaveBeenCalled();
  });

  it("handles empty lines and non-data lines gracefully", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk =
      '\n\ndata: {"choices":[{"delta":{"content":"x"}}]}\n\n:comment line\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith("x");
  });
});