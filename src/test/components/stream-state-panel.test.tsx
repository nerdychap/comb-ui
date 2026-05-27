import StreamStatePanel from "@/components/stream-state-panel";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("StreamStatePanel", () => {
  it("renders children", () => {
    render(
      <StreamStatePanel>
        <p>Child content</p>
      </StreamStatePanel>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <StreamStatePanel>
        <span>First</span>
        <span>Second</span>
      </StreamStatePanel>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders without children", () => {
    const { container } = render(<StreamStatePanel>{null}</StreamStatePanel>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
