# Distribution per target

Date: 2026-09-04

## Context

The theme is on the VS Code Marketplace. Cursor installs from Open VSX, where the `lucasmsa` namespace did not exist. Chrome themes are extensions; the Chrome Web Store requires a one-time developer registration fee. Terminal apps read plain files.

## Decision

- Cursor: publish the same VSIX to Open VSX with `npm run publish:ovsx`, which reads `OVSX_PAT` from the environment. Until published, the README documents installing the VSIX from Releases.
- Chrome: ship the unpacked folder `ports/chrome` and a release zip from `npm run zip:chrome`. No Web Store listing.
- Terminals and Zed: ship files in `ports/` with one-line install steps. Submitting the iTerm2 file to mbadolato/iTerm2-Color-Schemes is the path into Ghostty's and other terminals' built-in scheme lists, done by hand.

## Consequences

- No credentials live in the repo; publishing needs `OVSX_PAT` at run time.
- Chrome users see a Developer mode banner because the theme is unpacked.
- The Marketplace listing is unchanged apart from the terminal colors in 1.14.0.
