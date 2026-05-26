import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "@/hooks/use-clipboard";

describe("useClipboard", () => {
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
});