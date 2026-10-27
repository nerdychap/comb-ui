import type { StreamOptions } from "@/hooks/use-stream";
import { createContext } from "react";

export type StreamContextValue = {
  content: string;
  completedContent: string;
  completedCount: number;
  isLoading: boolean;
  error: string | null;
  startStream: (prompt: string, options?: StreamOptions) => void;
  abortStream: () => void;
  resetStream: () => void;
};

export const StreamContext = createContext<StreamContextValue | null>(null);
