"use client";

type PreviewErrorProps = {
  error: string;
  onFix?: (error: string) => void;
};

export default function PreviewError({ error, onFix }: PreviewErrorProps) {
  const handleClick = () => {
    onFix?.(error);
  };

  return (
    <div
      role="alert"
      className="flex shrink-0 items-start justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
    >
      <pre className="min-w-0 font-mono text-xs break-words whitespace-pre-wrap">{error}</pre>
      {onFix && (
        <button
          type="button"
          onClick={handleClick}
          className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Fix with AI
        </button>
      )}
    </div>
  );
}
