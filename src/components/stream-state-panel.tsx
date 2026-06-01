import { PANEL_BG, PANEL_BORDER } from "@/constants/constants";
import type { ReactNode } from "react";

type StreamStatePanelProps = {
  children: ReactNode;
};

export default function StreamStatePanel({ children }: StreamStatePanelProps) {
  return (
    <div
      className="flex flex-1 min-h-0 items-center justify-center rounded-lg border p-4"
      style={{ backgroundColor: PANEL_BG, borderColor: PANEL_BORDER }}
    >
      {children}
    </div>
  );
}
