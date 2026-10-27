"use client";

import { HANDLE_WIDTH, MAX_RATIO, MIN_RATIO } from "@/constants/constants";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type ResizableSplitProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function ResizableSplit({ left, right }: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const ratio = (x / rect.width) * 100;

    setSplitRatio(Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio)));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSplitRatio((ratio) => Math.max(MIN_RATIO, ratio - 4));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSplitRatio((ratio) => Math.min(MAX_RATIO, ratio + 4));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden md:flex-row md:gap-0"
    >
      <div className="flex min-h-0 flex-col overflow-hidden" style={{ flex: `${splitRatio} 1 0%` }}>
        {left}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize code and preview panels"
        aria-valuemin={MIN_RATIO}
        aria-valuemax={MAX_RATIO}
        aria-valuenow={Math.round(splitRatio)}
        tabIndex={0}
        className="group hidden cursor-col-resize items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
        style={{ width: HANDLE_WIDTH, minWidth: HANDLE_WIDTH }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`h-12 w-1 rounded-full transition-colors ${
            isDragging
              ? "bg-accent"
              : "bg-zinc-300 group-focus-visible:bg-accent hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500"
          }`}
        />
      </div>

      <div
        className="order-first flex min-h-0 flex-col overflow-hidden md:order-none"
        style={{ flex: `${100 - splitRatio} 1 0%` }}
      >
        {right}
      </div>
    </div>
  );
}
