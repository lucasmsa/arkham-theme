import type { Port } from "./types";

const NORMAL = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const;

export const alacritty: Port = {
  id: "alacritty",
  file: "ports/alacritty/arkham.toml",
  render(p) {
    const bright = (name: (typeof NORMAL)[number]) =>
      p.ansi[`bright${name[0].toUpperCase()}${name.slice(1)}` as keyof typeof p.ansi];
    return [
      "# Arkham",
      "",
      "[colors.primary]",
      `background = '${p.ui.background}'`,
      `foreground = '${p.ui.foreground}'`,
      "",
      "[colors.cursor]",
      `text = '${p.ui.background}'`,
      `cursor = '${p.ui.accent}'`,
      "",
      "[colors.selection]",
      `text = '${p.ansi.brightWhite}'`,
      `background = '${p.ui.selection}'`,
      "",
      "[colors.normal]",
      ...NORMAL.map((name) => `${name} = '${p.ansi[name]}'`),
      "",
      "[colors.bright]",
      ...NORMAL.map((name) => `${name} = '${bright(name)}'`),
      "",
    ].join("\n");
  },
};
