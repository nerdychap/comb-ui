import { createContext } from "react";

export type StreamContextValue = {
  content: string;
  isLoading: boolean;
  error: string | null;
  startStream: (prompt: string) => void;
  abortStream: () => void;
  resetStream: () => void;
};

export const StreamContext = createContext<StreamContextValue | null>(null);
