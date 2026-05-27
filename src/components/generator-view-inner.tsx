"use client";

import LivePreviewWrapper from "@/components/live-preview-wrapper";
import PromptInput from "@/components/prompt-input";
import ResizableSplit from "@/components/resizable-split";
import StreamCodeDisplay from "@/components/stream-code-display";
import ThemeToggle from "@/components/theme-toggle";
import { useClipboard } from "@/hooks/use-clipboard";
import { useStreamContext } from "@/hooks/use-stream-context";
import { useTheme } from "@/hooks/use-theme";

export default function GeneratorViewInner() {
  const { content, isLoading, error, startStream, abortStream, resetStream } = useStreamContext();
  const { copyToClipboard, isCopied } = useClipboard();
  const { theme, toggleTheme } = useTheme();

  const handleCopy = () => {
    if (content) {
      copyToClipboard(content);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            CombUI
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Describe a component and watch it come to life in real time
          </p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <PromptInput onSubmit={startStream} isLoading={isLoading} onCancel={abortStream} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          <p>{error}</p>
          <button
            type="button"
            onClick={resetStream}
            className="mt-2 text-sm font-medium text-red-600 underline hover:text-red-500 dark:text-red-400"
          >
            Try again
          </button>
        </div>
      )}

      <ResizableSplit
        left={
          <div className="flex min-h-75 max-h-[40vh] md:max-h-[80vh] flex-col gap-2 overflow-hidden lg:min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Code</h2>

              <button
                type="button"
                disabled={content.length === 0}
                onClick={handleCopy}
                className="rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <StreamCodeDisplay />
          </div>
        }
        right={
          <div className="flex min-h-75 max-h-[40vh] md:max-h-[80vh] flex-col gap-2 overflow-hidden lg:min-h-0">
            <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Preview</h2>
            <LivePreviewWrapper code={!isLoading ? content : ""} isLoading={isLoading} />
          </div>
        }
      />
    </div>
  );
}
