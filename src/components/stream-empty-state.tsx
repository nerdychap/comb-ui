import StreamStatePanel from "@/components/stream-state-panel";

export default function StreamEmptyState() {
  return (
    <StreamStatePanel>
      <p className="text-sm" style={{ color: "#a1a1aa" }}>
        Generated code will appear here...
      </p>
    </StreamStatePanel>
  );
}
