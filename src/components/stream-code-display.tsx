"use client";

import { useStreamContext } from "@/hooks/use-stream-context";
import { Highlight, themes, type Language } from "prism-react-renderer";
import StreamEmptyState from "@/components/stream-empty-state";
import StreamLoadingState from "@/components/stream-loading-state";

const PANEL_BG = "#18181b";
const PANEL_BORDER = "#3f3f46";

export default function StreamCodeDisplay() {
  const { content, isLoading } = useStreamContext();

  if (!content && !isLoading) {
    return <StreamEmptyState />;
  }

  if (isLoading && !content) {
    return <StreamLoadingState />;
  }

  return (
    <div className="flex-1 min-h-0">
      <Highlight theme={themes.nightOwl} code={content} language={"tsx" as Language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`h-full overflow-y-auto rounded-lg border p-4 text-sm leading-relaxed ${className}`}
            style={{ ...style, backgroundColor: PANEL_BG, borderColor: PANEL_BORDER, whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word" }}
          >
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line });
                return (
                  <div key={i} {...lineProps} style={lineProps.style}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                );
              })}
              {isLoading && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" style={{ backgroundColor: "#a1a1aa" }} />
              )}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}