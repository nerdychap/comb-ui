import { cleanGeneratedCode } from "@/lib/clean-generated-code";
import { streamParser } from "@/lib/stream-parser";
import { useCallback, useRef, useState } from "react";

export type StreamOptions = {
  currentCode?: string;
};

type UseStreamResult = {
  content: string;
  /** Code of the last generation that finished. It does not change while a new one streams. */
  completedContent: string;
  /** Number of generations that finished with code. */
  completedCount: number;
  isLoading: boolean;
  error: string | null;
  startStream: (prompt: string, options?: StreamOptions) => void;
  abortStream: () => void;
  resetStream: () => void;
};

export function useStream(): UseStreamResult {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const rawRef = useRef("");
  // Code from the last generation that finished. Cancel and errors restore it,
  // so a failed refine does not discard the user's component.
  const lastCompleteRef = useRef("");
  const [completedContent, setCompletedContent] = useState("");
  const [completedCount, setCompletedCount] = useState(0);

  const stopRequest = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const abortStream = useCallback(() => {
    stopRequest();
    setIsLoading(false);
    setContent(lastCompleteRef.current);
    setError(null);
  }, [stopRequest]);

  const startStream = useCallback(
    async (prompt: string, options?: StreamOptions) => {
      stopRequest();
      setIsLoading(true);
      setContent("");
      setError(null);
      rawRef.current = "";

      const controller = new AbortController();
      abortRef.current = controller;

      const fail = (message: string) => {
        setError(message);
        setIsLoading(false);
        setContent(lastCompleteRef.current);
        abortRef.current = null;
      };

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, currentCode: options?.currentCode }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errorMessage = "An unexpected error occurred";
          try {
            const errorBody = await response.json();
            errorMessage = errorBody.error ?? errorMessage;
          } catch {
            // ignore JSON parse errors on error responses
          }
          fail(errorMessage);
          return;
        }

        streamParser(response, {
          onToken: (token: string) => {
            // Clean the full raw text each time. Cleaning the already-cleaned
            // text would trim the trailing newline of every token.
            rawRef.current += token;
            setContent(cleanGeneratedCode(rawRef.current));
          },
          onDone: () => {
            const finalCode = cleanGeneratedCode(rawRef.current);
            if (finalCode) {
              lastCompleteRef.current = finalCode;
              setCompletedContent(finalCode);
              setCompletedCount((count) => count + 1);
            } else {
              setContent(lastCompleteRef.current);
            }
            setIsLoading(false);
            abortRef.current = null;
          },
          onError: (err: Error) => {
            console.error("Stream error:", err);
            fail("Failed to generate component. Please try again.");
          },
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error("Stream request error:", err);
        fail("An unexpected error occurred");
      }
    },
    [stopRequest]
  );

  const resetStream = useCallback(() => {
    abortStream();
  }, [abortStream]);

  return {
    content,
    completedContent,
    completedCount,
    isLoading,
    error,
    startStream,
    abortStream,
    resetStream,
  };
}
