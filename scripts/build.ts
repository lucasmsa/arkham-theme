import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadPalette, ROOT } from "../src/palette";
import { renderAll } from "../src/ports";
import { PREVIEW_WIDTH } from "../src/ports/preview";

export const PREVIEW_PNG = "ports/preview.png";
export const PREVIEW_PNG_WIDTH = PREVIEW_WIDTH * 2;

function loadMeta() {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8")) as { version: string };
  return { version: pkg.version };
}

function write(file: string, content: string | Buffer) {
  const target = resolve(ROOT, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  console.log(`wrote ${file}`);
}

const outputs = renderAll(loadPalette(), loadMeta());
for (const { file, content } of outputs) write(file, content);

const svg = outputs.find((o) => o.id === "preview")!.content;
const png = new Resvg(svg, {
  fitTo: { mode: "width", value: PREVIEW_PNG_WIDTH },
  font: { loadSystemFonts: true, defaultFontFamily: "Menlo" },
})
  .render()
  .asPng();
write(PREVIEW_PNG, Buffer.from(png));
