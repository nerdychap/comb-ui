import { StreamContext, type StreamContextValue } from "@/context/stream-context";
import { useContext } from "react";

export function useStreamContext(): StreamContextValue {
  const ctx = useContext(StreamContext);

  if (!ctx) {
    throw new Error("useStreamContext must be used within a <StreamProvider>");
  }

  return ctx;
}
