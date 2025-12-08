import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundariesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      import: importPlugin,
      boundaries: boundariesPlugin,
    },
    settings: {
      "boundaries/include": [
        "app/**/*",
        "features/**/*",
        "components/**/*",
        "hooks/**/*",
        "lib/**/*",
        "shared/**/*",
        "utils/**/*",
      ],
      "boundaries/elements": [
        {
          mode: "full",
          type: "shared",
          pattern: [
            "components/**/*",
            "hooks/**/*",
            "lib/**/*",
            "shared/**/*",
            "utils/**/*",
          ],
        },
        {
          mode: "full",
          type: "feature",
          capture: ["featureName"],
          pattern: ["features/*/**/*"],
        },
        {
          mode: "full",
          type: "app",
          capture: ["_", "fileName"],
          pattern: ["app/**/*"],
        },
      ],
    },
    rules: {
      camelcase: [
        "error",
        {
          ignoreDestructuring: true,
          ignoreImports: true,
          ignoreGlobals: true,
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
            "unknown",
          ],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "boundaries/no-unknown": ["error"],
      "boundaries/no-unknown-files": ["error"],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: ["shared"],
              allow: ["shared"],
            },
            {
              from: ["feature"],
              allow: [
                "shared",
                ["feature", { featureName: "${from.featureName}" }],
              ],
            },
            {
              from: ["app"],
              allow: ["shared", "feature", ["app", { fileName: "*.css" }]],
            },
          ],
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./app/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
            {
              target: "./features/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
            {
              target: "./components/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
            {
              target: "./hooks/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
            {
              target: "./lib/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
            {
              target: "./shared/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
            {
              target: "./utils/**/*",
              from: ["../*", "./*"],
              message: "Use the @ alias instead of relative paths.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Custom ignores
    "components/ui/**/*",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
