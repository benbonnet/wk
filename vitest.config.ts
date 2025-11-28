import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./app/frontend") },
      { find: "@ui-components", replacement: resolve(__dirname, "./packs/ui/app/frontend/components") },
      { find: "@ui/utils", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/utils.ts") },
      { find: "@ui/provider", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/provider.tsx") },
      { find: "@ui/registry", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/registry.ts") },
      { find: "@ui/types", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/types.ts") },
      { find: "@ui/renderer", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/renderer.tsx") },
      { find: "@ui/resolver", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/resolver.ts") },
      { find: "@ui", replacement: resolve(__dirname, "./packs/ui/app/frontend/lib/index.ts") },
    ],
  },
});
