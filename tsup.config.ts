import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  format: ["cjs", "esm"],
  target: "es2019",
  entry: ["./src/index.ts"],
  sourcemap: false,
  clean: !options.watch,
  bundle: true,
  minify: !options.watch,
  ...options,
}));
