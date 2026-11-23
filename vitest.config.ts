import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "src",
    clearMocks: true,
    projects: [
      {
        extends: true,
        test: { name: "unit", exclude: ["**/node_modules/**", "cli.spec.ts"] },
      },
      {
        // requires `npm run build` before running
        extends: true,
        test: { name: "cli", include: ["cli.spec.ts"] },
      },
    ],
  },
});
