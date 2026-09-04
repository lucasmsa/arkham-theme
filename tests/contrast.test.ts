import { describe, expect, it } from "vitest";
import { ANSI_ORDER, contrastRatio, loadPalette } from "../src/palette";

const palette = loadPalette();
const bg = palette.ui.background;

describe("ANSI colors stay legible on the Arkham background", () => {
  const textColors = ANSI_ORDER.filter((key) => key !== "black");

  for (const key of textColors) {
    it(`ansi.${key} reaches 4.5:1 against ${bg}`, () => {
      expect(contrastRatio(palette.ansi[key], bg)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("ansi.black is the background slot and sits close to the background", () => {
    expect(contrastRatio(palette.ansi.black, bg)).toBeLessThan(1.5);
  });

  it("foreground reaches 4.5:1 against the background", () => {
    expect(contrastRatio(palette.ui.foreground, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("brightBlack, the dim text slot, reaches 4.5:1", () => {
    expect(contrastRatio(palette.ansi.brightBlack, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
