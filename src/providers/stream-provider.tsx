"use client";

import { type ReactNode } from "react";
import { useStream } from "@/hooks/use-stream";
import { StreamContext } from "@/context/stream-context";

type StreamProviderProps = {
  children: ReactNode;
};

export function StreamProvider({ children }: StreamProviderProps) {
  const stream = useStream();

  return (
    <StreamContext.Provider value={stream}>
      {children}
    </StreamContext.Provider>
  );
}