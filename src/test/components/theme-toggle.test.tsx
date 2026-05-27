import ThemeToggle from "@/components/theme-toggle";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ThemeToggle", () => {
  it("renders sun icon with correct aria-label when theme is dark", () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
  });

  it("renders moon icon with correct aria-label when theme is light", () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle on repeated clicks", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));

    expect(onToggle).toHaveBeenCalledTimes(3);
  });
});
