import PreviewSandbox from "@/components/preview-sandbox";
import { createRoot } from "react-dom/client";

// Entry for public/preview-runtime.js. The sandboxed iframe has an opaque
// origin, and the Next.js dev server blocks /_next requests from that origin,
// so the preview runs from this standalone bundle instead of a Next.js page.
const container = document.getElementById("root");

if (container) {
  createRoot(container).render(<PreviewSandbox />);
}
