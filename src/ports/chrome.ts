import { hexToHsl, hexToRgb } from "../palette";
import type { Port } from "./types";

/**
 * Key sets copied from chrome/browser/themes/browser_theme_pack.cc
 * (kOverwritableColorTable, kTintTable, kDisplayProperties).
 */
export const CHROME_COLOR_KEYS = [
  "background_tab",
  "background_tab_inactive",
  "background_tab_incognito",
  "background_tab_incognito_inactive",
  "bookmark_text",
  "button_background",
  "frame",
  "frame_inactive",
  "frame_incognito",
  "frame_incognito_inactive",
  "ntp_background",
  "ntp_header",
  "ntp_link",
  "ntp_text",
  "omnibox_background",
  "omnibox_text",
  "tab_background_text",
  "tab_background_text_inactive",
  "tab_background_text_incognito",
  "tab_background_text_incognito_inactive",
  "tab_text",
  "toolbar",
  "toolbar_button_icon",
  "toolbar_text",
] as const;

export const CHROME_TINT_KEYS = [
  "background_tab",
  "buttons",
  "frame",
  "frame_inactive",
  "frame_incognito",
  "frame_incognito_inactive",
] as const;

export const CHROME_PROPERTY_KEYS = ["ntp_background_alignment", "ntp_background_repeat", "ntp_logo_alternate"] as const;

export const chrome: Port = {
  id: "chrome",
  file: "ports/chrome/manifest.json",
  render(p, meta) {
    const manifest = {
      manifest_version: 3,
      name: p.name,
      version: meta.version,
      description: "Arkham: a purplish dark theme, ported from the VS Code theme of the same name.",
      theme: {
        colors: {
          frame: hexToRgb(p.ui.statusBar),
          frame_inactive: hexToRgb(p.ui.statusBar),
          background_tab: hexToRgb(p.ui.tabInactive),
          background_tab_inactive: hexToRgb(p.ui.tabInactive),
          toolbar: hexToRgb(p.ui.background),
          tab_text: hexToRgb(p.ui.foreground),
          tab_background_text: hexToRgb(p.ui.lineNumber),
          tab_background_text_inactive: hexToRgb(p.ui.lineNumber),
          bookmark_text: hexToRgb(p.ui.foreground),
          toolbar_text: hexToRgb(p.ui.foreground),
          toolbar_button_icon: hexToRgb(p.ui.activityForeground),
          omnibox_background: hexToRgb(p.ui.input),
          omnibox_text: hexToRgb(p.ui.foreground),
          ntp_background: hexToRgb(p.ui.background),
          ntp_text: hexToRgb(p.ui.foreground),
          ntp_link: hexToRgb(p.syntax.method),
          ntp_header: hexToRgb(p.ui.sidebar),
          button_background: hexToRgb(p.ui.button),
        },
        tints: {
          buttons: hexToHsl(p.ui.activityForeground),
        },
        properties: {
          ntp_logo_alternate: 1,
        },
      },
    };
    return JSON.stringify(manifest, null, 2) + "\n";
  },
};
