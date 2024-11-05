import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },

  plugins: [react()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["qr-scanner"],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    global: "globalThis",
    'process.env': {},
  },
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
      buffer: 'buffer',
    },
  },

  server: {
    https: {
      key: readFileSync(resolve(__dirname, "./tma.internal-key.pem")),
      cert: readFileSync(resolve(__dirname, "./tma.internal.pem")),
    },
  },
});
