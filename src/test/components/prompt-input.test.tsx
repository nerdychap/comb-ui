import PromptInput from "@/components/prompt-input";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("PromptInput", () => {
  it("renders the input and generate button", () => {
    render(<PromptInput onSubmit={vi.fn()} isLoading={false} />);

    expect(screen.getByPlaceholderText(/describe the component/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate/i })).toBeInTheDocument();
  });

  it("calls onSubmit with the trimmed prompt text on form submit", () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByPlaceholderText(/describe the component/i);
    fireEvent.change(input, { target: { value: "  build a button  " } });
    fireEvent.click(screen.getByRole("button", { name: /generate/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("build a button");
  });

  it("does not call onSubmit when the prompt is only whitespace", () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByPlaceholderText(/describe the component/i);
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: /generate/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when the input is empty", () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} isLoading={false} />);

    fireEvent.click(screen.getByRole("button", { name: /generate/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables the input when isLoading is true", () => {
    render(<PromptInput onSubmit={vi.fn()} isLoading={true} />);

    expect(screen.getByPlaceholderText(/describe the component/i)).toBeDisabled();
  });

  it("shows a Cancel button instead of Generate when isLoading is true", () => {
    render(<PromptInput onSubmit={vi.fn()} isLoading={true} onCancel={vi.fn()} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /generate/i })).not.toBeInTheDocument();
  });

  it("calls onCancel when the Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<PromptInput onSubmit={vi.fn()} isLoading={true} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("submits via keyboard (Enter) as well", () => {
    const onSubmit = vi.fn();
    render(<PromptInput onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByPlaceholderText(/describe the component/i);
    fireEvent.change(input, { target: { value: "a card" } });
    fireEvent.submit(input.closest("form")!);

    expect(onSubmit).toHaveBeenCalledWith("a card");
  });

  it("does not crash when onCancel is not provided and isLoading is true", () => {
    render(<PromptInput onSubmit={vi.fn()} isLoading={true} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(() => fireEvent.click(screen.getByRole("button", { name: /cancel/i }))).not.toThrow();
  });
});
