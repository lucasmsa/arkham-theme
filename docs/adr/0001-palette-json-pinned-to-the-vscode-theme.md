# Palette JSON pinned to the hand-tuned VS Code theme

Date: 2026-09-04

## Context

The VS Code theme is one hand-authored JSON with 55 workbench colors and 65 token rules, tuned over 13 releases. Ports to other apps need the same colors, and each port needs a short list of roles (background, foreground, accent, 16 ANSI colors), not the full VS Code vocabulary. Two sources of truth drift; regenerating the VS Code theme from templates would re-express every tuned rule.

## Decision

`palette.json` holds the role-level palette: 23 UI roles, 15 syntax roles, 16 ANSI colors. Its UI and syntax values are extracted from the theme JSON, not the other way round. A vitest suite pins every palette value to its origin: each UI role to a `colors` key, each syntax role to the last `tokenColors` rule for a named scope, each ANSI color to the matching `terminal.ansi*` key. The VS Code theme stays hand-tuned.

## Consequences

- Changing a color means editing the theme JSON and `palette.json` together, or the pin test fails.
- The theme JSON gained 20 terminal keys (16 ANSI plus foreground, selection, cursor) because it had none and every terminal port needs them.
- ANSI colors were designed, not extracted. All 15 text slots reach at least 4.5:1 contrast on `#161526`; black is the background slot and is exempt.
