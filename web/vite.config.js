import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is built straight into the repository root so GitHub Pages
// (Deploy from branch → / (root)) serves it without any extra setup.
//   - index.html          → ../index.html
//   - JS/CSS bundles      → ../bundle/
//   - images/video/PDF    → already live in ../assets/ (referenced by path)
export default defineConfig(({ command }) => ({
  base: "./",
  plugins: [react()],
  // In dev, public/assets is a link to ../assets. In the build, nothing is copied.
  publicDir: command === "serve" ? "public" : false,
  build: {
    outDir: "..",
    emptyOutDir: false,
    assetsDir: "bundle",
    target: "es2019",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber"],
          motion: ["gsap", "lenis", "framer-motion"],
        },
      },
    },
  },
}));
