export type StreamCallbacks = {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
};

export function streamParser(response: Response, callbacks: StreamCallbacks): AbortController {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  const abortController = new AbortController();

  if (!reader) {
    callbacks.onError(new Error("Response body is not readable"));
    return abortController;
  }

  let buffer = "";

  async function read() {
    try {
      while (true) {
        const { done, value } = await reader!.read();

        if (done) {
          callbacks.onDone();
          return;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) {
            continue;
          }

          const data = trimmed.slice("data: ".length);

          if (data === "[DONE]") {
            callbacks.onDone();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const token: string | undefined =
              parsed.choices?.[0]?.delta?.content;

            if (token) {
              callbacks.onToken(token);
            }
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      callbacks.onError(
        error instanceof Error ? error : new Error("Stream parsing failed")
      );
    }
  }

  read();

  return abortController;
}