import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "tests",
    clearMocks: true,
  },
});
