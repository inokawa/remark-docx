import typescript from "@rollup/plugin-typescript";
import { extname, dirname, relative } from 'node:path';
import pkg from "./package.json" with { type: "json" };
import { globSync } from "node:fs";
import { fileURLToPath } from "node:url";

const external = (id) => [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
].some((d) => id.startsWith(d));

export default [{
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: ".",
      declaration: true,
      declarationDir: dirname(pkg.types),
      exclude: ["**/*.{spec,stories}.*"],
    }),
  ],
},
{
  input: Object.fromEntries(
    globSync('src/plugins/*/index.ts').map((file) => [
      relative('./src', file.slice(0, file.length - extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  ),
  output: [
    {
      dir: dirname(pkg.module),
      format: "cjs",
      sourcemap: true,
      entryFileNames: '[name].cjs',
    },
    {
      dir: dirname(pkg.module),
      format: "es",
      sourcemap: true,
      entryFileNames: '[name].js',
    },
  ],
  external,
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: dirname(pkg.module),
      // declaration: true,
      // declarationDir: dirname(pkg.types),
      exclude: ["**/*.{spec,stories}.*"],
    }),
  ],
}];
