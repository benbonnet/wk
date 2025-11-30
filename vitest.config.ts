import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const aliases: Record<string, string> = {
  "@ui/": `${path.resolve(dirname, "./packs/ui/app/frontend/")}/`,
  "packs/ui/app/frontend/": `${path.resolve(dirname, "./packs/ui/app/frontend/")}/`,
  "@storybook-decorators": `${path.resolve(dirname, ".storybook/decorators.tsx")}`,
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliases,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    exclude: [
      "**/node_modules/**",
      "**/public/**",
      "**/tmp/**",
      ".claude/**",
      "**/*.stories.tsx",
    ],
    projects: [
      {
        extends: false,
        plugins: [react()],
        resolve: {
          alias: aliases,
        },
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          include: [
            "packs/**/*.test.{ts,tsx}",
            "app/frontend/**/*.test.{ts,tsx}",
          ],
          exclude: [
            "**/node_modules/**",
            "**/public/**",
            "**/tmp/**",
            ".claude/**",
            "**/*.stories.tsx",
          ],
        },
      },
      {
        extends: false,
        plugins: [
          react(),
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        resolve: {
          alias: aliases,
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
