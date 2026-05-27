"use client";

import { HANDLE_WIDTH, MAX_RATIO, MIN_RATIO } from "@/constants/contants";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type ResizableSplitProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function ResizableSplit({ left, right }: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitRatio, setSplitRatio] = useState(50);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const ratio = (x / rect.width) * 100;

    setSplitRatio(Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio)));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
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
      className="flex flex-1 flex-col gap-4 overflow-hidden lg:flex-row lg:gap-0"
    >
      <div
        className="flex min-h-0 flex-col gap-2 overflow-hidden"
        style={{ flex: `${splitRatio} 1 0%` }}
      >
        {left}
      </div>

      <div
        className="hidden cursor-col-resize items-center justify-center lg:flex"
        style={{ width: HANDLE_WIDTH, minWidth: HANDLE_WIDTH }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="h-16 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
      </div>

      <div
        className="flex min-h-0 flex-col gap-2 overflow-hidden"
        style={{ flex: `${100 - splitRatio} 1 0%` }}
      >
        {right}
      </div>
    </div>
  );
}
