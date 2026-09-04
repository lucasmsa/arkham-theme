import { describe, expect, it } from "vitest";
import { ANSI_ORDER, loadPalette, SYNTAX_KEYS, UI_KEYS, type AnsiKey, type SyntaxKey, type UiKey } from "../src/palette";
import { loadTheme, tokenForeground } from "../src/theme";

const palette = loadPalette();
const theme = loadTheme();

const UI_PIN: Record<UiKey, string> = {
  background: "editor.background",
  foreground: "editor.foreground",
  sidebar: "sideBar.background",
  statusBar: "statusBar.background",
  tabInactive: "tab.inactiveBackground",
  tabHover: "tab.hoverBackground",
  input: "input.background",
  dropdown: "dropdown.background",
  selection: "editor.selectionBackground",
  selectionHighlight: "editor.selectionHighlightBackground",
  wordHighlight: "editor.wordHighlightBackground",
  findMatch: "editor.findMatchBackground",
  lineNumber: "editorLineNumber.foreground",
  listHover: "list.hoverBackground",
  listInactiveSelection: "list.inactiveSelectionBackground",
  button: "button.background",
  buttonHover: "button.hoverBackground",
  accent: "tab.activeBorderTop",
  activityForeground: "activityBar.foreground",
  titleForeground: "titleBar.activeForeground",
  sidebarHeaderBorder: "sideBarSectionHeader.border",
  sidebarBorder: "sideBar.border",
  ignored: "gitDecoration.ignoredResourceForeground",
};

const SYNTAX_PIN: Record<SyntaxKey, string> = {
  keyword: "keyword",
  function: "entity.name.function",
  class: "entity.name",
  string: "string",
  constant: "constant.numeric",
  tag: "entity.name.tag",
  invalid: "invalid",
  method: "entity.name.method.js",
  regexp: "string.regexp",
  variable: "variable",
  attribute: "entity.other.attribute-name",
  type: "support.type",
  inserted: "markup.inserted",
  changed: "markup.changed",
  comment: "comment",
};

const ansiThemeKey = (key: AnsiKey) => `terminal.ansi${key[0].toUpperCase()}${key.slice(1)}`;

const lower = (hex: string | undefined) => hex?.toLowerCase();

describe("palette.json is pinned to the hand-tuned VS Code theme", () => {
  it("covers every ui key with a pin", () => {
    expect(Object.keys(UI_PIN).sort()).toEqual([...UI_KEYS].sort());
    expect(Object.keys(palette.ui).sort()).toEqual([...UI_KEYS].sort());
  });

  it("covers every syntax key with a pin", () => {
    expect(Object.keys(SYNTAX_PIN).sort()).toEqual([...SYNTAX_KEYS].sort());
    expect(Object.keys(palette.syntax).sort()).toEqual([...SYNTAX_KEYS].sort());
  });

  it("covers every ansi key", () => {
    expect(Object.keys(palette.ansi).sort()).toEqual([...ANSI_ORDER].sort());
  });

  for (const key of UI_KEYS) {
    it(`ui.${key} equals colors["${UI_PIN[key]}"]`, () => {
      expect(lower(theme.colors[UI_PIN[key]])).toBe(palette.ui[key]);
    });
  }

  for (const key of SYNTAX_KEYS) {
    it(`syntax.${key} equals the last tokenColors rule for "${SYNTAX_PIN[key]}"`, () => {
      expect(lower(tokenForeground(theme, SYNTAX_PIN[key]))).toBe(palette.syntax[key]);
    });
  }

  for (const key of ANSI_ORDER) {
    it(`ansi.${key} equals colors["${ansiThemeKey(key)}"]`, () => {
      expect(lower(theme.colors[ansiThemeKey(key)])).toBe(palette.ansi[key]);
    });
  }

  it("terminal chrome keys derive from ui roles", () => {
    expect(lower(theme.colors["terminal.background"])).toBe(palette.ui.background);
    expect(lower(theme.colors["terminal.foreground"])).toBe(palette.ui.foreground);
    expect(lower(theme.colors["terminal.selectionBackground"])).toBe(palette.ui.selection);
    expect(lower(theme.colors["terminalCursor.foreground"])).toBe(palette.ui.accent);
    expect(lower(theme.colors["terminalCursor.background"])).toBe(palette.ui.background);
  });

  it("every palette value is a 6 or 8 digit lowercase hex", () => {
    const all = [...Object.values(palette.ui), ...Object.values(palette.syntax), ...Object.values(palette.ansi)];
    for (const hex of all) expect(hex).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
  });
});
