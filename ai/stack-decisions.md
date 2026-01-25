# Stack Decisions — GCS

## Confirmed Stack

| Layer | Decision | Rationale |
|-------|----------|-----------|
| Markup | HTML5 | Universal, no build step, beginner-friendly |
| Styling | Vanilla CSS3 | Full control, no dependencies |
| Interactivity | Vanilla JS | Minimal needs, no framework overhead |
| Hosting | GitHub Pages | Free, simple, reliable |
| Fonts | Google Fonts (CDN) | Free, no self-hosting complexity |
| Version Control | Git + GitHub | Standard, enables collaboration |

## Rejected Alternatives

| Alternative | Why Rejected |
|-------------|--------------|
| React/Vue/Svelte | Overkill for static landing page. Adds build complexity. |
| TailwindCSS | Requires build step. Utility classes less readable for beginners. |
| SCSS/Sass | Requires compilation. Plain CSS sufficient for this scope. |
| Next.js/Astro | SSG frameworks add unnecessary complexity for single page. |
| npm packages | Avoided to eliminate dependency management. |
| Self-hosted fonts | Google Fonts CDN is simpler and performant. |

## Font Stack

**Primary (Headlines):** Bebas Neue
- Source: Google Fonts
- Weights: 400 (Regular only)
- Use: H1, large display text

**Secondary (Body/UI):** Barlow
- Source: Google Fonts
- Weights: 400, 500, 600, 700
- Use: Body text, buttons, captions

**Fallback:** `sans-serif`

```css
font-family: 'Bebas Neue', sans-serif;  /* Headlines */
font-family: 'Barlow', sans-serif;      /* Body */
```

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#2B9AE4` | Background, brand |
| Dark Blue | `#1E7BC4` | Arrows, accents |
| Accent Gold | `#FFD700` | CTA buttons |
| Pure Black | `#000000` | Text, borders |
| Pure White | `#FFFFFF` | Headlines |
| Off-Black | `#1A1A1A` | Dark sections |

## External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Google Fonts | Typography | Active |
| Discord | Community link | Active |
| Formspree | Contact form | Future (not yet implemented) |
| Google Analytics | Traffic tracking | Future (not yet implemented) |

## Decision Authority

| Decision Type | Who Decides |
|---------------|-------------|
| Add framework | Human (requires explicit approval) |
| Add npm dependency | Human (requires explicit approval) |
| Add build step | Human (requires explicit approval) |
| Add new page | Human (requires explicit approval) |
| Modify CSS variables | AI (within existing palette) |
| Modify HTML content | AI (within existing structure) |
| Add CSS styles | AI (following standards) |

## Locked Decisions

These decisions are final and should not be revisited:

1. No JavaScript frameworks
2. No CSS preprocessors
3. No build tools
4. GitHub Pages hosting
5. Google Fonts for typography

To change a locked decision, a human must explicitly unlock it with documented rationale.
