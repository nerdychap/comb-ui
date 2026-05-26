import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStream } from "@/hooks/use-stream";
import { ReactNode } from "react";

function createWrapper() {
  const queryClient = new QueryClient();

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useStream", () => {
  it("returns initial state with empty content and not loading", () => {
    const { result } = renderHook(() => useStream(), {
      wrapper: createWrapper(),
    });

    expect(result.current.content).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("resets state when resetStream is called", () => {
    const { result } = renderHook(() => useStream(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.resetStream();
    });

    expect(result.current.content).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});