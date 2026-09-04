import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "jsonc-parser";
import { ROOT } from "./palette";

export const THEME_PATH = resolve(ROOT, "themes/Arkham Theme-color-theme.json");

export interface TokenRule {
  name?: string;
  scope?: string | string[];
  settings: { foreground?: string; fontStyle?: string };
}

export interface VsCodeTheme {
  name: string;
  type: string;
  colors: Record<string, string>;
  tokenColors: TokenRule[];
}

export function loadTheme(): VsCodeTheme {
  return parse(readFileSync(THEME_PATH, "utf8"), [], { allowTrailingComma: true }) as VsCodeTheme;
}

/** Last rule wins, as TextMate resolves rules of equal specificity. */
export function tokenForeground(theme: VsCodeTheme, scope: string): string | undefined {
  let found: string | undefined;
  for (const rule of theme.tokenColors) {
    const scopes = Array.isArray(rule.scope) ? rule.scope : rule.scope ? [rule.scope] : [];
    if (scopes.includes(scope) && rule.settings.foreground) found = rule.settings.foreground;
  }
  return found;
}
