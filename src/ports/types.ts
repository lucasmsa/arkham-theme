import type { Palette } from "../palette";

export interface BuildMeta {
  version: string;
}

export interface Port {
  id: string;
  file: string;
  render(palette: Palette, meta: BuildMeta): string;
}

export interface Output {
  id: string;
  file: string;
  content: string;
}
