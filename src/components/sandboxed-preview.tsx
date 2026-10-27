"use client";

import PreviewError from "@/components/preview-error";
import {
  isPreviewFrameMessage,
  type PreviewRenderMessage,
  type PreviewTheme,
} from "@/lib/preview-messages";
import { useEffect, useRef, useState } from "react";

type SandboxedPreviewProps = {
  code: string;
  theme: PreviewTheme;
  onFixError?: (error: string) => void;
};

// No "allow-same-origin": the frame gets an opaque origin, so generated code
// cannot read the app's storage, cookies or DOM. "allow-forms" keeps submit
// events working for generated forms.
const SANDBOX = "allow-scripts allow-forms";

export default function SandboxedPreview({ code, theme, onFixError }: SandboxedPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || !isPreviewFrameMessage(event.data)) {
        return;
      }

      if (event.data.type === "combui:ready") {
        setIsReady(true);
        return;
      }

      setError(event.data.error);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const message: PreviewRenderMessage = { type: "combui:render", code, theme };
    // The frame has an opaque origin, so "*" is the only target origin that matches it.
    iframeRef.current?.contentWindow?.postMessage(message, "*");
  }, [isReady, code, theme]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-border bg-white p-2 dark:bg-zinc-950">
      {error && <PreviewError error={error} onFix={onFixError} />}
      <iframe
        ref={iframeRef}
        src="/preview.html"
        title="Component preview"
        sandbox={SANDBOX}
        className="min-h-40 w-full flex-1 rounded-lg"
      />
    </div>
  );
}
