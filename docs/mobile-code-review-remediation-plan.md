# Implementation Plan: Mobile Code Review Remediation (2026-08-06)

**Status:** Ready for implementation
**Handoff to:** `developer`
**Source:** `docs/mobile-code-review-2026-08-06.md`

---

## Objective

Resolve all 12 review findings from the mobile code review, ordered by severity: unblock the broken hamburger menu, close accessibility gaps, fix performance regressions, and clean up maintainability/nit issues.

---

## Assumptions

- ⚠️ The original `js/nav.js` was deleted (seen in terminal history); we will recreate it with enhancements from scratch.
- ⚠️ WebP variants for carousel images and badges may not exist yet — that's a Phase 2.4 concern and is left as a manual verification step (not in this plan).
- ⚠️ No BrowserStack or real-device testing is available in this pipeline — the horizontal-overflow and Samsung Internet risks from the review remain as manual QA.

---

## Scope

### In scope

- Restore `js/nav.js` as the single source of truth for hamburger menu JS, fixing the BLOCKER
- Add focus-trap behavior to the restored nav.js (HIGH)
- Fix `scroll-behavior: smooth` to respect `prefers-reduced-motion` (HIGH)
- Fix 40px carousel button regression at ≤374px (HIGH)
- Fix off-canvas backdrop click-through (MEDIUM)
- Add `loading="lazy"` & `decoding="async"` to guide hero image (MEDIUM)
- Generate or repoint PWA manifest icons to properly sized assets (MEDIUM)
- Fix OG image meta tags (MEDIUM)
- Improve carousel counter contrast (LOW)
- Convert `.hero-features` font-size to fluid `clamp()` (LOW)
- Fix "NAITS's" → "NAIT's" typo on all 3 pages (NIT)

### Out of scope

- Generating WebP variants for carousel/badge `srcset` images (Phase 2.4 work)
- Horizontal-overflow audit at all 5 breakpoints (manual QA)
- iOS Safari notch / Dynamic Island verification (manual QA)
- Samsung Internet `@media (hover: hover)` testing (manual QA)

---

## Plan

### Task 1 — Create `js/nav.js` + remove inline scripts from all 3 pages

**Priority:** BLOCKER + HIGH + MEDIUM
**Agent:** `developer`
**Files affected:**
- `js/nav.js` — **create**
- `index.html` — remove inline `<script>` in `<head>`, add `<script src="js/nav.js" defer>` before `</body>`
- `level-up.html` — same
- `get-started.html` — same
- `css/styles.css` — remove `::before` overlay rule, add `.nav-overlay` class rule

**Description:**

Create `js/nav.js` with the following behavior:

1. **DOMContentLoaded guard** — All initialization wrapped in `DOMContentLoaded` so `.site-header` exists when the script runs (fixes the BLOCKER).
2. **Hamburger button creation** — Same logic as the current inline script: create `<button class="hamburger-btn">`, inject before `<nav>`, set `aria-expanded`, `aria-controls`, `aria-label`.
3. **Open/close/toggle** — Retain existing `openMenu()`, `closeMenu()`, `toggleMenu()` functions.
4. **Focus trap (NEW)** — After opening the menu, query all focusable elements inside `nav` live. On `keydown`:
   - `Tab` on the **last** focusable element → focus wraps to the **first**.
   - `Shift+Tab` on the **first** focusable element → focus wraps to the **last**.
   - Only active when `nav--open` is present.
5. **Overlay div (NEW)** — Instead of the CSS `::before` pseudo-element, create a real `<div class="nav-overlay">` as a sibling of `<nav>`. Attach a click handler to close the menu. Add/remove the div on open/close (reuse a single element, toggle `display`).
6. **Escape to close** — Retain existing `keydown` listener on `document`.
7. **Outside click dismiss** — Retain existing `click` listener on `document`.
8. **Link click closes** — Retain existing per-link click handlers (re-query on open for safety).
9. **Resize close** — Retain existing debounced `resize` listener (close if `> 767px`).
10. **Reduced motion** — Retain `prefers-reduced-motion` check; skip `.nav--animating` class if user prefers reduced motion.

Then, in **all three HTML files**:
- **Remove** the entire inline `<script>` block (the IIFE) from `<head>`.
- **Add** `<script src="js/nav.js" defer></script>` just before `</body>`.

Then, in **`css/styles.css`**:
- **Remove** the rule:
  ```css
  .site-header nav.nav--open::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: -1;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
  }
  ```
- **Add** a new rule:
  ```css
  .nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1040;
      width: 100vw;
      height: 100dvh;
      cursor: pointer;
  }
  ```

**Acceptance criteria:**
- [ ] Hamburger button appears and toggles the menu on all three pages at ≤767px
- [ ] Pressing Tab inside open menu cycles between nav links only (never escapes to page content)
- [ ] Shift+Tab on first link wraps to last link; Tab on last link wraps to first
- [ ] Clicking the dark overlay backdrop closes the menu
- [ ] Escape closes the menu and returns focus to hamburger button
- [ ] No console errors on any page load
- [ ] Only one copy of the nav JS exists in the codebase (`js/nav.js`)

**Risks:**
- The overlay-as-sibling approach changes DOM structure; verify `.nav-overlay` positioning works correctly at all breakpoints.
- Focus trap needs to re-query focusable elements on each open in case DOM changes.

---

### Task 2 — Gate `scroll-behavior: smooth` behind `prefers-reduced-motion`

**Priority:** HIGH + NIT
**Agent:** `developer`
**Files affected:** `css/styles.css`

**Description:**

In `css/styles.css`:
1. **Remove** `scroll-behavior: smooth;` from the base `html` rule (currently at ~L70).
2. **Keep** `scroll-behavior: smooth;` only inside `@media (prefers-reduced-motion: no-preference)` (currently at ~L73–75).

This resolves both the HIGH accessibility violation (WCAG 2.2 SC 2.3.3) and eliminates the NIT duplicate declaration.

**Before:**
```css
html {
    font-size: 16px;
    scroll-behavior: smooth;
}

@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}
```

**After:**
```css
html {
    font-size: 16px;
}

@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}
```

**Acceptance criteria:**
- [ ] Base `html` rule no longer contains `scroll-behavior`
- [ ] Smooth scrolling only activates when user has NOT requested reduced motion
- [ ] No duplicate `scroll-behavior` declaration remains anywhere in the file

**Risks:** None — pure CSS removal.

---

### Task 3 — Fix carousel button touch-target regression at ≤374px

**Priority:** HIGH
**Agent:** `developer`
**Files affected:** `css/level-up.css`

**Description:**

In the `@media (max-width: 374px)` block, change `.lu-carousel__btn` dimensions from `40px × 40px` back to `48px × 48px` to satisfy the Phase 2.1 ≥48px touch-target mandate. If visual scaling is desired, reduce `font-size` from `1.2rem` to `1.1rem` instead.

**Before (~L225–229):**
```css
@media (max-width: 374px) {
    /* ... */
    .lu-carousel__btn {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    /* ... */
}
```

**After:**
```css
@media (max-width: 374px) {
    /* ... */
    .lu-carousel__btn {
        width: 48px;
        height: 48px;
        font-size: 1.1rem;
    }
    /* ... */
}
```

**Acceptance criteria:**
- [ ] At 320px viewport width, carousel prev/next buttons are ≥48×48px
- [ ] Buttons remain tappable without mis-taps on 320px-wide screens (e.g., iPhone SE 1st gen)

**Risks:**
- At 320px, 48px buttons + 10px side offset may feel tight within a 35vh/220px carousel. If visual crowding occurs, reduce the side offset (`left`/`right`) to 6px instead of shrinking the button.

---

### Task 4 — Fix off-canvas backdrop click-through

**Priority:** MEDIUM
**Agent:** `developer`
**Files affected:** `css/styles.css`, `js/nav.js`

**Description:**

This is paired with Task 1. The CSS `::before` pseudo-element overlay is removed and replaced with a real `<div class="nav-overlay">` created by `js/nav.js`.

**CSS changes in `css/styles.css`:**

Remove the `::before` rule at the end of the mobile nav block:
```css
/* REMOVE this entire rule */
.site-header nav.nav--open::before {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: -1;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
}
```

Add the new overlay class:
```css
.nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1040;
    width: 100vw;
    height: 100dvh;
    cursor: pointer;
}
```

**JS behavior in `js/nav.js` (part of Task 1):**
- On `openMenu()`: create or show the overlay div, append it as a sibling of `<nav>`.
- On `closeMenu()`: hide the overlay div.
- Attach `click` handler to the overlay that calls `closeMenu()`.

**Acceptance criteria:**
- [ ] Clicking the dark overlay area reliably closes the menu on all browsers
- [ ] Overlay is not visible/present when menu is closed
- [ ] Overlay z-index (1040) sits below the nav panel (1050) but above page content

**Risks:**
- Adding/removing DOM elements on every open/close cycle could cause layout thrashing. Mitigate by reusing a single overlay element with `display: none`/`display: block` toggling instead of create/destroy.

---

### Task 5 — Add `loading="lazy"` and `decoding="async"` to guide hero image

**Priority:** MEDIUM
**Agent:** `developer`
**Files affected:** `get-started.html`

**Description:**

On the guide hero `<img>` for `Controllers.png`, add `loading="lazy"` and `decoding="async"` attributes.

**Before (~L208–212):**
```html
<img src="assets/photos/levelup/Controllers.png" alt="Game controllers"
    class="guide-hero-img" width="3300" height="2326"
    srcset="assets/photos/levelup/Controllers-600w.webp 600w, assets/photos/levelup/Controllers-1200w.webp 1200w"
    sizes="(max-width: 767px) 100vw, 50vw">
```

**After:**
```html
<img src="assets/photos/levelup/Controllers.png" alt="Game controllers"
    class="guide-hero-img" width="3300" height="2326"
    srcset="assets/photos/levelup/Controllers-600w.webp 600w, assets/photos/levelup/Controllers-1200w.webp 1200w"
    sizes="(max-width: 767px) 100vw, 50vw"
    loading="lazy" decoding="async">
```

**Acceptance criteria:**
- [ ] `<img>` has `loading="lazy"` and `decoding="async"` attributes
- [ ] No visual regression on desktop or mobile

**Risks:**
- If this image is later confirmed as the LCP element via Lighthouse, switch to `loading="eager"` + `fetchpriority="high"` instead.

---

### Task 6 — Fix PWA manifest icons

**Priority:** MEDIUM
**Agent:** `developer`
**Files affected:** `manifest.json`

**Description:**

The manifest currently references `assets/gsc-logo-plain.png` (40×40) for both 192×192 and 512×512 icon sizes, producing blurry homescreen icons. Use `assets/gsc-logo.png` (1080×1080) instead, which already exists in the workspace.

**Before:**
```json
"icons": [
    {
      "src": "assets/gsc-logo-plain.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/gsc-logo-plain.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
```

**After:**
```json
"icons": [
    {
      "src": "assets/gsc-logo.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/gsc-logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
```

Also fix the `description` field typo while here: `"NAIT's"` (it already says NAIT's correctly in manifest, but verify).

**Acceptance criteria:**
- [ ] `manifest.json` icons reference `gsc-logo.png` (1080×1080 native)
- [ ] PWA install prompt shows a clear, non-blurry icon on Android Chrome

**Risks:**
- The 1080×1080 logo may be slightly soft when downscaled to 192×192 by the browser. For production, generate properly sized PNGs (192, 512) from the source file. This is acceptable for now.

---

### Task 7 — Fix OG image meta tags

**Priority:** MEDIUM
**Agent:** `developer`
**Files affected:** `index.html`, `level-up.html`, `get-started.html`

**Description:**

Replace all three `og:image` meta tags with `assets/gsc-logo.png` (the one file we know exists at 1080×1080).

**Changes:**

| File | Line | Before | After |
|------|------|--------|-------|
| `index.html` | ~L11 | `content="assets/og-home.jpg"` | `content="assets/gsc-logo.png"` |
| `level-up.html` | ~L11 | `content="assets/og-level-up.jpg"` | `content="assets/gsc-logo.png"` |
| `get-started.html` | ~L11 | `content="assets/og-get-started.jpg"` | `content="assets/gsc-logo.png"` |

Also add `og:image:width` and `og:image:height` meta tags for better social-platform parsing:
```html
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="1080">
```

**Acceptance criteria:**
- [ ] All three `og:image` meta tags point to `assets/gsc-logo.png`
- [ ] No broken image in social-media link previews (Twitter/X, Discord, Facebook)

**Risks:**
- 1080×1080 is square; the recommended OG ratio is 1.91:1 (1200×630). It will work but may be center-cropped by some platforms. A dedicated OG image at 1200×630 is a nice-to-have follow-up.

---

### Task 8 — Improve carousel counter contrast

**Priority:** LOW
**Agent:** `developer`
**Files affected:** `css/level-up.css`

**Description:**

Increase `.lu-carousel__counter` background opacity from `0.6` to `0.85` to ensure WCAG AA 4.5:1 contrast over any underlying carousel image.

**Before (~L141–145):**
```css
.lu-carousel__counter {
    /* ... */
    background: rgba(0, 0, 0, 0.6);
    /* ... */
}
```

**After:**
```css
.lu-carousel__counter {
    /* ... */
    background: rgba(0, 0, 0, 0.85);
    /* ... */
}
```

**Acceptance criteria:**
- [ ] Counter badge text remains legible over all carousel images
- [ ] Background appears as a solid dark pill regardless of image content

**Risks:** None — a 0.25 opacity increase is subtle visually but meaningfully improves contrast.

---

### Task 9 — Convert `.hero-features` font-size to fluid `clamp()`

**Priority:** LOW
**Agent:** `developer`
**Files affected:** `css/styles.css`

**Description:**

Change the base `.hero-features` `font-size` from fixed `1.3rem` to `clamp(1rem, 2.5vw, 1.3rem)`. The existing 374px breakpoint already overrides to `1rem`, so this makes the transition fluid across the full range.

**Before (~L287):**
```css
.hero-features {
    font-size: 1.3rem;
    /* ... */
}
```

**After:**
```css
.hero-features {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    /* ... */
}
```

Also remove the now-redundant `font-size: 1rem` override in the `@media (max-width: 374px)` block (~L492), since the `clamp()` minimum already handles it. Alternatively, keep it as a safety net — your call.

**Acceptance criteria:**
- [ ] `.hero-features` text scales smoothly between ~1rem (at 320px) and 1.3rem (at ~768px+)
- [ ] No text overflow at 320px viewport
- [ ] Existing breakpoint behavior still works

**Risks:** None — the `max` bound is the same as the current fixed value.

---

### Task 10 — Fix "NAITS's" → "NAIT's" typo

**Priority:** NIT
**Agent:** `developer`
**Files affected:**
- `index.html` (~L151)
- `level-up.html` (~L252)
- `get-started.html` (~L398)

**Description:**

Find and replace `NAITS's` → `NAIT's` in all three HTML files. The text appears in the footer's `.meeting-detail` paragraph.

**Acceptance criteria:**
- [ ] No instance of "NAITS's" remains in any file
- [ ] Footer reads "NAIT's Game developer club" on all pages

**Risks:** None.

---

## Edge Cases

| # | Case | Mitigation |
|---|------|------------|
| 1 | **Focus trap + zero nav links** | Guard focus-trap handler with `navLinks.length === 0` early return |
| 2 | **Focus trap + dynamic nav links** | Re-query `nav.querySelectorAll('a, button, [tabindex]')` on each `openMenu()` call, don't cache statically |
| 3 | **Overlay + iOS Safari URL bar** | Use `height: 100dvh` (not `100vh`) in `.nav-overlay` CSS |
| 4 | **Overlay + rapid open/close** | Reuse a single overlay element; toggle `display` instead of create/destroy |
| 5 | **Reduced motion + nav animation** | JS already skips `.nav--animating` class when `prefers-reduced-motion: reduce`; CSS already has `transition: none` in the reduce media query — verify no regression |
| 6 | **Resize from mobile to desktop with menu open** | Existing resize listener closes at `> 767px` — verify after moving to external script |
| 7 | **`defer` script order** | `js/nav.js` has no dependencies; `defer` executes after DOM parse but before `DOMContentLoaded` — the internal `DOMContentLoaded` guard handles the edge case where `defer` fires after the event |

---

## Validation Checklist

- [ ] **Hamburger menu:** Open each page at 375px (iPhone) Device Mode → tap hamburger → menu opens → Tab through links → focus stays in menu → Esc closes → focus returns to hamburger
- [ ] **Overlay dismiss:** Tap dark overlay area → menu closes
- [ ] **Reduced motion:** System Preferences → Accessibility → Reduce motion ON → reload → menu opens/closes instantly (no slide), smooth scrolling disabled
- [ ] **Carousel buttons:** At 320px Device Mode → carousel prev/next buttons are ≥48×48px
- [ ] **Lighthouse:** Run Lighthouse (Mobile, Performance + Accessibility) on all three pages → no regression below current scores
- [ ] **Horizontal overflow:** `document.documentElement.scrollWidth <= window.innerWidth` at 320, 375, 480, 768, 1024px
- [ ] **Grep check:** `grep -r "NAITS's" .` returns zero results
- [ ] **Grep check:** `grep -r "scroll-behavior: smooth" css/` returns only the occurrence inside `@media (prefers-reduced-motion: no-preference)`
- [ ] **Grep check:** `grep -r "og-home.jpg\|og-level-up.jpg\|og-get-started.jpg" .` returns zero results
- [ ] **PWA:** Open Chrome DevTools → Application → Manifest → verify icon is not pixelated
- [ ] **Social preview:** Run a URL through `https://www.opengraph.xyz/` or Twitter Card Validator → verify image appears

---

## Files Summary

| File | Action | Tasks |
|------|--------|-------|
| `js/nav.js` | **CREATE** | Task 1, Task 4 |
| `index.html` | EDIT | Task 1 (remove inline script, add defer), Task 7 (OG image), Task 10 (typo) |
| `level-up.html` | EDIT | Task 1 (remove inline script, add defer), Task 7 (OG image), Task 10 (typo) |
| `get-started.html` | EDIT | Task 1 (remove inline script, add defer), Task 5 (lazy load), Task 7 (OG image), Task 10 (typo) |
| `css/styles.css` | EDIT | Task 2 (scroll-behavior), Task 4 (overlay CSS), Task 9 (clamp) |
| `css/level-up.css` | EDIT | Task 3 (carousel buttons), Task 8 (counter contrast) |
| `manifest.json` | EDIT | Task 6 (PWA icons) |

---

## Implementation Order

Tasks are listed in priority order. For efficiency, batch by file:

1. **Batch A (new file):** Task 1 `js/nav.js` creation
2. **Batch B (CSS):** Tasks 2, 3, 4-CSS, 8, 9 — all CSS-only changes
3. **Batch C (HTML):** Tasks 1-HTML, 5, 7, 10 — all HTML changes
4. **Batch D (manifest):** Task 6

Batches B and C can run in parallel after Batch A.