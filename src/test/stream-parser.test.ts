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

  it("calls onError when response body is null", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const response = new Response(null);

    streamParser(response, { onToken, onDone, onError });

    expect(onError).toHaveBeenCalledWith(new Error("Response body is not readable"));
    expect(onToken).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("handles tokens split across multiple chunks", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk1 = 'data: {"choices":[{"delta":{"content":"Hel' + 'lo"}}]}\n\n';
    const chunk2 = 'data: {"choices":[{"delta":{"content":" World"}}]}\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk1, chunk2]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(2);
    expect(onToken).toHaveBeenNthCalledWith(1, "Hello");
    expect(onToken).toHaveBeenNthCalledWith(2, " World");
    expect(onError).not.toHaveBeenCalled();
  });

  it("handles partial data lines that complete in the next chunk", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk1 = 'data: {"choices":[{"delta":{"content":"Hel';
    const chunk2 =
      'lo"}}]}\n\ndata: {"choices":[{"delta":{"content":"!"}}]}\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk1, chunk2]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(2);
    expect(onToken).toHaveBeenNthCalledWith(1, "Hello");
    expect(onToken).toHaveBeenNthCalledWith(2, "!");
  });

  it("skips lines that do not start with 'data: ' prefix", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk =
      'event: custom\ndata: {"choices":[{"delta":{"content":"x"}}]}\n\n:heartbeat\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith("x");
  });

  it("handles delta content with empty string gracefully", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk =
      'data: {"choices":[{"delta":{"content":""}}]}\n\ndata: {"choices":[{"delta":{"content":"x"}}]}\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    // Empty content should be skipped, only "x" should be emitted
    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith("x");
  });

  it("responds to abort signal without calling onError", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    // Create a response that doesn't finish immediately
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'
          )
        );
        // Never close — keep the stream open
      },
    });

    const response = new Response(readable);
    const abortController = streamParser(response, { onToken, onDone, onError });

    // Simulate abort
    abortController.abort();

    // Wait a tick to let the read loop process the abort
    await vi.waitFor(() => {
      // onToken may have been called for "Hello", but onError should NOT have been called
      // with an AbortError
      expect(onError).not.toHaveBeenCalled();
    });
  });

  it("retuns an AbortController", () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk = 'data: [DONE]\n\n';
    const response = createMockResponse([chunk]);

    const result = streamParser(response, { onToken, onDone, onError });

    expect(result).toBeInstanceOf(AbortController);
    expect(typeof result.abort).toBe("function");
  });

  it("handles delta with no content key in choices", async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();
    const onError = vi.fn();

    const chunk =
      'data: {"choices":[{"delta":{}}]}\n\ndata: {"choices":[{"delta":{"content":"x"}}]}\n\ndata: [DONE]\n\n';

    const response = createMockResponse([chunk]);

    streamParser(response, { onToken, onDone, onError });

    await vi.waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });

    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith("x");
  });
});