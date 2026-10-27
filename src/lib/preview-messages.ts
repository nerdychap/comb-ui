/**
 * Messages between the app and the sandboxed preview iframe.
 * The iframe has an opaque origin, so both sides check `event.source`
 * instead of `event.origin`.
 */
export type PreviewTheme = "light" | "dark";

export type PreviewRenderMessage = {
  type: "combui:render";
  code: string;
  theme: PreviewTheme;
};

export type PreviewReadyMessage = {
  type: "combui:ready";
};

export type PreviewErrorMessage = {
  type: "combui:error";
  error: string | null;
};

export type PreviewFrameMessage = PreviewReadyMessage | PreviewErrorMessage;

function hasType(data: unknown): data is { type: unknown } {
  return typeof data === "object" && data !== null && "type" in data;
}

export function isPreviewRenderMessage(data: unknown): data is PreviewRenderMessage {
  return (
    hasType(data) &&
    data.type === "combui:render" &&
    typeof (data as PreviewRenderMessage).code === "string" &&
    ((data as PreviewRenderMessage).theme === "light" ||
      (data as PreviewRenderMessage).theme === "dark")
  );
}

export function isPreviewFrameMessage(data: unknown): data is PreviewFrameMessage {
  if (!hasType(data)) {
    return false;
  }

  if (data.type === "combui:ready") {
    return true;
  }

  if (data.type === "combui:error") {
    const { error } = data as PreviewErrorMessage;
    return error === null || typeof error === "string";
  }

  return false;
}
