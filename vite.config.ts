import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  clearScreen: false,
  plugins: [react(), tailwindcss(), RubyPlugin()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ["vite", "localhost", ".nvoi.dev", "127.0.0.1"],
  },
  resolve: {
    alias: {
      "@ui/": `${path.resolve(__dirname, "./packs/ui/app/frontend/")}/`,
      "packs/ui/app/frontend/": `${path.resolve(__dirname, "./packs/ui/app/frontend/")}/`,
    },
  },
});
