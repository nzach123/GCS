# Review Checklist — GCS

Use this checklist before committing AI-generated or AI-modified code.

---

## Pre-Commit Checklist

### Constraints Compliance

- [ ] No frameworks introduced
- [ ] No build tools added
- [ ] No npm dependencies added
- [ ] No new configuration files created
- [ ] Code works as static files (no server required)

### HTML Quality

- [ ] Valid HTML5 (no syntax errors)
- [ ] Semantic elements used appropriately
- [ ] All images have alt text
- [ ] All links have valid hrefs
- [ ] No inline styles (unless documented exception)
- [ ] No inline JavaScript handlers
- [ ] IDs are unique
- [ ] Lang attribute on `<html>`

### CSS Quality

- [ ] Uses CSS custom properties for colors/fonts
- [ ] Mobile-first media queries
- [ ] No `!important` (unless documented)
- [ ] No unused selectors added
- [ ] Follows kebab-case naming
- [ ] Comments for non-obvious rules

### JavaScript Quality

- [ ] Vanilla JS only
- [ ] `const`/`let` used (no `var`)
- [ ] No console.log left in code
- [ ] Event listeners properly attached
- [ ] No global namespace pollution

### Accessibility

- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus states visible on interactive elements
- [ ] Heading hierarchy correct (h1 > h2 > h3)
- [ ] No content conveyed by color alone
- [ ] Keyboard navigation works

### Performance

- [ ] Images optimized (<100KB each)
- [ ] Total page size <500KB
- [ ] No render-blocking resources (except CSS)
- [ ] Fonts load with display=swap

### Responsiveness

- [ ] Tested at 320px width (mobile)
- [ ] Tested at 768px width (tablet)
- [ ] Tested at 1200px+ width (desktop)
- [ ] No horizontal scroll
- [ ] Touch targets minimum 44x44px

### Security

- [ ] No secrets in code
- [ ] External links use `rel="noopener noreferrer"` (if target="_blank")
- [ ] No user input without sanitization (future forms)

---

## Post-Change Verification

### Visual Verification

1. Open `index.html` directly in browser
2. Check desktop layout matches design
3. Check mobile layout (use DevTools device mode)
4. Verify all images load
5. Verify fonts load correctly
6. Click Discord button (confirm link works)

### Functional Verification

1. All links work
2. Hover states function
3. Animations play correctly
4. No JavaScript errors in console

---

## Regression Check

After any change, verify these still work:

| Element | Check |
|---------|-------|
| Logo | Displays correctly |
| Headline | Correct text, correct styling |
| CTA Button | Visible, clickable, correct link |
| Meeting Info | Correct time and room |
| Background | Pattern displays |
| Mobile | Layout stacks correctly |

---

## Sign-Off

Before merging:

- [ ] Checklist complete
- [ ] Visual verification done
- [ ] Tested on real device (if possible)
- [ ] Commit message is descriptive

Approved by: _______________  
Date: _______________
