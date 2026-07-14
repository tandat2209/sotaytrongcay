module.exports = {
  moduleNameMapper: {
    "^lucide-react-native$":
      "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
  },
  preset: "jest-expo",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "<rootDir>/.claude/",
    "test-workspace.ts",
  ],
};
