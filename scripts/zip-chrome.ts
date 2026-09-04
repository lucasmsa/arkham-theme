import { ZipArchive } from "archiver";
import { createWriteStream, mkdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "../src/palette";

const target = resolve(ROOT, "dist/arkham-chrome.zip");
mkdirSync(resolve(ROOT, "dist"), { recursive: true });

const output = createWriteStream(target);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on("close", () => {
  console.log(`wrote dist/arkham-chrome.zip (${statSync(target).size} bytes)`);
});
archive.on("error", (error) => {
  throw error;
});

archive.pipe(output);
archive.directory(resolve(ROOT, "ports/chrome"), false);
await archive.finalize();
