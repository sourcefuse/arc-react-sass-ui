import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["**/*.test.tsx"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,ts,tsx}"],
    rules: {
      // React rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-empty": "off",
    },
  },
]);
