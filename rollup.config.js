import typescript from "@rollup/plugin-typescript";
import { extname, dirname, relative } from 'node:path';
import pkg from "./package.json" with { type: "json" };
import { globSync } from "node:fs";
import { fileURLToPath } from "node:url";

const external = (id) => [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
].some((d) => id.startsWith(d));

const publishDir = dirname(pkg.module)

export default {
  input: Object.fromEntries(
    ["src/index.ts", ...globSync('src/plugins/*/index.ts')].map((file) => [
      relative('./src', file.slice(0, file.length - extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  ),
  output: [
    {
      dir: publishDir,
      format: "cjs",
      sourcemap: true,
      entryFileNames: '[name].cjs',
    },
    {
      dir: publishDir,
      format: "es",
      sourcemap: true,
      entryFileNames: '[name].js',
    },
  ],
  external,
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      rootDir: "./src",
      outDir: publishDir,
      declaration: true,
      declarationDir: publishDir,
      exclude: ["**/*.{spec,stories}.*"],
    }),
  ],
}
