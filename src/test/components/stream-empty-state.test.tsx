import StreamEmptyState from "@/components/stream-empty-state";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("StreamEmptyState", () => {
  it("renders the placeholder message", () => {
    render(<StreamEmptyState />);
    expect(screen.getByText(/generated code will appear here/i)).toBeInTheDocument();
  });
});
