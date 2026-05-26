"use client";

import { ensureRenderCall } from "@/lib/ensure-render-call";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import ErrorBoundary from "./error-boundary";

const PANEL_BG = "#18181b";

type LivePreviewWrapperProps = {
  code: string;
  isLoading?: boolean;
};

export default function LivePreviewWrapper({ code, isLoading = false }: LivePreviewWrapperProps) {
  if (!code) {
    if (isLoading) {
      return (
        <div
          className="flex flex-1 items-center justify-center rounded-lg border p-4"
          style={{ backgroundColor: PANEL_BG, borderColor: "#3f3f46" }}
        >
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
            <p className="text-sm" style={{ color: "#a1a1aa" }}>
              Building preview...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex min-h-0 flex-1 items-center justify-center rounded-lg border p-4"
        style={{ backgroundColor: PANEL_BG, borderColor: "#3f3f46" }}
      >
        <p className="text-sm" style={{ color: "#a1a1aa" }}>
          Live preview will appear here...
        </p>
      </div>
    );
  }

  const renderCode = ensureRenderCall(code);

  return (
    <div
      className="min-h-0 flex-1 overflow-hidden rounded-lg border"
      style={{ backgroundColor: PANEL_BG, borderColor: "#3f3f46" }}
    >
      <ErrorBoundary>
        <LiveProvider code={renderCode} noInline>
          <div className="flex h-full flex-col">
            <LiveError
              className="mx-4 mt-4 rounded-md p-3 text-sm"
              style={{ backgroundColor: "#7f1d1d", color: "#fca5a5" }}
            />
            <div className="flex-1 overflow-auto p-6">
              <LivePreview />
            </div>
          </div>
        </LiveProvider>
      </ErrorBoundary>
    </div>
  );
}
