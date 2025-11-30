import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../packs/ui/app/frontend/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../app/frontend"),
          "@ui": path.resolve(__dirname, "../packs/ui/app/frontend"),
          react: path.resolve(__dirname, "../node_modules/react"),
          "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
        },
        dedupe: ["react", "react-dom", "@tanstack/react-query"],
      },
      server: {
        hmr: {
          port: undefined,
          host: undefined,
        },
      },
    });
  },
};

export default config;
