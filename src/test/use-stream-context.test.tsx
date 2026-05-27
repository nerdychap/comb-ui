import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStreamContext } from "@/hooks/use-stream-context";
import { StreamProvider } from "@/providers/stream-provider";
import { ReactNode } from "react";

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <StreamProvider>{children}</StreamProvider>;
  };
}

describe("useStreamContext", () => {
  it("returns the stream context value when used within a StreamProvider", () => {
    const { result } = renderHook(() => useStreamContext(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty("content");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("startStream");
    expect(result.current).toHaveProperty("abortStream");
    expect(result.current).toHaveProperty("resetStream");
  });

  it("returns initial default values", () => {
    const { result } = renderHook(() => useStreamContext(), {
      wrapper: createWrapper(),
    });

    expect(result.current.content).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("throws an error when used outside a StreamProvider", () => {
    expect(() => {
      renderHook(() => useStreamContext());
    }).toThrow("useStreamContext must be used within a <StreamProvider>");
  });
});