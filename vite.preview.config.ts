import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Builds the standalone runtime that public/preview.html loads in the
// sandboxed preview iframe. Run with `npm run build:preview`.
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/preview-runtime/main.tsx"),
      name: "CombUIPreview",
      formats: ["iife"],
      fileName: () => "preview-runtime.js",
    },
  },
});
