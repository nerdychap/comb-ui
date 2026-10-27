"use client";

import ErrorBoundary from "@/components/error-boundary";
import PreviewErrorReporter from "@/components/preview-error-reporter";
import { ensureRenderCall } from "@/lib/ensure-render-call";
import { isPreviewRenderMessage, type PreviewErrorMessage } from "@/lib/preview-messages";
import { useCallback, useEffect, useState } from "react";
import { LivePreview, LiveProvider } from "react-live";

function postToParent(message: PreviewErrorMessage | { type: "combui:ready" }) {
  // The parent cannot be addressed by origin from an opaque-origin frame.
  window.parent.postMessage(message, "*");
}

export default function PreviewSandbox() {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !isPreviewRenderMessage(event.data)) {
        return;
      }

      document.documentElement.classList.toggle("dark", event.data.theme === "dark");
      setCode(event.data.code);
    };

    window.addEventListener("message", handleMessage);
    postToParent({ type: "combui:ready" });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleError = useCallback((error: string | null) => {
    postToParent({ type: "combui:error", error });
  }, []);

  const handleBoundaryError = useCallback((error: Error) => {
    postToParent({ type: "combui:error", error: error.message });
  }, []);

  if (code === null) {
    return null;
  }

  // The iframe has no Tailwind CSS, so this component uses inline styles.
  // The app shows errors next to the frame, so a crashed render shows nothing here.
  return (
    <ErrorBoundary key={code} onError={handleBoundaryError} fallback={<></>}>
      <LiveProvider code={ensureRenderCall(code)} noInline>
        <PreviewErrorReporter onError={handleError} />
        {/* min-height, not height: a component taller than the frame grows and scrolls
            instead of overflowing above the top edge. */}
        <div style={{ minHeight: "100%", padding: 24, display: "flex", flexDirection: "column" }}>
          <LivePreview style={{ flex: 1 }} />
        </div>
      </LiveProvider>
    </ErrorBoundary>
  );
}
