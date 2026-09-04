import { ANSI_ORDER, SYNTAX_KEYS, UI_KEYS, type Hex } from "../palette";
import type { Port } from "./types";

const PER_ROW = 6;
const SWATCH = 148;
const GAP = 12;
const PAD = 22;
const ROW_H = 108;
const TITLE_H = 40;
const WIDTH = PAD * 2 + PER_ROW * SWATCH + (PER_ROW - 1) * GAP;

interface Section {
  title: string;
  entries: Array<[string, Hex]>;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function renderSection(section: Section, top: number, fg: Hex): { svg: string; height: number } {
  const rows = Math.ceil(section.entries.length / PER_ROW);
  const parts = [
    `<text x="${PAD}" y="${top + 22}" fill="${fg}" font-size="18" font-weight="700">${escapeXml(section.title)}</text>`,
  ];
  section.entries.forEach(([label, hex], i) => {
    const x = PAD + (i % PER_ROW) * (SWATCH + GAP);
    const y = top + TITLE_H + Math.floor(i / PER_ROW) * ROW_H;
    parts.push(
      `<rect class="swatch" x="${x}" y="${y}" width="${SWATCH}" height="56" rx="8" fill="${hex}"/>`,
      `<text x="${x}" y="${y + 74}" fill="${fg}" font-size="11">${escapeXml(label)}</text>`,
      `<text x="${x}" y="${y + 90}" fill="${fg}" font-size="11" opacity="0.75">${hex}</text>`,
    );
  });
  return { svg: parts.join("\n"), height: TITLE_H + rows * ROW_H + 8 };
}

export const PREVIEW_WIDTH = WIDTH;

export const preview: Port = {
  id: "preview",
  file: "ports/preview.svg",
  render(p) {
    const sections: Section[] = [
      { title: "UI", entries: UI_KEYS.map((k) => [k, p.ui[k]]) },
      { title: "Syntax", entries: SYNTAX_KEYS.map((k) => [k, p.syntax[k]]) },
      { title: "ANSI", entries: ANSI_ORDER.map((k) => [k, p.ansi[k]]) },
    ];
    let y = PAD;
    const body: string[] = [];
    for (const section of sections) {
      const { svg, height } = renderSection(section, y, p.ui.foreground);
      body.push(svg);
      y += height;
    }
    const height = y + PAD;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">`,
      `<rect width="${WIDTH}" height="${height}" fill="${p.ui.background}"/>`,
      ...body,
      "</svg>",
      "",
    ].join("\n");
  },
};
