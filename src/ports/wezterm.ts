import { ANSI_ORDER } from "../palette";
import type { Port } from "./types";

const quoteList = (values: string[]) => `[${values.map((v) => `"${v}"`).join(",")}]`;

export const wezterm: Port = {
  id: "wezterm",
  file: "ports/wezterm/arkham.toml",
  render(p) {
    const ansi = ANSI_ORDER.slice(0, 8).map((key) => p.ansi[key]);
    const brights = ANSI_ORDER.slice(8).map((key) => p.ansi[key]);
    return [
      "# Arkham",
      "[colors]",
      `foreground = "${p.ui.foreground}"`,
      `background = "${p.ui.background}"`,
      `cursor_bg = "${p.ui.accent}"`,
      `cursor_border = "${p.ui.accent}"`,
      `cursor_fg = "${p.ui.background}"`,
      `selection_bg = "${p.ui.selection}"`,
      `selection_fg = "${p.ansi.brightWhite}"`,
      "",
      `ansi = ${quoteList(ansi)}`,
      `brights = ${quoteList(brights)}`,
      "",
      "[metadata]",
      `name = "${p.name}"`,
      `author = "${p.author}"`,
      "",
    ].join("\n");
  },
};
