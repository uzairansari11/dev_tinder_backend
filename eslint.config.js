import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import nodePlugin from "eslint-plugin-node";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
      "no-console": "warn",
      "no-process-exit": "warn",
    },
  },
  prettierConfig,
];
