import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // The only large chunk is the Three.js runtime that powers the
    // continuous 3D environment. Its compressed transfer is ~130 kB.
    chunkSizeWarningLimit: 550
  }
});
