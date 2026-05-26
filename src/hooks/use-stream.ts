import { useState, useCallback, useRef } from "react";
import { streamParser } from "@/lib/stream-parser";
import { cleanGeneratedCode } from "@/lib/clean-generated-code";

type UseStreamResult = {
  content: string;
  isLoading: boolean;
  error: string | null;
  startStream: (prompt: string) => void;
  abortStream: () => void;
  resetStream: () => void;
};

export function useStream(): UseStreamResult {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abortStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const startStream = useCallback(
    async (prompt: string) => {
      abortStream();
      setContent("");
      setError(null);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
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
          setError(errorMessage);
          setIsLoading(false);
          abortRef.current = null;
          return;
        }

        streamParser(response, {
          onToken: (token: string) => {
            setContent((prev) => {
              const next = prev + token;
              return cleanGeneratedCode(next);
            });
          },
          onDone: () => {
            setIsLoading(false);
            abortRef.current = null;
          },
          onError: (err: Error) => {
            console.error("Stream error:", err);
            setError("Failed to generate component. Please try again.");
            setIsLoading(false);
            abortRef.current = null;
          },
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error("Stream request error:", err);
        setError("An unexpected error occurred");
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [abortStream]
  );

  const resetStream = useCallback(() => {
    abortStream();
    setContent("");
    setError(null);
  }, [abortStream]);

  return { content, isLoading, error, startStream, abortStream, resetStream };
}