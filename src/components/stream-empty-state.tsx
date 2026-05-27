const PANEL_BG = "#18181b";
const PANEL_BORDER = "#3f3f46";

export default function StreamEmptyState() {
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