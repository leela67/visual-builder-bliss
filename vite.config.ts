import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use root path for Docker deployment, GitHub Pages path for production
  base: mode === 'production' ? "/" : "/visual-builder-bliss/",
  build: {
    outDir: "docs",
    rollupOptions: {
      external: ['mongoose', 'fs', 'path']
    }
  },
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
