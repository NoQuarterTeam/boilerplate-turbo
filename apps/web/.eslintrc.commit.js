module.exports = {
  extends: ["./.eslintrc.js"],
  plugins: ["simple-import-sort"],
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
    "simple-import-sort/imports": [
      "error",
      { groups: [["^react", "^@?\\w", "^\\u0000"], ["^"], ["^lib?\\w", "^components?\\w"], ["^\\."]] },
    ],
  },
}
