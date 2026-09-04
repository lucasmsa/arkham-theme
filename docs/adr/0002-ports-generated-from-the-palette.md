# Ports generated from the palette

Date: 2026-09-04

## Context

Eight target formats (Chrome manifest, Ghostty, iTerm2 plist, Alacritty TOML, Kitty conf, WezTerm TOML, Zed JSON, Warp YAML) each map the same roles into a different syntax. Hand-maintaining eight files invites drift.

## Decision

`scripts/build.ts` renders every port from `palette.json` into `ports/`. Each port is a small renderer with a fixed output path. Tests cover three things per port: the file on disk equals the render (stale output fails), a snapshot, and one structural check in the target's own terms (Chrome keys against the Chromium color, tint and property tables; Ghostty palette 0..15; iTerm2 components in 0..1 plus `plutil -lint`; Alacritty and WezTerm parsed as TOML; Warp parsed as YAML; Zed validated with ajv against the vendored v0.2.0 schema).

## Consequences

- Adding a target means one renderer file plus one structural test.
- `ports/` is committed so users can copy files without running Node.
- `schemas/zed-theme-v0.2.0.json` is vendored; the Zed port must be re-validated when the schema URL changes.
