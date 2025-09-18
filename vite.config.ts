import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        outDir: "dist",
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                  return 'frenzy-ai-widget.css'  // 👈 your custom name
                }
                return '[name][extname]'
            },
            entryFileNames: "frenzy-ai-widget.js",
          },
        },
    },
});
