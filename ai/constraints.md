# Constraints — GCS

## Hard Constraints (Never Violate)

### Technical

1. **No frameworks** — Do not introduce React, Vue, Angular, Svelte, or any JavaScript framework.
2. **No build tools** — Do not add webpack, vite, parcel, esbuild, or any bundler.
3. **No npm** — Do not create package.json or install packages.
4. **No preprocessors** — Do not use SCSS, Sass, Less, or PostCSS.
5. **No TypeScript** — Plain JavaScript only.
6. **Static only** — No server-side code, no API routes, no database.

### Operational

1. **GitHub Pages compatible** — All code must work when served as static files.
2. **No secrets in code** — Never commit API keys, tokens, or credentials.
3. **Single source of truth** — Discord link appears in one place, referenced elsewhere.

### Scope

1. **Landing page only** — Do not build features outside the defined MVP scope.
2. **No user accounts** — No authentication, no user data storage.
3. **No e-commerce** — No payments, no transactions.

## Soft Constraints (Prefer, But Negotiable)

1. **Single CSS file** — Prefer one `styles.css` unless complexity demands splitting.
2. **Minimal JavaScript** — JS is optional. Avoid if CSS can accomplish the goal.
3. **No external images** — Host all images in `/assets/`.
4. **Mobile-first CSS** — Write base styles for mobile, enhance for desktop.

## Change Control

### AI Can Do Without Asking

- Edit existing HTML content (text, attributes)
- Add/modify CSS within existing file structure
- Add vanilla JS for approved interactions
- Optimize images in `/assets/`
- Fix bugs and typos
- Improve accessibility

### AI Must Ask Before Doing

- Creating new HTML pages
- Adding external services (analytics, forms)
- Modifying the Discord invite link
- Changing the color palette
- Adding new font weights or families
- Structural changes to the layout

### AI Must Never Do

- Install dependencies
- Create configuration files (package.json, vite.config.js, etc.)
- Add build scripts
- Introduce frameworks
- Store user data
- Add authentication

## Error Handling

If asked to violate a hard constraint:

1. Decline the request
2. Explain which constraint would be violated
3. Suggest an alternative that respects constraints

Example:
```
Request: "Add React for the contact form"
Response: "Cannot add React (violates no-framework constraint). 
Alternative: Use Formspree with a plain HTML form."
```

## Constraint Updates

Constraints can only be updated by a human maintainer editing this file directly. AI should not suggest modifications to constraints.md.
