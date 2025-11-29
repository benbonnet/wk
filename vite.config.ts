import { defineConfig } from "vite";
import RubyPlugin from "vite-plugin-ruby";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), RubyPlugin()],
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "./app/frontend/")}/`,
      "@ui/form": path.resolve(__dirname, "./packs/ui/app/frontend/lib/form/index.ts"),
      "@ui/adapters/": `${path.resolve(__dirname, "./packs/ui/app/frontend/adapters/")}/`,
      "@ui": path.resolve(__dirname, "./packs/ui/app/frontend/lib/index.ts"),
      "@ui/": `${path.resolve(__dirname, "./packs/ui/app/frontend/lib/")}/`,
      "@ui-components/": `${path.resolve(__dirname, "./packs/ui/app/frontend/components/")}/`,
    },
  },
});
