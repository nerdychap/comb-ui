import { useState, useCallback } from "react";

type UseClipboardResult = {
  copyToClipboard: (text: string) => void;
  isCopied: boolean;
};

export function useClipboard(): UseClipboardResult {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  }, []);

  return { copyToClipboard, isCopied };
}