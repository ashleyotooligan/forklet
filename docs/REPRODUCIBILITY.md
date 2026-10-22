# Reproduce the package

## Dependency-free path

Runtime, state replay, experiment generation, standalone build and tests use only Node's standard library. The prepared package was checked with Node.js 24.19.0. The source targets Node 20 or newer; the included CI workflow uses Node 24.

```sh
npm run experiments
npm run build
npm test
npm run check
```

`npm run experiments` writes the full default trace, the 48-run reference study, three JSON examples, and a result table. `npm run build` embeds source, two artwork images and reference data in `Forklet.html`.

## Optional figure regeneration

Only PNG generation needs a native Canvas implementation. It is deliberately not a runtime dependency:

```sh
npm install --no-save --package-lock=false @napi-rs/canvas
npm run screenshots
```

The capture script expects DejaVu Sans, DejaVu Serif and DejaVu Sans Mono TTF files. On systems where those fonts are in another directory, set `FORKLET_FONT_DIR` to that directory. The default is `/usr/share/fonts/truetype/dejavu`. Fonts are referenced, not redistributed in this package.

For a renderer installed in another location, `FORKLET_CANVAS_MODULE` may point to its module entry. These two variables are optional capture-tool settings, not credentials. The browser uses local font fallbacks when DejaVu is unavailable.

The prepared PNGs were rendered with `@napi-rs/canvas`. Renderer, font or platform changes can change pixels even when data is identical. The figures are deterministic from the declared run within the prepared rendering environment, not promised byte-identical across all systems.

## Integrity

```sh
node scripts/checksums.mjs --verify
```

This checks every file listed in `MANIFEST.sha256` and detects missing, modified or newly added package files. The manifest excludes itself and ignores local Git metadata and `node_modules/`.

After intentionally changing source or assets, regenerate outputs, review them, run the checks, and finally refresh the manifest:

```sh
node scripts/checksums.mjs
```

SHA-256 here checks local file integrity. It is not an author signature, chain anchor or scientific validation.

## Validation boundary

The included UI harness validates offline boot, control wiring, plate selection, exports and error handling with a simulated DOM. It is not Chromium, Firefox or Safari. PNGs are inspected through the native renderer. A browser-engine accessibility and cross-platform compatibility pass remains a separate release task.
