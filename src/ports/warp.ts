import type { Port } from "./types";

const NORMAL = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] as const;

export const warp: Port = {
  id: "warp",
  file: "ports/warp/arkham.yaml",
  render(p) {
    const bright = (name: (typeof NORMAL)[number]) =>
      p.ansi[`bright${name[0].toUpperCase()}${name.slice(1)}` as keyof typeof p.ansi];
    return [
      `name: ${p.name}`,
      `accent: '${p.ui.accent}'`,
      `cursor: '${p.ui.accent}'`,
      `background: '${p.ui.background}'`,
      `foreground: '${p.ui.foreground}'`,
      "details: darker",
      "terminal_colors:",
      "  normal:",
      ...NORMAL.map((name) => `    ${name}: '${p.ansi[name]}'`),
      "  bright:",
      ...NORMAL.map((name) => `    ${name}: '${bright(name)}'`),
      "",
    ].join("\n");
  },
};
