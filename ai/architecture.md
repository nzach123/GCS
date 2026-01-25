# Architecture — GCS

## System Overview

```
┌─────────────────────────────────────────┐
│              GitHub Pages               │
│         (Static File Hosting)           │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│               index.html                │
│  ┌─────────────────────────────────┐    │
│  │         <head>                  │    │
│  │  - Meta tags (SEO, OG)          │    │
│  │  - Google Fonts link            │    │
│  │  - CSS link                     │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │         <body>                  │    │
│  │  - Hero section                 │    │
│  │  - Logo, tagline, CTA           │    │
│  │  - Meeting info                 │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │         <script>                │    │
│  │  - Optional: analytics          │    │
│  │  - Optional: animations         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## File Structure

```
GCS/
├── index.html              # Single page, all content
├── css/
│   └── styles.css          # All styling
├── js/
│   └── main.js             # Minimal interactivity (optional)
├── assets/
│   ├── gsc-logo.png        # Logo image
│   ├── Arrow_background.svg # Background pattern element
│   ├── favicon.ico         # Browser tab icon
│   └── og-image.png        # Social sharing image
├── ai/                     # AI guidance docs (this folder)
└── README.md               # Maintainer documentation
```

## Rendering Strategy

- **Type**: Static HTML (no SSR, no SSG framework)
- **Build Step**: None
- **Deployment**: Push to `main` branch, GitHub Pages serves automatically

## Data Flow

There is no dynamic data. All content is hardcoded in HTML.

| Content | Location | Update Method |
|---------|----------|---------------|
| Headline text | `index.html` | Edit HTML directly |
| Meeting time | `index.html` | Edit HTML directly |
| Discord link | `index.html` | Edit href attribute |
| Styles | `css/styles.css` | Edit CSS directly |
| Logo | `assets/` | Replace file |

## External Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Google Fonts | CDN | Typography (Bebas Neue, Barlow) |
| Discord | External link | CTA destination |

No npm packages. No local dependencies.

## Constraints

1. Single HTML file for all content
2. Single CSS file for all styles
3. Optional single JS file for enhancements
4. No framework abstractions
5. No build/compile step

## Future Expansion Points

If scope grows, these are the approved extension patterns:

| Feature | Implementation |
|---------|---------------|
| Contact form | Formspree or Netlify Forms (external service) |
| Event calendar | Google Calendar embed (iframe) |
| Analytics | Google Analytics script tag |
| Additional pages | New HTML files (e.g., `events.html`) |

Do not introduce frameworks or build tools for these features.
