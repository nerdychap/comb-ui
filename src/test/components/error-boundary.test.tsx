import ErrorBoundary from "@/components/error-boundary";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const GoodChild = () => <p>All good</p>;
const BadChild = () => {
  throw new Error("Boom!");
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("renders the default error UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <BadChild />
      </ErrorBoundary>
    );
    expect(screen.getByText("Component render error")).toBeInTheDocument();
    expect(screen.getByText("Boom!")).toBeInTheDocument();
  });

  it("renders the custom fallback when provided and a child throws", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error</div>}>
        <BadChild />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error")).toBeInTheDocument();
    expect(screen.queryByText("Component render error")).not.toBeInTheDocument();
  });
});
