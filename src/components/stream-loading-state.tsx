const PANEL_BG = "#18181b";
const PANEL_BORDER = "#3f3f46";

export default function StreamLoadingState() {
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