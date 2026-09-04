import type { Palette } from "../palette";
import { alacritty } from "./alacritty";
import { chrome } from "./chrome";
import { ghostty } from "./ghostty";
import { iterm2 } from "./iterm2";
import { kitty } from "./kitty";
import { preview } from "./preview";
import type { BuildMeta, Output, Port } from "./types";
import { warp } from "./warp";
import { wezterm } from "./wezterm";
import { zed } from "./zed";

export const PORTS: Port[] = [chrome, ghostty, iterm2, alacritty, kitty, wezterm, zed, warp, preview];

export function renderAll(palette: Palette, meta: BuildMeta): Output[] {
  return PORTS.map((port) => ({ id: port.id, file: port.file, content: port.render(palette, meta) }));
}

export type { BuildMeta, Output, Port };
