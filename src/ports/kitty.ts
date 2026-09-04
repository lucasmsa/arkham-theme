import { ANSI_ORDER } from "../palette";
import type { Port } from "./types";

export const kitty: Port = {
  id: "kitty",
  file: "ports/kitty/arkham.conf",
  render(p) {
    return [
      "# Arkham",
      ...ANSI_ORDER.map((key, index) => `color${index} ${p.ansi[key]}`),
      `background ${p.ui.background}`,
      `foreground ${p.ui.foreground}`,
      `cursor ${p.ui.accent}`,
      `cursor_text_color ${p.ui.background}`,
      `selection_background ${p.ui.selection}`,
      `selection_foreground ${p.ansi.brightWhite}`,
      "",
    ].join("\n");
  },
};
