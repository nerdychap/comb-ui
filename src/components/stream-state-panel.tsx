import { PANEL_BG, PANEL_BORDER } from "@/constants/constants";
import type { ReactNode } from "react";

type StreamStatePanelProps = {
  children: ReactNode;
};

export default function StreamStatePanel({ children }: StreamStatePanelProps) {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center"
      style={{ backgroundColor: PANEL_BG, borderColor: PANEL_BORDER }}
    >
      {children}
    </div>
  );
}
