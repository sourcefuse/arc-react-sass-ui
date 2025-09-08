/// <reference types="vitest" />
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr(),
    legacy({
      targets: [">0.2%", "not dead", "not op_mini all"],
    }),
    visualizer({
      filename: "stats.html", // generates report
      open: true, // auto-open after build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules/", "src/setupTests.ts"],
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    open: true,
    port: 3000,
  },
});
