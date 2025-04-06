import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticJs from "@stylistic/eslint-plugin-js";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"], plugins: { "@stylistic/js": stylisticJs }, rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/quotes": ["error", "double", { "avoidEscape": true }]
    }
  },
  tseslint.configs.recommended,
]);