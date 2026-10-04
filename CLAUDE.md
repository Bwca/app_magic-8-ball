# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Magic 8 Ball web app / PWA / Chrome extension built with TypeScript and Parcel 1.x. Clicking the ball (or shaking a mobile device) shows a random answer. It can render as a 3D ball (`src/renderer/three-renderer/`, using `three` + `@tweenjs/tween.js` directly), a plain HTML/CSS ball (`src/renderer/html-renderer/`), or (unfinished) an HTML5 canvas ball.

## Commands

- `npm start` — run the dev server via Parcel (`parcel ./src/index.html`).
- `npm run build` — production build: `parcel build src/index.html --public-url './' --no-minify --no-source-maps`, output in `dist/`.
- `npm test` — run the test suite with `testyts` (config in `testy.json`, picks up `**/*.spec.ts`).
- `npm run deploy` — publish `dist/` to GitHub Pages via `gh-pages`.
- `npm run css-types` — generate typed definitions for SCSS modules via `css-types`.

There is no lint script wired into `package.json`; run `npx tslint -p tsconfig.json` directly if linting is needed (rules in `tslint.json`, extends `tslint:recommended`, plus a custom import ordering rule: node_modules imports before relative imports, case-insensitive sort).

### Running a single test

`testyts` runs via the `testy.json` include glob (`**/*.spec.ts`), so there isn't a built-in single-file filter. To run one spec file directly:

```
npx testyts --include "src/configuration/insert-answer-line-breaks/insert-answer-line-breaks.function.spec.ts"
```

Specs live alongside their source files, e.g. `insert-answer-line-breaks.function.spec.ts` next to `insert-answer-line-breaks.function.ts`.

## Architecture

### Startup flow (`src/index.ts`)

On `DOMContentLoaded`: register the service worker (`initPwa`) → read config from the URL (`obtainConfiguration`) → build the chosen renderer (`makeRenderer`) and mount the ball → wire up a click listener and a `devicemotion`-based shake detector, both calling the same `showAnswer` handler.

### Configuration is URL-driven (`src/configuration/`)

All runtime behavior is controlled by query string params, parsed in `obtain-configuration.function.ts` using keys from `param-keys.enum.ts`:

- `bc` — ball color (default `'Navy'`); passed straight through to whichever renderer is active.
- `rt` — renderer type, `'THREE'` or `'HTML'` (default `'THREE'`).
- `an` — JSON-encoded array of custom `Answer[]` overriding `DEFAULT_ANSWERS`; falls back to defaults on parse failure.
- `af` — filters the answer set down to one `AnswerTypes` value (`affirmative` | `non-committal` | `negative`) after the answers are resolved.

In production (non-`localhost`) the query string is stripped from the URL via `history.replaceState` right after being read, so configuration is effectively a one-time deep-link mechanism, not persistent app state. `checkDevMode()` (hostname === `'localhost'`) gates this.

Default answers (`default-answers.const.ts`) are piped through `insertAnswerLineBreaks`, which wraps each answer's text at `LINE_LIMIT = 10` chars using a custom `LINEBREAK_SYMBOL` (`shared/constants/line-brean-symbol.ts`) so renderers can split long answers into multiple lines.

### Renderer abstraction (`src/renderer/`, `src/shared/models/abstract-renderer.ts`)

All renderers implement `AbstractRenderer` (`showBall`, `showAnswer`, `hideAnswer`). `make-renderer.ts` is the factory selecting an implementation by `RendererType` and lazy-`import()`s it:

- `'THREE'` → `src/renderer/three-renderer/three-ball-8-renderer.class.ts` (`THREEBall8Renderer`) — a hand-built WebGL scene (no THREE.js-wrapping package): a lit sphere with a custom liquid-swirl fragment shader (`external-modules/fbm.const.ts`, `noise-v3.const.ts`), an environment-map texture (`texture.const.ts`, a large base64 JPEG — this is why the THREE bundle is a couple MB), an `InstancedMesh` "window" that cross-fades a canvas-rendered answer texture in and out (`create-answer-textures/`), and mouse/touch orbit controls. `vendor/` holds `orbit-controls.class.js` and `merge-buffer-geometries.util.ts`, copied in from three.js's own examples (pinned to the `three@0.141` API shape — `sRGBEncoding`, `EquirectangularReflectionMapping`, `mergeBufferGeometries` were all renamed/removed in later three.js releases, so don't bump `three` without re-checking every usage site). `orbit-controls.class.js` is plain JS with a hand-written sibling `.d.ts` (not `allowJs`) so it type-checks without pulling other `.js` files like `sw.js` into `tsc`'s program.
- `'HTML'` → `src/renderer/html-renderer/` — a pure CSS flat ball. Styling lives in `html-renderer.style.scss` with classnames mirrored in `html-renderer.style.enum.ts` (keep these two in sync when touching styles).
- Canvas renderer (`src/renderer/canvas-renderer/`) exists but is incomplete/unused — `hideAnswer` throws `Method not implemented`, and `make-renderer.ts` has no case routing to it.

When adding a new renderer, implement `AbstractRenderer` and register it in `makeRenderer`'s switch.

### Answer flow (`src/create-show-answer/`)

`createShowAnswer(renderer, answers)` returns the event handler used for both click and shake-triggered reveals: it picks a random `Answer`, re-applies the `LINEBREAK_SYMBOL` as the `lineSeparator` in the `AnswerPayload`, and calls `renderer.showAnswer(...)`. Renderers that display plain text (e.g. `HtmlRenderer`) convert the line separator back into real newlines at render time.

### Shake detection (`src/create-motion-detector.function.ts`)

Tracks `devicemotion` acceleration deltas; a vertical delta over a threshold starts "shake in progress" (calls `onMotioNStart`, used to hide the current answer), and a debounced (500ms) `onMotionEnd` fires once motion settles (used to show a new answer). Uses `@merry-solutions/debounce`.

### PWA / extension packaging

- `init-pwa.function.ts` registers `src/sw.js` as a service worker on `window.load`, showing an `alert()` on failure or revealing a `.alert` DOM element if service workers aren't supported.
- `src/manifest.webmanifest` is the PWA manifest (linked from `index.html`); `src/manifest.json` is a separate Manifest V3 file for packaging this as a Chrome extension popup. Don't conflate the two.
- Static assets (`src/static/icons`, `src/manifest.json`) are copied into the build via `parcel-plugin-static-files-copy`, configured under `staticFiles` in `package.json`.
- `src/static/extension-store-images/` holds Chrome Web Store listing assets only — not used at runtime.

### Shared types (`src/shared/`)

`models/` holds cross-cutting interfaces (`Answer`, `AnswerPayload`, `RendererType`, `AbstractRenderer`); `enums/answer-types.enum.ts` defines the three answer categories used by both the default dataset and the `af` URL filter.
