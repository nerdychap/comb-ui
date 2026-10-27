import SandboxedPreview from "@/components/sandboxed-preview";
import type { PreviewTheme } from "@/lib/preview-messages";

type LivePreviewWrapperProps = {
  code: string;
  isLoading?: boolean;
  theme?: PreviewTheme;
  onFixError?: (error: string) => void;
};

export default function LivePreviewWrapper({
  code,
  isLoading = false,
  theme = "light",
  onFixError,
}: LivePreviewWrapperProps) {
  if (!code) {
    if (isLoading) {
      return (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted p-4">
          <div className="text-center" role="status" aria-live="polite">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-accent dark:border-zinc-700 dark:border-t-accent" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Building preview...</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted p-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--foreground) 8%, transparent) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      >
        <div className="flex max-w-xs flex-col items-center gap-2 text-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-zinc-400"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 9h18" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Preview canvas</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Live preview will appear here...
          </p>
        </div>
      </div>
    );
  }

  // No key: the frame stays mounted, so the current preview stays visible while a
  // new version streams, and the new code replaces it in place when it is done.
  return <SandboxedPreview code={code} theme={theme} onFixError={onFixError} />;
}
