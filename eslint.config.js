import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  // Adapters and lib files intentionally export contexts and helpers alongside components
  {
    files: [
      "**/adapters/**/*.{ts,tsx}",
      "**/lib/provider.tsx",
      "**/components/badge.tsx",
      "**/components/button.tsx",
      "**/components/form.tsx",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  // TanStack Table returns functions that can't be memoized - this is expected
  {
    files: ["**/table.tsx"],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
);
