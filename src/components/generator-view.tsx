"use client";

import LivePreviewWrapper from "@/components/live-preview-wrapper";
import PromptInput from "@/components/prompt-input";
import ResizableSplit from "@/components/resizable-split";
import StreamCodeDisplay from "@/components/stream-code-display";
import ThemeToggle from "@/components/theme-toggle";
import { useClipboard } from "@/hooks/use-clipboard";
import { useStreamContext } from "@/hooks/use-stream-context";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export default function GeneratorView() {
  const {
    content,
    completedContent,
    completedCount,
    isLoading,
    error,
    startStream,
    abortStream,
    resetStream,
  } = useStreamContext();
  const { copyToClipboard, isCopied } = useClipboard();
  const { theme, toggleTheme } = useTheme();
  const [refine, setRefine] = useState(true);
  // A new key remounts PromptInput, which clears its text.
  const [promptKey, setPromptKey] = useState(0);
  // completedCount when the user submitted the prompt; null when no submit is pending.
  const [pendingSubmit, setPendingSubmit] = useState<number | null>(null);

  // Clear the prompt only when a request from the prompt succeeds. On failure or
  // cancel, keep the text so the user can send it again.
  if (pendingSubmit !== null) {
    if (completedCount > pendingSubmit) {
      setPendingSubmit(null);
      setPromptKey((key) => key + 1);
    } else if (!isLoading) {
      setPendingSubmit(null);
    }
  }

  const canRefine = content.length > 0 && !isLoading;

  const handleSubmit = (prompt: string) => {
    setPendingSubmit(completedCount);
    startStream(prompt, canRefine && refine ? { currentCode: content } : undefined);
  };

  const handleFixError = (errorMessage: string) => {
    startStream(
      `Fix this error so that the component renders. Do not change anything else.\n\nError: ${errorMessage}`,
      {
        currentCode: completedContent,
      }
    );
  };

  const handleCopy = () => {
    if (content) {
      copyToClipboard(content);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5 md:overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-700 text-white shadow-sm dark:bg-orange-400 dark:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2.2 16.4 4.7 16.4 9.7 12 12.2 7.6 9.7 7.6 4.7 12 2.2ZM7.1 10.8 11.5 13.3 11.5 18.3 7.1 20.8 2.7 18.3 2.7 13.3 7.1 10.8ZM16.9 10.8 21.3 13.3 21.3 18.3 16.9 20.8 12.5 18.3 12.5 13.3 16.9 10.8Z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-50">
              CombUI
            </h1>
            <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
              Describe a component and watch it come to life in real time
            </p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <div className="shrink-0">
        <PromptInput
          key={promptKey}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={abortStream}
          canRefine={canRefine}
          refine={refine}
          onRefineChange={setRefine}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex shrink-0 items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/70 dark:text-red-300"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={resetStream}
            className="shrink-0 font-medium text-red-700 underline decoration-red-300 underline-offset-2 hover:text-red-600 dark:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      <ResizableSplit
        left={
          <section className="flex min-h-[220px] flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-zinc-950 shadow-sm md:min-h-0">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 px-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400/80" aria-hidden="true" />
                <h2 className="text-sm font-medium text-zinc-300">Code</h2>
              </div>
              <button
                type="button"
                disabled={content.length === 0}
                onClick={handleCopy}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-2">
              <StreamCodeDisplay />
            </div>
          </section>
        }
        right={
          <section className="flex min-h-[220px] flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:min-h-0">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Preview</h2>
              </div>
              <span
                aria-live="polite"
                className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase"
              >
                {isLoading && completedContent ? "Updating..." : "Live"}
              </span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-2">
              <LivePreviewWrapper
                code={completedContent}
                isLoading={isLoading}
                theme={theme}
                onFixError={isLoading ? undefined : handleFixError}
              />
            </div>
          </section>
        }
      />
    </div>
  );
}
