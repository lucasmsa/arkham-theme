import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const ROOT = resolve(import.meta.dirname, "..");

export type Hex = `#${string}`;

export const UI_KEYS = [
  "background",
  "foreground",
  "sidebar",
  "statusBar",
  "tabInactive",
  "tabHover",
  "input",
  "dropdown",
  "selection",
  "selectionHighlight",
  "wordHighlight",
  "findMatch",
  "lineNumber",
  "listHover",
  "listInactiveSelection",
  "button",
  "buttonHover",
  "accent",
  "activityForeground",
  "titleForeground",
  "sidebarHeaderBorder",
  "sidebarBorder",
  "ignored",
] as const;

export const SYNTAX_KEYS = [
  "keyword",
  "function",
  "class",
  "string",
  "constant",
  "tag",
  "invalid",
  "method",
  "regexp",
  "variable",
  "attribute",
  "type",
  "inserted",
  "changed",
  "comment",
] as const;

export const ANSI_ORDER = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "brightBlack",
  "brightRed",
  "brightGreen",
  "brightYellow",
  "brightBlue",
  "brightMagenta",
  "brightCyan",
  "brightWhite",
] as const;

export type UiKey = (typeof UI_KEYS)[number];
export type SyntaxKey = (typeof SYNTAX_KEYS)[number];
export type AnsiKey = (typeof ANSI_ORDER)[number];

export interface Palette {
  name: string;
  author: string;
  ui: Record<UiKey, Hex>;
  syntax: Record<SyntaxKey, Hex>;
  ansi: Record<AnsiKey, Hex>;
}

export function loadPalette(): Palette {
  return JSON.parse(readFileSync(resolve(ROOT, "palette.json"), "utf8")) as Palette;
}

export function hexToRgb(hex: Hex): [number, number, number] {
  const h = hex.slice(1, 7);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function hexToUnit(hex: Hex): [number, number, number] {
  return hexToRgb(hex).map((c) => Number((c / 255).toFixed(4))) as [number, number, number];
}

export function hexToHsl(hex: Hex): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, round2(l)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [round2(h / 6), round2(s), round2(l)];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function linearChannel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: Hex): number {
  const [r, g, b] = hexToRgb(hex).map(linearChannel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: Hex, b: Hex): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
