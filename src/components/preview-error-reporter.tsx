"use client";

import { useContext, useEffect } from "react";
import { LiveContext } from "react-live";

type PreviewErrorReporterProps = {
  onError: (error: string | null) => void;
};

export default function PreviewErrorReporter({ onError }: PreviewErrorReporterProps) {
  const { error } = useContext(LiveContext);

  useEffect(() => {
    onError(error ?? null);
  }, [error, onError]);

  return null;
}
