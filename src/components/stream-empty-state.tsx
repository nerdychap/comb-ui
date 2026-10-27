import StreamStatePanel from "@/components/stream-state-panel";

export default function StreamEmptyState() {
  return (
    <StreamStatePanel>
      <div className="flex max-w-xs flex-col items-center gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-400"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-300">No code yet</p>
        <p className="text-sm" style={{ color: "#a1a1aa" }}>
          Generated code will appear here...
        </p>
      </div>
    </StreamStatePanel>
  );
}
