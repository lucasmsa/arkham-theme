import { ANSI_ORDER } from "../palette";
import type { Port } from "./types";

export const ghostty: Port = {
  id: "ghostty",
  file: "ports/ghostty/Arkham",
  render(p) {
    const lines = ANSI_ORDER.map((key, index) => `palette = ${index}=${p.ansi[key]}`);
    lines.push(
      `background = ${p.ui.background}`,
      `foreground = ${p.ui.foreground}`,
      `cursor-color = ${p.ui.accent}`,
      `cursor-text = ${p.ui.background}`,
      `selection-background = ${p.ui.selection}`,
      `selection-foreground = ${p.ansi.brightWhite}`,
    );
    return lines.join("\n") + "\n";
  },
};
