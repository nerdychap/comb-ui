import StreamStatePanel from "@/components/stream-state-panel";

export default function StreamLoadingState() {
  return (
    <StreamStatePanel>
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 animate-pulse rounded-full"
          style={{ backgroundColor: "#71717a" }}
        />
        <p className="text-sm" style={{ color: "#a1a1aa" }}>
          Waiting for response...
        </p>
      </div>
    </StreamStatePanel>
  );
}
