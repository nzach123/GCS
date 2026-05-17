# Game Creators Space (GCS) — Website Specification Document

**Version:** 1.3
**Date:** 2026-05-17
**Owner:** GCS Web Working Group
**Status:** Revised — visual reference audited against live screenshots; composition system locked

---

## 1. Purpose & Scope

This document defines the visual, content, and information-architecture standards for the Game Creators Space (GCS) club website. It governs the three live pages of the site:

- `index.html` — home
- `get-started.html` — engines, tools, asset libraries, downloadable templates
- `level-up.html` — annual student game dev conference, plus sponsor inquiry

No other pages are in scope. There is no About page, Learning Resources page, Sponsors page, or Showcase page. Sponsor inquiries for Level Up are handled inline on `level-up.html`.

The site is built as a plain HTML5 / CSS3 / vanilla-JS static site (no build step). All specifications below must be achievable without introducing a bundler, framework, or runtime dependency.

---

## 2. Brand & Visual System

### 2.1 Color Palette

| Token              | Hex       | Role                                                        |
|--------------------|-----------|-------------------------------------------------------------|
| `--color-primary`  | `#0077C8` | Primary brand blue. Hero backgrounds, link accents.         |
| `--color-accent`   | `#FFC700` | Yellow accent. CTAs, eyebrow text, focus rings, highlights. |
| `--color-black`    | `#1A1A1A` | Dark surface. Diagonal hero split, footer.                  |
| `--color-white`    | `#FFFFFF` | Body text on dark surfaces, card backgrounds.               |
| `--color-muted`    | `#6B7280` | Secondary copy, meta text, disabled states.                 |
| `--color-blue-deep`| `#005A98` | Pattern arrow fill on the blue plane (≈ primary − 12 L*).   |

**Contrast rule:** Body text must meet WCAG AA (4.5:1 contrast). Yellow accent (`#FFC700`) is approved on **black or dark-blue** backgrounds only — it does **not** meet contrast on white surfaces.

**Pattern token:** the hero arrow pattern is treated as a brand element, not a decorative afterthought. It carries the blue plane's identity. See §2.5 for sizing and opacity.

### 2.2 Typography

| Role                | Family       | Weight     | Case       | Notes                                         |
|---------------------|--------------|------------|------------|-----------------------------------------------|
| Display / Headings  | Bebas Neue   | 400        | UPPERCASE  | All `h1`–`h4` and hero headlines.             |
| Body                | Barlow       | 400 / 500  | Sentence   | Default body copy.                            |
| Body emphasis       | Barlow       | 700        | Sentence   | Strong, badges, CTA labels.                   |
| Eyebrow / Caption   | Barlow       | 700        | UPPERCASE  | 0.85 rem with 2 px letter-spacing.            |
| Pill eyebrow        | Bebas Neue   | 400        | UPPERCASE  | 1.1–1.25 rem, 1 px tracking, yellow pill bg.  |

**Hero headline rules (verified against visual reference):**

- `line-height: 0.9` — headlines stack tightly, two lines almost touch.
- `letter-spacing: 0` (no tracking) — Bebas Neue is already condensed; added tracking weakens the brick.
- `margin-bottom: 0.5–0.75rem` between headline and subtitle.
- Never apply `text-shadow` or `filter: drop-shadow` — headlines sit *flat* on the pattern; depth comes from the diagonal split, not the type.

**Fluid type ramp** (use `clamp()` for headlines):

| Element       | Mobile (min) | Fluid                              | Desktop (max) |
|---------------|--------------|------------------------------------|---------------|
| H1 / Hero     | 2.5 rem      | `clamp(2.5rem, 7vw, 5.5rem)`       | 5.5 rem       |
| H2            | 1.75 rem     | `clamp(1.75rem, 4vw, 3rem)`        | 3 rem         |
| H3            | 1.25 rem     | `clamp(1.25rem, 2.5vw, 1.875rem)`  | 1.875 rem     |
| Body          | 1 rem        | —                                  | 1.05 rem      |
| Small / Meta  | 0.85 rem     | —                                  | 0.9 rem       |

### 2.3 Logo Usage

| Asset                              | Use case                       | Width (desktop) | Width (mobile) | Min clear space |
|------------------------------------|--------------------------------|-----------------|----------------|-----------------|
| `gsc-logo-plain.png` (header)      | Site header, persistent nav    | 40 px           | 32 px          | 0.5× logo height |
| `gsc-logo.png` (hero / footer)     | Hero visual, prominent display | 280–360 px      | 200 px         | 1× logo height   |
| `Level up logo.png` (badge)        | Level Up hero badge            | 160 px          | 90–120 px      | 0.5× logo height |

**Hard rules:**
- Always preserve native aspect ratio. Never stretch.
- Do not recolor, add drop-shadows beyond the existing `filter: drop-shadow(0 6px 20px rgba(0,0,0,0.6))`, or rotate.
- On photographic backgrounds, use the white/plain mark, never the full-color version.

### 2.4 Imagery Standards

| Image type           | Aspect ratio | Format          | Max file size | Notes                                        |
|----------------------|--------------|-----------------|---------------|----------------------------------------------|
| Hero carousel photo  | 16:9         | `.webp` (Q 80)  | 300 KB        | Pre-resize to 1920 × 1080.                   |
| Card thumbnail       | 4:3 or 1:1   | `.webp`         | 120 KB        | 600 px max long edge.                        |
| Tool / engine logo   | Square SVG   | `.svg` preferred| 30 KB         | Use `.webp` fallback only when SVG missing.  |
| OG / social card     | 1.91:1       | `.jpg` or `.png`| 200 KB        | 1200 × 630 px.                               |

**Loading discipline:**
- First above-the-fold image uses `loading="eager"` and is preloaded via `<link rel="preload" as="image">`.
- All other images use `loading="lazy"` and explicit `width`/`height` to prevent CLS.
- Decorative images (e.g., background pattern) use `aria-hidden="true"` or CSS `background-image`.

### 2.5 Layout, Spacing & Hero Composition

| Token         | Value     | Use case                              |
|---------------|-----------|---------------------------------------|
| Container     | `90%` width, `max-width: 1200px` | All centered content blocks. |
| Header        | 60 px fixed height, `backdrop-filter: blur(8px)` | Persistent across pages. |
| Section pad   | 4–6 rem vertical, 2 rem horizontal | Major sections.       |
| Card padding  | 1.5 rem   | Resource and engine cards.            |
| Gutter (grid) | 1.5–2 rem | Between cards.                        |

**Breakpoints:**

| Breakpoint  | Width      | Layout behavior                                       |
|-------------|------------|-------------------------------------------------------|
| Mobile      | ≤ 480 px   | Single column, full-bleed cards, condensed nav.       |
| Tablet      | 481–900 px | Single column hero, 2-up resource grid.               |
| Desktop     | 901+ px    | Two-column hero, 3-up resource grid, diagonal split.  |

#### 2.5.1 The Diagonal Split (brand signature)

The blue-to-black diagonal is the most visible identity element of the site. It must match the visual reference exactly — a hard-edged split at a **steeper-than-45° angle**, not a 135° CSS gradient.

| Property              | Value                                       | Why                                                  |
|-----------------------|---------------------------------------------|------------------------------------------------------|
| CSS angle (desktop)   | `110deg` (acceptable range 105°–115°)       | Reference reads ~75° from horizontal, not 45°.       |
| Color stop position   | `58%` blue → `58%` black (no soft transition) | Hard edge, no feathering.                          |
| Mobile (≤ 480 px)     | `180deg`, `50%` / `50%`                     | Vertical stack: blue on top, black on bottom.        |
| Tablet (481–900 px)   | Same as mobile (vertical split)             | Maintains text/image stacking order.                 |

**Implementation choice:** a single `linear-gradient` at the stated angle is the simplest path. If the angle needs to be visually independent of viewport aspect (e.g., to keep the split position fixed at the same percentage on ultra-wide displays), fall back to a `clip-path: polygon()` mask on a black layer over a solid blue base.

> The previous v1.2 spec called for `135deg` with `60%` stops. That produces a gradient line at 45° from horizontal, which is visibly shallower than the reference. v1.3 corrects this to `110deg / 58%`.

#### 2.5.2 The Arrow Pattern Overlay

| Property            | Value                                                   |
|---------------------|---------------------------------------------------------|
| Asset               | `assets/Arrow_background.svg`                           |
| Tile size           | `200px` (acceptable range 180–220 px)                   |
| Repeat              | `repeat`                                                |
| Opacity             | `0.22` (acceptable range 0.20–0.28)                     |
| Position            | Pseudo-element layer, blend mode `normal`, scoped to the blue half (or rendered globally and visually muted by the black plane). |
| Z-index             | Behind hero content (`z-index: 1`), above gradient (`0`).|

**Treat the pattern as a brand element**, not background noise. It is a primary recognition cue alongside the diagonal split and the yellow accent. Previously specced at `140px / 0.15`; v1.3 increases both to match the visual reference.

#### 2.5.3 Hero Visual Anchoring (visual–diagonal interaction)

The hero "visual" element (logo, controllers, photo badge) is intentionally placed so it **crosses the diagonal**. This anchors the composition and reads as a deliberate design move — not a layout mistake.

| Page              | Visual asset                       | Placement rule                                              |
|-------------------|------------------------------------|-------------------------------------------------------------|
| `index.html`      | `gsc-logo.png` (full-color)        | Centered on the diagonal, ~55% on black / 45% on blue.      |
| `get-started.html`| `Controllers.png` (3D render)      | Right-aligned, primary controller body straddles the split. |
| `level-up.html`   | `Level up logo.png` (pixel badge)  | Right column, fully on black plane (no crossing).           |

#### 2.5.4 Level Up Stacked Composition

Level Up does **not** use the side-by-side hero layout. It uses a two-zone vertical stack:

```
┌──────────────────────────────────────┐
│  Full-bleed photo carousel (~60vh)   │  ← cinematic strip, edge-to-edge
├──────────────────────────────────────┤
│  Diagonal hero panel (text | badge)  │  ← same diagonal system as §2.5.1
└──────────────────────────────────────┘
```

The carousel's bottom edge meets the diagonal panel's top edge with no separator. The diagonal split begins immediately below the photo, so the eye flows: photo → eyebrow → headline → body → CTA.

### 2.6 Components

| Component         | Spec                                                                 |
|-------------------|----------------------------------------------------------------------|
| `.btn-primary`    | White background, black text, 0.75 rem × 1.5 rem padding, 4 px radius. Label in Bebas Neue, uppercase. No shadow at rest; `translateY(-2px)` on hover. |
| `.btn-accent`     | `--color-accent` background, black text. Use for the single highest-priority CTA per view. |
| `.btn-download`   | `.btn-primary` styling; label suffixed with format + file size (`Download GDD Template (PDF · 240 KB)`). Uses `<a href="..." download>`. |
| `.resource-card`  | White surface, 1 px subtle border, 8 px radius, hover lifts 2 px.    |
| Badges (status)   | Pill shape, 0.7 rem font. Variants: `essential`, `free`, `paid`, `cc0`, `attribution`, `mixed`, `restricted`, `download`. |
| `.eyebrow-pill`   | **Hero eyebrow — pill variant.** Yellow (`--color-accent`) background, black text, Bebas Neue, 1.1–1.25 rem, full pill radius (≥ 50 px), 0.25 rem × 1 rem padding, 1 px tracking. Used on `index.html` (`BUILD.PLAY.CONNECT`) and `get-started.html` (`GAME DEV 101`). |
| `.eyebrow-text`   | **Hero eyebrow — plain variant.** Yellow text only (no background), Barlow 700, 0.85 rem, uppercase, 2 px tracking. Used on `level-up.html` (`ANNUAL CONFERENCE · EDMONTON`). Pick this variant when the page has a strong supporting visual (photo carousel, badge) that should carry the visual weight. |
| `.hero-quote`     | Italic Barlow on dark plane; 3–4 px yellow left border, 1 rem left padding, opacity 0.9, `max-width: 500px`. Used for attributed pull quotes inside the hero (e.g., Jesse Schell on `get-started.html`). |
| `.feature-list--chevron` | Hero feature list with yellow `›` (or `→`) marker. Used on `level-up.html` to enumerate conference highlights. Inline-block bullets, Barlow 400, line-height 1.9. |
| Hero diagonal     | See §2.5.1 — `linear-gradient(110deg, blue 0–58%, black 58–100%)` desktop, vertical 50/50 mobile. Hard edge, no feather. |
| Hero pattern      | See §2.5.2 — `Arrow_background.svg` at 200 px tile, 0.22 opacity, behind hero content. |
| Channel link      | Icon + label pair used in the footer (§10). Three live channels only: Ookslife, Discord, Instagram. |
| Sponsor callout   | Dark surface block, yellow accent border-top, used on `level-up.html` to surface the sponsor inquiry CTA. |
| Carousel strip    | Full-bleed photo container on `level-up.html`. Height `60vh` (min 400 px, max 700 px). Black bg fallback. Box shadow `0 16px 48px rgba(0,0,0,0.5)` along bottom edge to lift it visually above the diagonal panel below. |

---

## 3. Mockup Review — Errors & Corrections

The following issues were identified in current pages and mockups. **All must be fixed before launch.**

| # | Location                  | Issue                                                | Correction                                              |
|---|---------------------------|------------------------------------------------------|---------------------------------------------------------|
| 1 | Mockup hero headline      | Typo: `"BUIDING"`                                    | `"BUILDING"` — verified correct in current `index.html`. Re-check any Figma/PNG mockups still circulating. |
| 2 | `index.html` line 39      | `"GameJams"` (no space)                              | `"Game Jams"` — match phrasing used on Level Up page.   |
| 3 | `index.html` line 44      | `" get started"` (leading space, lowercase)          | `"Get Started"` — proper case, trimmed.                 |
| 4 | `get-started.html` L 37   | `"its about having fun"` (missing apostrophe)        | `"it's about having fun"`                               |
| 5 | `get-started.html` L 39   | `"assets resources"` (missing comma)                 | `"assets, resources,"`                                  |
| 6 | `get-started.html` L 68   | `"There are many pro and cons"`                      | `"There are pros and cons to each engine."`             |
| 7 | `get-started.html` L 68   | `"which game best fits for you"`                     | `"which engine best fits your project."`                |
| 8 | `get-started.html` L 215  | `"you'll eventually need to peek under the hood."`   | Acceptable, but soften to `"you will want to look under the hood eventually."` for tone consistency. |
| 9 | Footer (all pages)        | `"Weekly meetings."` (no detail, brittle)            | Replace with: `"Meet with us weekly. See our Ookslife page for the current schedule."` — link out to `https://www.ookslife.ca/organization/gamecreatorsspace` so day/time/room can change term-to-term without touching markup. |
| 10 | Discord link `index.html`| `https://discord.gg/YpPJXkeW`                        | **Confirmed canonical** for the current term. Re-verify on each term rollover (Sep / Jan / May); no vanity link migration planned. |
| 11 | `level-up.html` body      | Previous draft referenced a "24-hour game jam" as part of Level Up. | **Remove.** Level Up is conference-only (booths + panels + Q&A). Game jams are run as separate events on different dates. See §4.4. |
| 12 | All pages — Showcase nav  | Showcase entry in nav / `z_old/` archive.            | **Remove permanently.** Delete `z_old/showcase.html`, drop any nav references, and ensure no internal links remain. |

---

## 4. Content Strategy & Copywriting

### 4.1 Voice & Tone

| Trait         | Means…                                                  | Sounds like…                                  |
|---------------|---------------------------------------------------------|-----------------------------------------------|
| Motivating    | Action verbs, second person, momentum.                  | "Ship your first prototype this semester."    |
| Inclusive     | No jargon gatekeeping. New devs welcomed by default.    | "Never touched an engine before? Start here." |
| Community     | "We" and "our crew" over "the club".                    | "We meet every week to break things together."|
| Confident     | No hedging. State capability plainly.                   | "You will leave with a playable build."       |
| Honest        | Acknowledge effort. No "easy" or "anyone can".          | "Game dev is hard. That's why we do it together." |

**Avoid:** filler ("very", "really"), gatekeeping ("real developers know…"), exclamation overuse (max one per page), corporate-speak ("synergy", "leverage").

### 4.2 Page Copy — Home (`index.html`)

**Eyebrow:** `BUILD · PLAY · CONNECT`

**Headline:** `STOP PLAYING.` / `START BUILDING.`

**Subtitle:** `Join the Game Creators Space.`

**Lead paragraph (new — add below subtitle):**
> Game Creators Space is the campus home for NAIT students who want to make games — not just play them. Bring an idea, bring nothing at all, or bring a half-finished prototype you started over the summer. We meet weekly to design, build, break, and ship together.

**Feature list:**
- **Speaker Events** — Working developers from studios across Alberta and beyond.
- **Game Jams** — 48-hour build sprints, mentor-supported. *(Separate from Level Up.)*
- **Collaborative Club Space** — A room, the gear, and people who get it.

**Primary CTAs:** `Get Started` · `Level Up` · `Join the Discord`

### 4.3 Page Copy — Getting Started (`get-started.html`)

**Headline:** `YOUR FIRST GAME STARTS HERE`

**Subtitle:** `Stop playing. Start creating.`

**Revised lead (replaces current paragraph):**
> Building games is not just about creating — it's about having fun while you do it. This page is your launch pad: a curated set of engines, art tools, audio software, and asset libraries we use, recommend, and teach. Pick a stack, install the tools, and bring your first build to the next meetup.

**Chapter intros — refined:**

- **Chapter One — Choose Your Engine:** "Every engine is a trade-off between power, learning curve, and license. Match the engine to the game you want to make — not the other way around."
- **Chapter Two — Build Your Virtual Studio:** "An engine is the kitchen. These are the knives. Pick the ones that fit your hands."
- **Chapter Three — The Asset Library:** "You don't have to make everything yourself. Stand on the shoulders of the open-source community — but always check the license."

The full curated toolset that populates these three chapters is specified in §5.

#### 4.3.1 Templates & Guides (closing section)

Two downloadable resources are hosted at the bottom of `get-started.html`, below Chapter Three. They are direct-download static assets stored in `/assets/downloads/`. Each is presented in a `.resource-card` with a `.btn-download` action (see §2.6) and an attribution line displayed beneath the description.

| Resource                       | Filename                              | Format                              | Attribution line (display on card AND embedded on page 1 of file) |
|--------------------------------|---------------------------------------|-------------------------------------|---------------------------------------------------------------------|
| Game Design Document Template  | `gcs-gdd-template.pdf` (and `.docx` alongside) | PDF + editable Word | *Adapted from the IndieCrypt public Game Design Document template. Original framework © IndieCrypt; this adaptation maintained by GCS.* |
| Game Jam Care Package          | `gcs-game-jam-care-package.pdf`       | PDF                                 | *Originally authored by the University of Alberta Video Game Art and Design Club (VGAD). Republished by GCS with attribution.* |

**Implementation rules:**
- Each link uses `<a href="/assets/downloads/<filename>" download>` to force a download where supported by the browser.
- The download label includes format and file size, e.g., `Download Game Jam Care Package (PDF · 1.4 MB)`.
- The attribution line appears as small italic text directly beneath the card's one-line description, using `--color-muted`.
- The same attribution line MUST be embedded on the first page of the downloadable file itself, not only on the website card.
- File size in the markup must be updated by hand whenever the file is replaced; there is no build step to do this automatically.
- Accessible name announces format and size: e.g., `Download Game Jam Care Package, PDF, 1.4 megabytes`.

### 4.4 Page Copy — Level Up (`level-up.html`)

**Eyebrow:** `STUDENT GAME DEV CONFERENCE · EDMONTON`

**Headline:** `STOP PLAYING.` / `START BUILDING.`

**Refined body:**
> Level Up is the year's biggest moment for GCS — a one-day student game dev conference held on NAIT campus. Industry studios and developers from across Alberta come to share their work, run panels, and meet the students who'll be joining them next. Whether you're presenting at a booth, sitting in on a Q&A, or just listening, you'll leave with new connections and a sharper sense of where you fit in the industry.

> Game jams are run as **separate** events throughout the year and are not part of Level Up.

**Feature list:**
- **Industry Booths** — Studios from across Alberta on the networking floor.
- **Panels & Q&A** — Working developers answering the questions you actually want to ask.
- **One Day · Open to the Public** — A Saturday in late April, on NAIT campus.

**Conference details (page facts block):**

| Field              | Value                                                                            |
|--------------------|----------------------------------------------------------------------------------|
| Format             | Industry booths + panel presentations + Q&A.                                     |
| Date target        | Third week of April — the last weekend before NAIT classes end.                  |
| Duration           | 5–7 hours, single day.                                                           |
| Venue              | NAIT — DOW Theater (panels) + CAT Square (booths). Fallback: PIC 120/122.        |
| Admission          | Public — approximately $10 via EventBrite. Free for GCS execs, guest organizations, NAIT staff, and accredited journalists. |
| Yearly attendance  | **80–100+ attendees** (based on past events). Continue targeting 10+ guest organizations per year. |
| Tickets            | EventBrite, created by NAITSA on behalf of the club.                             |

**Closing tagline:** `Looking forward to seeing you next year.`

**Page CTAs:**
- `Get Tickets (EventBrite)` — primary, opens in new tab once the EventBrite is live.
- `Volunteer` — secondary, mailto link to `gamecreatorsspace@gmail.com` with prefilled subject `Level Up Volunteer Signup`.

#### 4.4.1 Sponsor Inquiry Section (closing section on `level-up.html`)

A short callout near the bottom of the page invites studios and partners to sponsor the next Level Up. There is **no** dedicated sponsorship page — the entire sponsor surface lives in this section.

**Section heading:** `INTERESTED IN SPONSORING?`

**Body copy:**
> Level Up is the only student-run game dev conference in Edmonton. Sponsoring Level Up puts your studio in front of the NAIT students who'll be shipping games next — through booth placement on the networking floor, a speaking slot on a panel, and brand placement across event marketing. Tiers and benefits are customised case-by-case.

**Call to action:**
- `Email a Sponsor Inquiry` — primary CTA, `mailto:gamecreatorsspace@gmail.com?subject=Level%20Up%20Sponsorship%20Inquiry%20-%20%5BStudio%20Name%5D`.
- One-line below the button: `We respond within 5 business days.`

**Layout note:** Use the `Sponsor callout` component (§2.6) — dark surface, yellow accent border-top, single CTA. Keep the section to one viewport-height max; this is a discoverability surface, not a long-form pitch.

---

## 5. Curated "Getting Started" Toolset

A robust, current toolset organized by discipline, populating `get-started.html`. Each tool is **industry-standard** or a **best-in-class free alternative**. Tools already present on `get-started.html` are marked *(present)*; the rest are **recommended additions**.

### 5.1 Featured Game Engines

These are the three engines GCS recommends as primary starting points. The "Choose Your Engine" chapter should feature these prominently, ahead of all other engine options.

| Tool                | Best for                                          | License         | Status        |
|---------------------|---------------------------------------------------|-----------------|---------------|
| **Godot 4**         | 2D and lean 3D, fully open source, no royalties   | MIT             | *(present)*   |
| **Unity**           | Cross-platform commercial releases, mobile, VR/AR | Free / Pro tier | *(present)*   |
| **Unreal Engine 5** | High-fidelity 3D, AAA pipelines                   | 5% royalty > $1M| *(present)*   |

### 5.2 Specialized & Niche Engines

For projects with specific genre or platform targets. Display **below** the featured three, visually de-emphasized (smaller cards, no hero treatment).

| Tool                  | Best for                                  | License            | Status        |
|-----------------------|-------------------------------------------|--------------------|---------------|
| **GameMaker**         | 2D action games (Undertale, Hyper Light Drifter) | Free for non-commercial | **Add** |
| **Construct 3**       | Logic-heavy 2D prototypes, HTML5          | Subscription       | *(present)*   |
| **Pico-8**            | 8-bit fantasy console projects            | $15 one-time       | *(present)*   |
| **GB Studio**         | Native Game Boy ROMs                      | MIT                | *(present)*   |
| **RPG Maker MZ**      | Classic JRPG systems                      | Paid               | *(present)*   |
| **Defold**            | Lightweight 2D, mobile-first              | Free (Modified Apache) | **Add**   |
| **Bevy**              | Rust-based, ECS-first, modern 3D          | MIT / Apache 2.0   | **Add**       |
| **Twine**             | Branching narrative / interactive fiction | Free, open source  | **Add**       |
| **Ren'Py**            | Visual novels                             | Free, open source  | **Add**       |

### 5.3 Frameworks & Libraries

For developers who prefer code-first workflows, want to learn what's under the hood of higher-level engines, or are targeting platforms / sizes that engines don't handle gracefully.

| Tool          | Best for                                           | License      | Status |
|---------------|----------------------------------------------------|--------------|--------|
| **LÖVE**      | Lua-based 2D framework; minimal, beginner-friendly | zlib         | **Add** |
| **Phaser 3**  | HTML5 2D games, browser-native                     | MIT          | **Add** |
| **libGDX**    | Java cross-platform 2D / 3D                        | Apache 2.0   | **Add** |
| **pygame**    | Python 2D framework, classroom favourite           | LGPL         | **Add** |
| **SFML**      | C++ multimedia library (C, Java, Python bindings)  | zlib / PNG   | **Add** |
| **SDL2**      | Low-level C / C++ multimedia layer                 | zlib         | **Add** |
| **Box2D**     | Standalone 2D physics engine                       | MIT          | **Add** |

### 5.4 Code Editors & Languages

| Tool                   | Best for                                  | License           | Status      |
| ---------------------- | ----------------------------------------- | ----------------- | ----------- |
| **Visual Studio Code** | All-purpose editor with engine extensions | Free              | *(present)* |
| **JetBrains Rider**    | Unity / Unreal C# and C++                 | Free for students | *(present)* |
| **Visual Studio 2022** | Native Unreal C++ development             | Free Community    | **Add**     |
| **Cursor**             | AI-assisted code editor (VS Code fork)    | Free tier         | **Add**     |
| **Zed**                | Fast collaborative editor                 | Free, open source | **Add**     |
| **Antigravity**        | Google AI IDE                             | Free, Google      | add         |
|                        |                                           |                   |             |

### 5.5 Version Control & Collaboration

| Tool                  | Best for                                  | License            | Status        |
|-----------------------|-------------------------------------------|--------------------|---------------|
| **GitHub Desktop**    | Visual Git client for solo + small teams  | Free               | *(present)*   |
| **GitHub + Git LFS**  | Repository + large binary asset hosting   | Free tier          | **Add (callout)** |
| **GitLab**            | All-in-one DevOps platform                | Free tier          | *(present)*   |
| **Bitbucket**         | Jira-integrated team workflows            | Free for small teams | *(present)* |
| **Gitea / Forgejo**   | Self-hosted Git                           | MIT                | *(present)*   |
| **Plastic SCM (Unity VCS)** | Best-in-class for large binary game projects | Free tier   | **Add**       |
| **Perforce Helix Core** | AAA studio standard, large binary repos | Free up to 5 users | **Add**       |

### 5.6 3D Modeling, Sculpting & Animation

| Tool                   | Best for                                          | License           | Status      |
| ---------------------- | ------------------------------------------------- | ----------------- | ----------- |
| **Blender 4.x**        | Full 3D pipeline — modeling, sculpting, rig, anim | Free, GPL         | *(present)* |
| **Autodesk Maya**      | Industry standard rigging and animation           | Free for students | *(present)* |
| **Maxon ZBrush**       | Digital sculpting for high-poly characters        | Paid              | *(present)* |
| **MagicaVoxel**        | Voxel art, blocky aesthetics                      | Free              | *(present)* |
| **Houdini Apprentice** | Procedural generation, VFX, simulation            | Free for learning | **Add**     |
| **Marvelous Designer** | Cloth and fabric simulation                       | Subscription      | **Add**     |
| **Marmoset Toolbag**   | Real-time material previews and baking            | Paid              | **Add**     |
| **SpeedTree**          | Procedural foliage and vegetation modeling        | Subscription      | **Add**     |
| **RizomUV**            | Advanced UV unwrapping and packing                | Subscription      | **Add**     |
| **Cascadeur**          | AI-assisted 3D keyframe animation                 | Free for indie    | **Add**     |

### 5.7 2D Art, Pixel Art & Animation

| Tool                  | Best for                                  | License            | Status        |
|-----------------------|-------------------------------------------|--------------------|---------------|
| **Krita 5**           | Open-source digital painting              | Free, GPL          | *(present)*   |
| **Inkscape**          | Vector art, UI icons, scalable assets     | Free, GPL          | *(present)*   |
| **Adobe Photoshop**   | Raster king, plugin ecosystem             | Subscription       | *(present)*   |
| **Affinity Photo 2**  | One-time-purchase Photoshop alternative   | One-time $70       | **Add**       |
| **Procreate** (iPad)  | Concept art and sketching on tablet       | One-time $13       | **Add**       |
| **Clip Studio Paint** | Comic-style art and character illustration| Paid               | **Add**       |
| **Aseprite**          | Pixel art and pixel-perfect animation     | $20 one-time       | *(present)*   |
| **Pixelorama**        | Free, open-source Aseprite alternative    | Free, MIT          | **Add**       |
| **Libresprite**       | Free fork of Aseprite                     | Free, GPL          | **Add**       |
| **Spine 2D**          | Industry standard 2D skeletal animation   | Paid               | *(present)*   |
| **DragonBones**       | Free 2D skeletal animation                | Free, MIT          | **Add**       |

### 5.8 Texturing & Materials

| Tool                  | Best for                                  | License            | Status        |
|-----------------------|-------------------------------------------|--------------------|---------------|
| **Material Maker**    | Procedural textures, node-based           | Free, MIT          | *(present)*   |
| **Adobe Substance 3D Painter** | "Photoshop for 3D models"        | Subscription       | *(present)*   |
| **Adobe Substance 3D Designer** | Procedural material authoring   | Subscription       | **Add**       |
| **ArmorPaint**        | Open-source 3D paint tool                 | Free, GPL          | **Add**       |
| **Quixel Mixer**      | Material blending and authoring (free with Fab) | Free         | **Add**       |

### 5.9 Audio — Music, SFX & Middleware

| Tool                  | Best for                                  | License            | Status        |
|-----------------------|-------------------------------------------|--------------------|---------------|
| **Audacity**          | Quick SFX editing, cleanup, batch processing | Free, GPL       | *(present)*   |
| **Reaper**            | Full DAW with generous trial license      | $60 discount license | **Add**     |
| **Ableton Live**      | Loop-based composition, live performance  | Paid               | **Add**       |
| **FL Studio**         | Pattern-based music production            | Paid               | **Add**       |
| **LMMS**              | Free, open-source DAW                     | Free, GPL          | **Add**       |
| **Bfxr**              | Quick retro SFX generation (browser-based)| Free               | **Add**       |
| **ChipTone**          | Modern in-browser SFX generator           | Free               | **Add**       |
| **Cakewalk by BandLab**| Full-featured free DAW for Windows       | Free               | **Add**       |
| **FMOD Studio**       | Adaptive audio middleware (Unity / Unreal)| Free for indie     | **Add**       |
| **Wwise**             | AAA audio middleware                      | Free up to $200K   | **Add**       |
| **Mixamo**            | Instant rigs + animation library          | Free               | *(present)*   |

### 5.10 UI / UX & Design

| Tool                  | Best for                                  | License            | Status        |
|-----------------------|-------------------------------------------|--------------------|---------------|
| **Figma**             | UI / UX prototyping, real-time co-design  | Free tier          | *(present)*   |
| **Penpot**            | Open-source Figma alternative             | Free, MPL          | **Add**       |
| **Excalidraw**        | Whiteboarding game ideas and flowcharts   | Free, open source  | **Add**       |
| **Miro**              | Team brainstorming, design jams           | Free tier          | **Add**       |

### 5.11 Level Design & Tooling

| Tool            | Best for                                   | License   | Status      |
| --------------- | ------------------------------------------ | --------- | ----------- |
| **LDtk**        | Modern 2D level editor (by Dead Cells dev) | Free, MIT | *(present)* |
| **Tiled**       | Classic tile-map editor                    | Free, GPL | *(present)* |
| **Trenchbroom** | Quake-style brush-based 3D level editor    | Free, GPL | **Add**     |
|                 |                                            |           |             |

### 5.12 Document & Tracking


| Tool             | Best for                                                   | License   | Status  |
| ---------------- | ---------------------------------------------------------- | --------- | ------- |
| **Notion**       | Wikis, relational databases & interconnected documentation | Free      | **Add** |
| **Google Drive** | Cloud storage & collaborative drafting (e.g., GDDs)        | Free, GPL | **Add** |
| **Trello**       | Kanban-style visual task management                        | Free, GPL | **Add** |
|                  |                                                            |           |         |
|                  |                                                            |           |         |

### 5.13 Asset Libraries

Maintain the existing curated list (Kenney, OpenGameArt, Game-Icons, Poly Haven, AmbientCG, Quixel/Fab, Sonniss, Freesound, Incompetech, Google Fonts, Godot Shaders, RealTimeVFX). Recommended additions: **itch.io asset store**, **Mixkit**, **Pixabay**, **GDC Vault** (talks).

---

## 6. Level Up Page — Photo Carousel

**Implementation status:** Complete in this revision.

| Item                    | Spec                                                                 |
|-------------------------|----------------------------------------------------------------------|
| Photos displayed        | All **14** photos in `assets/photos/levelup/photos/`.                |
| Ordering                | **Randomized client-side** via Fisher–Yates shuffle on page load.    |
| Auto-advance            | 5 seconds (preserved).                                               |
| Manual controls         | Prev / Next buttons + arrow-key support (preserved).                 |
| Counter display         | `n / 14` live region.                                                |
| First-slide loading     | `loading="eager"` + `<link rel="preload">` retained on the markup-first slide for LCP. (Note: after shuffle the visually-first slide may differ; acceptable trade-off for randomness.) |

**Photo manifest (14 files):**
`DSC00448`, `DSC00451`, `DSC00453`, `DSC00457`, `DSC00460`, `DSC00463`, `DSC00476`, `DSC00478`, `DSC00479`, `DSC00480`, `DSC00483`, `DSC00512`, `DSC00516`, `DSC00517` (all `.webp`).

---

## 7. Accessibility Requirements

- **Keyboard navigation:** every interactive element reachable via Tab; focus ring visible (yellow 2 px outline).
- **ARIA:** carousels use `role="region"` + `aria-label`; counter uses `aria-live="polite"`.
- **Alt text:** descriptive for content images, empty (`alt=""`) for decorative.
- **Color independence:** never convey state by color alone (badges include text).
- **Motion:** respect `prefers-reduced-motion` — disable carousel auto-advance and transition durations.
- **Form contrast:** all text ≥ 4.5:1 against background. Yellow on white is **prohibited**.
- **Download buttons:** announce format and size in the accessible name (e.g., `Download Game Jam Care Package, PDF, 1.4 megabytes`).

---

## 8. Performance Budget

| Metric                          | Target          | Notes                                  |
|---------------------------------|-----------------|----------------------------------------|
| Largest Contentful Paint (LCP)  | < 2.5 s         | Preload hero image, eager loading.     |
| Cumulative Layout Shift (CLS)   | < 0.1           | Explicit dimensions on all `<img>`.    |
| Total page weight (initial)     | < 1.5 MB        | Compress all photos to WebP Q80.       |
| JavaScript per page             | < 10 KB minified| No frameworks; vanilla only.           |
| Fonts                           | 2 families max  | Bebas Neue + Barlow (already enforced).|

Downloadable assets in `/assets/downloads/` do **not** count against the per-page weight budget (they're only fetched on user action).

---

## 9. Naming Conventions (Reaffirmed)

| Asset            | Convention                                       |
|------------------|--------------------------------------------------|
| HTML files       | `kebab-case.html`                                |
| CSS classes      | Hyphenated; BEM (`lu-carousel__slide`) for page-scoped components. |
| JS variables     | `camelCase`                                      |
| JSON keys        | `snake_case`                                     |
| Image files      | `kebab-case.webp` for new assets; preserve original camera filenames for event photo dumps. |
| Downloadables    | `gcs-<resource-name>.<ext>` in `/assets/downloads/`. |

---

## 10. Footer & Channels

The footer is shared across all three pages. It surfaces only the three channels currently maintained by the exec team.

### 10.1 Footer Content (canonical)

| Block            | Content                                                                                  |
|------------------|------------------------------------------------------------------------------------------|
| Tagline          | `Game Creators Space · NAIT`                                                             |
| Meeting line     | `Meet with us weekly. See our Ookslife page for the current schedule.` — "Ookslife page" links to `https://www.ookslife.ca/organization/gamecreatorsspace`. |
| Channels row     | Three icon-links, in order: **Ookslife**, **Discord**, **Instagram**.                    |
| Copyright line   | `© [current year] Game Creators Space`                                                   |

### 10.2 Channel Inventory

These are the **only** channels the website should link to. Older channels (itch.io, Twitch, Twitter/X, Facebook, YouTube, club email — for non-sponsorship contexts) are deprecated for marketing surfaces; do not add them back without exec-team approval.

| Channel    | URL                                                                       | Purpose                                              |
|------------|---------------------------------------------------------------------------|------------------------------------------------------|
| Ookslife   | `https://www.ookslife.ca/organization/gamecreatorsspace`                  | Authoritative source for meeting day/time/room. The footer meeting line links here. |
| Discord    | `https://discord.gg/YpPJXkeW`                                             | Real-time community. Confirmed canonical invite for the current term; re-verify each term rollover (Sep / Jan / May). |
| Instagram  | `https://www.instagram.com/gamecreatorsspace/`                            | Event announcements, photos, recap content.          |

**Email:** `gamecreatorsspace@gmail.com` is used for the Level Up sponsor inquiry CTA (§4.4.1) and the Level Up volunteer CTA (§4.4). It is **not** surfaced anywhere else, and is **not** part of the general site footer.

---

## 11. Open Questions / Next Steps

1. **OG / social meta tags** — add `<meta property="og:*">` on `index.html`, `get-started.html`, and `level-up.html`. Currently missing on all three.
2. **Sponsor pitch deck (optional supplement)** — if the exec team wants to send a deck to potential sponsors during outreach, author one offline. The website does not host or link to a deck; the entire sponsor surface lives in the §4.4.1 callout.

---

## 12. Change Log

### Version 1.3 — 2026-05-17

**Visual reference audit — composition system locked against live screenshots**

The v1.2 spec described the design language abstractly. v1.3 measures the actual rendered pages and codifies the brand signatures so future implementation cannot drift.

- **§2.1** — Added `--color-blue-deep` (`#005A98`) for the pattern arrow fill, and a note elevating the arrow pattern to brand-element status.
- **§2.2** — Added `Pill eyebrow` typographic role (Bebas Neue, yellow pill background). Added explicit hero-headline rules: `line-height: 0.9`, `letter-spacing: 0`, no shadow/drop-shadow.
- **§2.5** — Renamed to "Layout, Spacing & Hero Composition." Added four new subsections:
  - §2.5.1 **The Diagonal Split** — corrected angle from `135deg` to `110deg` (range 105°–115°) and stop position from `60%` to `58%`. Documented hard-edge requirement.
  - §2.5.2 **The Arrow Pattern Overlay** — raised tile size from `140 px` to `200 px` and opacity from `0.15` to `0.22` to match the visual reference.
  - §2.5.3 **Hero Visual Anchoring** — codified that hero visuals deliberately cross the diagonal on `index.html` and `get-started.html`, but sit fully on black on `level-up.html`.
  - §2.5.4 **Level Up Stacked Composition** — captured the photo-carousel-above-diagonal-panel structure that distinguishes Level Up from the other two pages.
- **§2.6** — Added five new component definitions: `.eyebrow-pill`, `.eyebrow-text`, `.hero-quote` (promoted from inline pattern), `.feature-list--chevron`, and `Carousel strip`. Split the hero gradient row into separate `Hero diagonal` and `Hero pattern` rows so each is independently testable.

**Why this revision matters:** the current `css/styles.css` uses `linear-gradient(135deg, … 60% …)` and a `0.15`-opacity 140 px pattern. Both values are off the visual reference. Shipping against v1.2 would lock in the drift. v1.3 restores parity.

### Version 1.2 — 2026-05-17

**Scope reduction — three-page site**
- Confirmed page list: `index.html`, `get-started.html`, `level-up.html`. No other pages in scope.
- Removed the About page spec (was v1.1 §4.3).
- Removed the Learning Resources page spec (was v1.1 §4.5 and the entire v1.1 §5 information-architecture section).
- Removed the standalone Sponsorship Inquiries page spec (was v1.1 §4.7). Sponsor inquiry now lives as a closing section on `level-up.html`.

**Get Started page**
- Moved the Templates & Guides downloadable resources onto `get-started.html` as a closing section §4.3.1 (was v1.1 §5.6).
- Added explicit attribution-line requirement for both downloads. Attribution must appear on the download card AND embedded on page 1 of the file itself:
  - GDD Template: *Adapted from the IndieCrypt public Game Design Document template. Original framework © IndieCrypt; this adaptation maintained by GCS.*
  - Game Jam Care Package: *Originally authored by the University of Alberta Video Game Art and Design Club (VGAD). Republished by GCS with attribution.*

**Level Up page**
- Added §4.4.1 — sponsor inquiry callout section with mailto CTA to `gamecreatorsspace@gmail.com`. Replaces the v1.1 standalone sponsors page.
- Updated the page facts block: replaced the previous attendance-target placeholder with the confirmed historical figure — **80–100+ yearly attendance**.
- Added new `Sponsor callout` component definition in §2.6.

**Open Questions slimmed**
- Removed: About page, Learning Resources page, Sponsorship page (pages eliminated from scope).
- Removed: Analytics provider decision (out of scope).
- Removed: Past Level Up figures (resolved — 80–100+).
- Removed: Templates & Guides licensing (resolved — attribution lines now mandated in §4.3.1).
- Removed: Showcase removal cleanup (treated as a §3 correction task, not an ongoing open question).
- Remaining: OG meta tags (still open), optional sponsor pitch deck (offline-only, not a website task).

**Renumbering**
- Removed the v1.1 §5 (Learning Resources IA) entirely. All downstream sections shifted up by one:
  - v1.1 §6 (Curated Toolset) → v1.2 §5
  - v1.1 §7 (Photo Carousel) → v1.2 §6
  - v1.1 §8 (Accessibility) → v1.2 §7
  - v1.1 §9 (Performance) → v1.2 §8
  - v1.1 §10 (Naming) → v1.2 §9
  - v1.1 §11 (Footer & Channels) → v1.2 §10
  - v1.1 §12 (Open Questions) → v1.2 §11
  - v1.1 §13 (Change Log) → v1.2 §12

### Version 1.1 — 2026-05-17

**Content & scope**
- §4.3 (About): removed "By the numbers" stat block (figures not tracked).
- §4.6 (Level Up): rewritten as a conference-only event (booths + panels + Q&A); removed all references to a 24-hour game jam; added date target (third week of April, last weekend before NAIT classes end), venue (NAIT — DOW Theater + CAT Square), and admission model.
- §4.7 (Sponsors): NEW page spec for `sponsors.html` — Level Up sponsorship outreach.
- §5.6 (Templates & Guides): NEW subsection — direct-download GDD template and Game Jam Care Package, with attribution and license-clearance requirement noted in §12.

**Toolset**
- §6.1 (Featured Game Engines): NEW — Godot, Unity, Unreal Engine 5 as the visually-featured three.
- §6.2 (Specialized & Niche Engines): existing engines reclassified under this secondary heading.
- §6.3 (Frameworks & Libraries): NEW subsection — LÖVE, Phaser 3, libGDX, pygame, SFML, SDL2, Box2D. Downstream sub-numbering shifted from 6.2–6.10 to 6.4–6.12.

**Footer, channels, components**
- §11 (Footer & Channels): NEW section. Channels reduced to three live surfaces: Ookslife, Discord, Instagram. Older channels (itch.io, Twitch, Twitter/X, Facebook, YouTube) deprecated for the marketing site.
- §3 row 9 (footer meeting line): now links to the GCS Ookslife page instead of hardcoding day/time/room, so the footer survives term-to-term schedule changes.
- §3 row 10 (Discord invite): confirmed `discord.gg/YpPJXkeW` as canonical; re-verify per term rollover.
- §3 row 11: explicit removal of the "24-hour game jam" reference from Level Up.
- §3 row 12: explicit permanent removal of the Showcase page and `z_old/showcase.html`.
- §2.6: added `.btn-download` component, `download` badge variant, channel-link component, and sponsor-logo tile.

**Removed**
- "By the numbers" stat block on About page.
- Showcase page (decision: remove permanently, not revive).
- Open questions on meeting day/time/room (resolved via Ookslife link), Discord vanity invite (resolved: keep current), Showcase fate (resolved: remove).

---

*End of specification. Submit edits via PR against `docs/website-specification.md`.*
