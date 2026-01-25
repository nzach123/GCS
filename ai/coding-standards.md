# Coding Standards — GCS

## General Principles

1. Simplicity over cleverness
2. Readability over brevity
3. Explicit over implicit
4. Beginner-friendly over advanced patterns

## HTML Standards

### Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main>
    <!-- Content here -->
  </main>
  <script src="js/main.js"></script>
</body>
</html>
```

### Rules

- Use semantic HTML (`<main>`, `<section>`, `<nav>`, `<header>`, `<footer>`)
- Always include `lang="en"` on `<html>`
- Always include viewport meta tag
- Place CSS in `<head>`, JS before `</body>`
- Use lowercase for all tag names and attributes
- Use double quotes for attribute values
- Include alt text on all images
- Use 2-space indentation

### Naming

- IDs: `kebab-case` (e.g., `hero-section`)
- Classes: `kebab-case` (e.g., `cta-button`)
- No BEM required (keep it simple)

## CSS Standards

### File Organization

```css
/* ==========================================================================
   1. CSS Variables (Custom Properties)
   ========================================================================== */

:root {
  --primary-blue: #2B9AE4;
  --accent-gold: #FFD700;
  /* ... */
}

/* ==========================================================================
   2. Reset / Base Styles
   ========================================================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ==========================================================================
   3. Typography
   ========================================================================== */

/* ==========================================================================
   4. Layout
   ========================================================================== */

/* ==========================================================================
   5. Components
   ========================================================================== */

/* ==========================================================================
   6. Utilities
   ========================================================================== */

/* ==========================================================================
   7. Media Queries
   ========================================================================== */
```

### Rules

- Use CSS custom properties for colors, fonts, spacing
- Mobile-first approach (base styles, then `@media (min-width: ...)`)
- One property per line
- Use shorthand properties when appropriate
- No `!important` unless absolutely necessary (document why)
- Use `rem` for font sizes, `px` for borders and small details
- Use 2-space indentation

### Naming

```css
/* Good */
.hero-section { }
.cta-button { }
.meeting-info { }

/* Avoid */
.heroSection { }  /* No camelCase */
.CTA-Button { }   /* No PascalCase */
.btn1 { }         /* No abbreviations */
```

## JavaScript Standards

### Rules

- Vanilla JS only (no jQuery, no frameworks)
- Use `const` by default, `let` when reassignment needed, never `var`
- Use arrow functions for short callbacks
- Use template literals for string interpolation
- Document any non-obvious logic with comments
- Use 2-space indentation

### Patterns

```javascript
// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialization code
});

// Query elements
const button = document.querySelector('.cta-button');

// Add behavior
button.addEventListener('click', () => {
  // Handle click
});
```

### What NOT to Do

```javascript
// Don't use jQuery
$('.button').click();  // NO

// Don't use var
var x = 1;  // NO

// Don't use inline event handlers in HTML
<button onclick="doThing()">  // NO — use addEventListener instead
```

## Comments

### HTML

```html
<!-- Hero Section -->
<section class="hero">
  ...
</section>
<!-- /Hero Section -->
```

### CSS

```css
/* Hero Section
   ========================================================================== */

/* Button hover state */
.cta-button:hover { }
```

### JavaScript

```javascript
// Initialize page animations
function initAnimations() {
  // ...
}
```

## Accessibility

- Color contrast: minimum 4.5:1 for text
- All images have alt text
- Focus states visible on interactive elements
- Semantic heading hierarchy (h1 > h2 > h3)
- No content conveyed by color alone

## Performance

- Optimize images before committing (WebP preferred, PNG fallback)
- Limit total page size to <500KB
- Minimize external requests
- Load fonts with `display=swap`
