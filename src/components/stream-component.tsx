"use client";

import { Highlight, themes, type Language } from "prism-react-renderer";

const PANEL_BG = "#18181b";
const PANEL_BORDER = "#3f3f46";

type StreamComponentProps = {
  content: string;
  isLoading: boolean;
};

export default function StreamComponent({ content, isLoading }: StreamComponentProps) {
  if (!content && !isLoading) {
    return (
      <div
        className="flex flex-1 min-h-0 items-center justify-center rounded-lg border p-4"
        style={{ backgroundColor: PANEL_BG, borderColor: PANEL_BORDER }}
      >
        <p className="text-sm" style={{ color: "#a1a1aa" }}>
          Generated code will appear here...
        </p>
      </div>
    );
  }

  if (isLoading && !content) {
    return (
      <div
        className="flex flex-1 min-h-0 items-center justify-center rounded-lg border p-4"
        style={{ backgroundColor: PANEL_BG, borderColor: PANEL_BORDER }}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: "#71717a" }} />
          <p className="text-sm" style={{ color: "#a1a1aa" }}>Waiting for response...</p>
        </div>
      </div>
    );
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