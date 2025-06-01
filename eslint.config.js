import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // Global ignores
  {
    ignores: [
      "node_modules/",
      ".DS_Store",
      "dist/",
      "dev-dist/",
      "coverage/",
      "*.local",
      "app/assets/builds/",
      "public/vite*/",
    ],
  },

  // Base config for all JS/TS files (including config files at root)
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["app/frontend/**/*"], // Exclude frontend from this generic config
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.es2021 },
    },
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },

  // Specific config for React/TypeScript frontend files (type-aware)
  {
    files: ["app/frontend/**/*.{ts,tsx}", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.eslint.json", // Point to the ESLint-specific tsconfig
      },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["eslint-recommended"].rules,
      ...tsPlugin.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Config for other JS files in app/ (e.g. app/views/pwa/service-worker.js)
  {
    files: ["app/**/*.js"], // General JS files in app/
    ignores: ["app/frontend/**/*", "app/assets/builds/**/*"], // Exclude already handled or build artifacts
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Or 'script' if they are not modules
      globals: { ...globals.browser }, // Or other relevant globals
    },
    rules: {
      ...eslintConfigPrettier.rules,
    },
  },
];
