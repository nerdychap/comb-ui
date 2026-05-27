import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "@/hooks/use-clipboard";

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial state with isCopied false", () => {
    const { result } = renderHook(() => useClipboard());

    expect(result.current.isCopied).toBe(false);
  });

  it("calls navigator.clipboard.writeText when copyToClipboard is invoked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copyToClipboard("test content");
    });

    expect(writeText).toHaveBeenCalledWith("test content");
  });

  it("sets isCopied to true after copying", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copyToClipboard("some text");
    });

    expect(result.current.isCopied).toBe(true);
  });

  it("resets isCopied to false after 2 seconds", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copyToClipboard("some text");
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isCopied).toBe(false);
  });

  it("handles clipboard write failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      result.current.copyToClipboard("some text");
    });

    expect(result.current.isCopied).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("Failed to copy to clipboard");
    consoleSpy.mockRestore();
  });
});