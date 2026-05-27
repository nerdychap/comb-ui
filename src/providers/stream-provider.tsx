"use client";

import { StreamContext } from "@/context/stream-context";
import { useStream } from "@/hooks/use-stream";
import { type ReactNode } from "react";

type StreamProviderProps = {
  children: ReactNode;
};

export function StreamProvider({ children }: StreamProviderProps) {
  const stream = useStream();

  return <StreamContext.Provider value={stream}>{children}</StreamContext.Provider>;
}
