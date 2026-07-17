const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");

module.exports = defineConfig([
  globalIgnores(["dist/**", ".expo/**", ".claude/worktrees/**"]),
  expoConfig,
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "import/no-cycle": "error",
    },
  },
]);
