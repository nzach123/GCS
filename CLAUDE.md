# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Game Creators Space (GCS)**, a game development club. No build step — plain HTML5, CSS3, and vanilla JavaScript.

## Running Locally

Open any `.html` file directly in a browser, or serve with a local static server:

```bash
python -m http.server 8000
# or
npx http-server -p 8000
```

There is no build, lint, or test toolchain.

## Architecture

### Pages (active)
- `index.html` — Home page: hero, club intro, CTAs
- `get-started.html` — Multi-chapter game dev guide with resource cards
- `level-up.html` — Annual conference page with full-bleed carousel

### CSS structure
- `css/styles.css` — Global styles, design system, all shared components
- `css/level-up.css` — Styles scoped to the Level Up page
- `css/showcase.css` — Styles for the (currently archived) showcase page

### JavaScript
- `js/level-up.js` — Carousel controller: auto-advance, prev/next, keyboard support
- `js/showcase-rotation.js` — Hero slider with radio-button navigation, pause-on-hover, IIFE pattern

### Data
- `data/games.json` — Game showcase entries (source of truth is `referance/GCS Showcase games.xlsx`)

### Deprecated
- `z_old/` — Old versions of pages. Do not reference or link to these.

## Design System

CSS custom properties defined in `styles.css`:

```css
--color-primary: #0077C8   /* Blue */
--color-accent:  #FFC700   /* Yellow */
--color-black:   #1a1a1a   /* Dark background */
```

- Headings: **Bebas Neue** (Google Fonts), always uppercase
- Body: **Barlow** (400/500/700)
- Container: `width: 90%; max-width: 1200px`
- Fixed header: 60px height, `backdrop-filter: blur`
- Mobile breakpoint: `@media (max-width: 768px)`
- Fluid type via `clamp()`

### Buttons
- `.btn-primary` — white background
- `.btn-accent` — yellow (`--color-accent`) background

### Hero pattern
Diagonal split background: `135deg` gradient (blue ~60%, black ~40%). On mobile this becomes a vertical gradient.

## Naming Conventions

- HTML files: `kebab-case.html`
- CSS classes: hyphenated, BEM-inspired for page-specific components (e.g., `lu-carousel__slide`)
- JS variables: `camelCase`
- JSON keys: `snake_case`
- Page-specific CSS lives in its own file; shared/global styles go in `styles.css`
