# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website for Game Creators Space, a NAIT student game-dev club. Static HTML/CSS/vanilla-JS site with no build step — pages are served as-is. Three pages: `index.html` (home), `get-started.html`, `level-up.html`.

## Commands

There is no build, lint, or test tooling. The only script is:

```
node scripts/generate-images.js
```

Regenerates responsive `.webp` image variants (srcset sizes) into `assets/logos/` and `assets/photos/levelup/`, plus the PWA icons in `assets/icons/`, from the source images, using `sharp` (the sole dependency). Run this after adding or replacing a source image referenced via `srcset`. It skips files that already carry a generated `-{width}w` suffix, so it is safe to re-run. It doesn't touch anything else — no rebuild step is needed for HTML/CSS/JS changes; just open the HTML file in a browser or serve the directory statically.

## Architecture

- **No bundler, no framework.** Each `.html` page is self-contained and links CSS/JS directly. `css/styles.css` is the shared stylesheet for all pages; `css/level-up.css` and `css/get-started.css` hold styles specific to their pages. Keep page-specific rules in the page's own stylesheet rather than an inline `<style>` block, so they can't silently shadow `styles.css`.
- **`js/nav.js`** is the single source of truth for the mobile hamburger nav and is loaded (via `<script defer>`) on every page. It builds the hamburger button and overlay at runtime, handles focus trapping, Escape-to-close, outside-click, and resize-based auto-close. A `<noscript>` block in each page's `<header>` restores a plain horizontal nav when JS is disabled — keep that block in sync if `nav.js` markup/classes change.
- **`js/level-up.js`** drives the Level Up page's photo carousel only: shuffles slide order on load, auto-advances every 5s, and supports keyboard, touch-swipe, and mouse-drag navigation. It's DOM-id-driven (`luCarouselTrack`, `luPrev`, `luNext`, `luCounter`, `luPause`) plus `.lu-carousel`, and no-ops unless all of them are present, so it's safe to include only where needed. Two behaviours are load-bearing and easy to break:
  - Slide 0 is **pinned** during the shuffle (only slides 1..n-1 are reordered) because it is the `<link rel="preload">` / `fetchpriority="high"` target. Shuffling it leaves the prioritised image off-screen on most loads.
  - Slides past the first carry their URLs in `data-src`/`data-srcset` and are hydrated by JS as they come into play. `loading="lazy"` does **not** work here — the slides are flex children offset horizontally inside an `overflow:hidden` track, which Chrome does not treat as off-screen, so it eagerly fetched all 14 (~2.3 MB) on load.
- **`prefers-reduced-motion`** is checked in both JS files and should be respected in any new interactive/animated behavior.
- **Responsive images**: source images live under `assets/` (e.g. `assets/gsc-logo.png`, `assets/photos/levelup/...`); generated `-{width}w.webp` variants live alongside them and are referenced via `srcset`/`sizes` in the HTML. Don't hand-author these variants — regenerate via `scripts/generate-images.js`.
- **PWA manifest** (`manifest.json`) is linked from every page's `<head>`.
