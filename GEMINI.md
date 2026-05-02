# Game Creators Space (GCS) Project Instructions

## Project Overview
This project is a static website for the **Game Creators Space (GCS)**, a college club dedicated to game development. The website serves as a landing page for the club, providing information about its mission, meeting details, resources for getting started in game development, and a showcase of student-created games.

### Core Technologies
- **HTML5:** Semantic structure for all pages.
- **CSS3:** Custom styling with a focus on a modern, "game-centric" aesthetic.
- **JavaScript (Vanilla):** Used for interactive components like the hero rotation on the showcase page.
- **JSON:** Data storage for the games showcase (`data/games.json`).

### Key Pages
- `index.html`: The landing page with high-level club information.
- `get-started.html` / `getting-started.html`: Resource guides for new game developers.
- `showcase.html`: A gallery of student-created games.

## Building and Running
As a static website, this project does not require a build step.
- **To Run Locally:** Open any `.html` file in a modern web browser.
- **Asset Management:** Images and logos are stored in the `assets/` directory.

## Development Conventions

### Styling
- **Global Styles:** Defined in `css/styles.css` using CSS variables for colors and typography.
- **Page-Specific Styles:** Page-specific overrides (like for the showcase) are found in files like `css/showcase.css`.
- **Design System:**
  - **Colors:** Primary Blue (`#0077C8`), Accent Yellow (`#FFC700`), Dark Backgrounds (`#1a1a1a`).
  - **Typography:** 'Bebas Neue' for headings, 'Barlow' for body text.

### Showcase System
- **Data-Driven:** The `showcase.html` currently contains hardcoded game cards, but `data/games.json` exists as a reference for the game data.
- **Hero Slider:** The showcase page features a custom hero slider managed by `js/showcase-rotation.js`.
- **Image Fallbacks:** All game images in the showcase use an `onerror` handler to display a placeholder if the image is missing.

### Best Practices
- **Asset Optimization:** Use `.webp` format for images where possible.
- **Accessibility:** Use semantic HTML and ensure focus states are visible (`:focus-visible`).
- **Performance:** Preload critical hero images in the `<head>` for better LCP.

## Project Structure
- `assets/`: Contains logos, photos, and SVG backgrounds.
- `css/`: All stylesheets.
- `data/`: JSON data files.
- `js/`: Client-side scripts.
- `referance/`: Supplemental project documents (e.g., Excel sheets).

## Deprecated / Old Pages
- **DO NOT USE:** The following files in the `z_old/` directory are outdated and should be ignored:
  - `z_old/getting-started.html`
  - `z_old/showcase.html`

