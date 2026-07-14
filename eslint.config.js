import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/test/**",
      "**/*.test.ts"
    ]
  },

  js.configs.recommended,

  // Node Config Files
  {
    files: [
      "*.config.js",
      "*.config.ts",
      "vite.config.ts"
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },

  // Browser
  {
    files: ["src/**/*.{ts,js}"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // TypeScript
  {
    files: ["**/*.ts"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  }
];
