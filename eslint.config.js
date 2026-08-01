import js from "@eslint/js"
import svelte from "eslint-plugin-svelte"
import tseslint from "typescript-eslint"
import globals from "globals"

export default tseslint.config(
  { ignores: ["dist", ".wrangler", "worker/worker-configuration.d.ts"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  svelte.configs["flat/recommended"],
  svelte.configs["flat/prettier"],
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["src/**/*.{ts,svelte}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
)
