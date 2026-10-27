"use client";

import { useState } from "react";

const EXAMPLES = [
  "A pricing card with monthly/yearly toggle",
  "A login form with social buttons",
  "Three KPI stats with trend badges",
];

const REFINE_EXAMPLES = [
  "Switch to a dark color scheme",
  "Make it more compact",
  "Add hover animations",
];

type PromptInputProps = {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  onCancel?: () => void;
  canRefine?: boolean;
  refine?: boolean;
  onRefineChange?: (refine: boolean) => void;
};

type ExampleChipProps = {
  example: string;
  disabled: boolean;
  onSelect: (example: string) => void;
};

function ExampleChip({ example, disabled, onSelect }: ExampleChipProps) {
  const handleClick = () => {
    onSelect(example);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-accent/40 hover:bg-surface-muted hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 dark:hover:text-zinc-100"
    >
      {example}
    </button>
  );
}

export default function PromptInput({
  onSubmit,
  isLoading,
  onCancel,
  canRefine = false,
  refine = false,
  onRefineChange,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const isRefining = canRefine && refine;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = value.trim();

    if (prompt.length > 0) {
      onSubmit(prompt);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onCancel?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleRefineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRefineChange?.(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="prompt" className="sr-only">
        {isRefining
          ? "Describe the change to the current component"
          : "Describe the component you want to generate"}
      </label>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-ring/25">
        <textarea
          id="prompt"
          name="prompt"
          rows={2}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isRefining
              ? "Describe a change to the current component..."
              : "Describe the component you want to generate..."
          }
          className="min-h-16 w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm leading-relaxed text-zinc-900 placeholder-zinc-400 outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100 dark:placeholder-zinc-500"
          disabled={isLoading}
          autoComplete="off"
        />
        <div className="flex items-center justify-between gap-3 px-3 pb-3">
          <div className="flex min-w-0 items-center gap-3">
            {canRefine && (
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-600 select-none dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={refine}
                  onChange={handleRefineChange}
                  disabled={isLoading}
                  className="h-3.5 w-3.5 accent-accent"
                />
                Edit current component
              </label>
            )}
            <p className="hidden text-xs text-zinc-400 sm:block dark:text-zinc-500">
              <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-500">
                Ctrl/⌘
              </kbd>{" "}
              <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-500">
                Enter
              </kbd>{" "}
              to {isRefining ? "update" : "generate"}
            </p>
          </div>
          {isLoading ? (
            <button
              type="button"
              onClick={handleCancel}
              className="ml-auto shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
            >
              Cancel
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefining ? "Update" : "Generate"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Try</span>
        {(isRefining ? REFINE_EXAMPLES : EXAMPLES).map((example) => (
          <ExampleChip key={example} example={example} disabled={isLoading} onSelect={setValue} />
        ))}
      </div>
    </form>
  );
}
