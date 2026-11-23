import { it, expect } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import Zip from "adm-zip";

const rootDir = path.join(__dirname, "..");

// `--use remark-docx` resolves to built `lib` of this package, so run `npm run build` before `npm run test:cli`.
it("cli", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "remark-docx-"));
  try {
    const output = path.join(tmpDir, "output.docx");
    await promisify(execFile)(
      process.execPath,
      [
        path.join(rootDir, "node_modules/remark-cli/cli.js"),
        path.join(rootDir, "fixtures/heading.md"),
        "--use",
        "remark-docx",
        "--output",
        output,
      ],
      { cwd: rootDir },
    );

    // check that binary is written without corruption
    const zip = new Zip(await fs.readFile(output));
    expect(zip.getEntry("word/document.xml")).toBeTruthy();
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

it("cli with image option", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "remark-docx-"));
  try {
    const output = path.join(tmpDir, "output.docx");
    await promisify(execFile)(
      process.execPath,
      [
        path.join(rootDir, "node_modules/remark-cli/cli.js"),
        "fixtures/image-data-uri.md",
        "--use",
        "remark-docx=image:true",
        "--output",
        output,
      ],
      { cwd: rootDir },
    );

    const zip = new Zip(await fs.readFile(output));
    expect(
      zip.getEntries().some((e) => e.entryName.startsWith("word/media/")),
    ).toBe(true);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
