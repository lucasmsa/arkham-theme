import { ANSI_ORDER, hexToUnit, type Hex } from "../palette";
import type { Port } from "./types";

function colorDict(hex: Hex): string {
  const [r, g, b] = hexToUnit(hex);
  return [
    "\t<dict>",
    "\t\t<key>Alpha Component</key>",
    "\t\t<real>1</real>",
    "\t\t<key>Blue Component</key>",
    `\t\t<real>${b}</real>`,
    "\t\t<key>Color Space</key>",
    "\t\t<string>sRGB</string>",
    "\t\t<key>Green Component</key>",
    `\t\t<real>${g}</real>`,
    "\t\t<key>Red Component</key>",
    `\t\t<real>${r}</real>`,
    "\t</dict>",
  ].join("\n");
}

export const iterm2: Port = {
  id: "iterm2",
  file: "ports/iterm2/Arkham.itermcolors",
  render(p) {
    const entries: Array<[string, Hex]> = [
      ...ANSI_ORDER.map((key, index): [string, Hex] => [`Ansi ${index} Color`, p.ansi[key]]),
      ["Background Color", p.ui.background],
      ["Bold Color", p.ansi.brightWhite],
      ["Cursor Color", p.ui.accent],
      ["Cursor Text Color", p.ui.background],
      ["Foreground Color", p.ui.foreground],
      ["Link Color", p.syntax.method],
      ["Selected Text Color", p.ansi.brightWhite],
      ["Selection Color", p.ui.selection],
    ];
    entries.sort(([a], [b]) => (a < b ? -1 : 1));
    const body = entries.map(([key, hex]) => `\t<key>${key}</key>\n${colorDict(hex)}`).join("\n");
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      '<plist version="1.0">',
      "<dict>",
      body,
      "</dict>",
      "</plist>",
      "",
    ].join("\n");
  },
};
