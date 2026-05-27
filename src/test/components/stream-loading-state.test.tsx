import StreamLoadingState from "@/components/stream-loading-state";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("StreamLoadingState", () => {
  it("renders the waiting message", () => {
    render(<StreamLoadingState />);
    expect(screen.getByText(/waiting for response/i)).toBeInTheDocument();
  });
});
