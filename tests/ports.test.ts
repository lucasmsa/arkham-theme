import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parse as parseToml } from "smol-toml";
import { describe, expect, it } from "vitest";
import { parse as parseYaml } from "yaml";
import { ANSI_ORDER, loadPalette, ROOT, SYNTAX_KEYS, UI_KEYS } from "../src/palette";
import { renderAll } from "../src/ports";
import { CHROME_COLOR_KEYS, CHROME_PROPERTY_KEYS, CHROME_TINT_KEYS } from "../src/ports/chrome";
import { PREVIEW_WIDTH } from "../src/ports/preview";

const palette = loadPalette();
const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8")) as { version: string };
const outputs = renderAll(palette, { version: pkg.version });
const byId = Object.fromEntries(outputs.map((o) => [o.id, o.content]));

const HEX = /^#[0-9a-f]{6}$/;

describe("ports/ on disk matches the generator", () => {
  for (const output of outputs) {
    it(`${output.file} is not stale (run npm run build)`, () => {
      expect(existsSync(resolve(ROOT, output.file))).toBe(true);
      expect(readFileSync(resolve(ROOT, output.file), "utf8")).toBe(output.content);
    });
  }
});

describe("snapshots", () => {
  for (const output of outputs) {
    it(output.id, () => {
      expect(output.content).toMatchSnapshot();
    });
  }
});

describe("chrome", () => {
  const manifest = JSON.parse(byId.chrome);
  it("is a manifest v3 theme whose keys exist in Chromium's tables", () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.version).toBe(pkg.version);
    for (const [key, value] of Object.entries<number[]>(manifest.theme.colors)) {
      expect(CHROME_COLOR_KEYS).toContain(key);
      expect(value).toHaveLength(3);
      for (const c of value) expect(Number.isInteger(c) && c >= 0 && c <= 255).toBe(true);
    }
    for (const [key, value] of Object.entries<number[]>(manifest.theme.tints)) {
      expect(CHROME_TINT_KEYS).toContain(key);
      expect(value).toHaveLength(3);
      for (const c of value) expect(c >= -1 && c <= 1).toBe(true);
    }
    for (const key of Object.keys(manifest.theme.properties)) expect(CHROME_PROPERTY_KEYS).toContain(key);
  });
});

describe("ghostty", () => {
  it("defines palette 0..15 plus the six window colors", () => {
    const lines = byId.ghostty.trimEnd().split("\n");
    const paletteLines = lines.filter((l) => l.startsWith("palette = "));
    expect(paletteLines.map((l) => Number(l.match(/^palette = (\d+)=/)![1]))).toEqual([...Array(16).keys()]);
    for (const key of ["background", "foreground", "cursor-color", "cursor-text", "selection-background", "selection-foreground"]) {
      expect(lines.some((l) => l.startsWith(`${key} = #`))).toBe(true);
    }
  });
});

describe("iterm2", () => {
  it("has 16 Ansi colors with sRGB components in 0..1", () => {
    const ansiKeys = [...byId.iterm2.matchAll(/<key>Ansi (\d+) Color<\/key>/g)].map((m) => Number(m[1]));
    expect([...ansiKeys].sort((a, b) => a - b)).toEqual([...Array(16).keys()]);
    const reals = [...byId.iterm2.matchAll(/<real>([\d.]+)<\/real>/g)].map((m) => Number(m[1]));
    expect(reals.length).toBe(24 * 4);
    for (const r of reals) expect(r >= 0 && r <= 1).toBe(true);
    expect((byId.iterm2.match(/<string>sRGB<\/string>/g) ?? []).length).toBe(24);
  });

  it("passes plutil -lint when plutil is available", () => {
    const file = join(tmpdir(), "arkham-test.itermcolors");
    writeFileSync(file, byId.iterm2);
    try {
      execFileSync("plutil", ["-lint", file], { stdio: "pipe" });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") return;
      throw error;
    }
  });
});

describe("alacritty", () => {
  it("parses as TOML with the five color tables", () => {
    const doc = parseToml(byId.alacritty) as { colors: Record<string, Record<string, string>> };
    expect(Object.keys(doc.colors).sort()).toEqual(["bright", "cursor", "normal", "primary", "selection"]);
    for (const table of ["normal", "bright"]) {
      expect(Object.keys(doc.colors[table]).sort()).toEqual(["black", "blue", "cyan", "green", "magenta", "red", "white", "yellow"]);
      for (const hex of Object.values(doc.colors[table])) expect(hex).toMatch(HEX);
    }
  });
});

describe("kitty", () => {
  it("defines color0..15 and the six window colors", () => {
    const keys = byId.kitty
      .split("\n")
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => l.split(" ")[0]);
    const expected = [...Array(16).keys()].map((i) => `color${i}`);
    expected.push("background", "foreground", "cursor", "cursor_text_color", "selection_background", "selection_foreground");
    expect(keys).toEqual(expected);
  });
});

describe("wezterm", () => {
  it("parses as TOML with 8 ansi and 8 brights", () => {
    const doc = parseToml(byId.wezterm) as { colors: { ansi: string[]; brights: string[] }; metadata: { name: string } };
    expect(doc.colors.ansi).toHaveLength(8);
    expect(doc.colors.brights).toHaveLength(8);
    for (const hex of [...doc.colors.ansi, ...doc.colors.brights]) expect(hex).toMatch(HEX);
    expect(doc.metadata.name).toBe(palette.name);
  });
});

describe("warp", () => {
  it("parses as YAML with normal and bright terminal colors", () => {
    const doc = parseYaml(byId.warp) as { details: string; terminal_colors: Record<string, Record<string, string>> };
    expect(doc.details).toBe("darker");
    for (const group of ["normal", "bright"]) {
      expect(Object.keys(doc.terminal_colors[group])).toEqual(["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]);
    }
  });
});

describe("preview.svg", () => {
  it("draws one swatch per palette entry", () => {
    const swatches = (byId.preview.match(/class="swatch"/g) ?? []).length;
    expect(swatches).toBe(UI_KEYS.length + SYNTAX_KEYS.length + ANSI_ORDER.length);
  });
});

describe("preview.png", () => {
  it("exists at twice the SVG width for the README (vsce rejects SVG images)", () => {
    const png = readFileSync(resolve(ROOT, "ports/preview.png"));
    expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    expect(png.readUInt32BE(16)).toBe(PREVIEW_WIDTH * 2);
  });
});
