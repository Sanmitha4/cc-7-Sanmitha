import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import tseslint from "typescript-eslint"; // Add this

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended, // This adds TypeScript support
  {
    // Apply Vitest rules to test files
    files: ["**/*.test.{ts,js}", "**/*.spec.{ts,js}"],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals
      }
    }
  }
);