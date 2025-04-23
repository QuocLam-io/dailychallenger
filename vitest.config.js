/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    exclude: [
      "**/e2e/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/*.spec.ts",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});