# Task Templates — GCS

## How to Use

Copy the relevant template when assigning tasks to AI. Fill in the bracketed sections.

---

## Template: Update Text Content

```
TASK: Update text content

LOCATION: index.html
ELEMENT: [describe element, e.g., "meeting time in footer"]
CURRENT: [current text]
NEW: [new text]

CONSTRAINTS:
- Do not change HTML structure
- Do not modify other content
- Preserve all existing classes and IDs
```

---

## Template: Add/Modify CSS Styling

```
TASK: Modify styling

TARGET: [element or class name]
CHANGE: [describe the visual change]

REFERENCE: [optional: link to design, screenshot, or description]

CONSTRAINTS:
- Use existing CSS variables where applicable
- Follow mobile-first approach
- Ensure accessibility (contrast, focus states)
```

---

## Template: Fix Bug

```
TASK: Fix bug

DESCRIPTION: [describe the issue]
STEPS TO REPRODUCE:
1. [step 1]
2. [step 2]
EXPECTED: [what should happen]
ACTUAL: [what actually happens]

BROWSER/DEVICE: [if relevant]

CONSTRAINTS:
- Minimal change to fix the issue
- Do not refactor unrelated code
- Test fix before marking complete
```

---

## Template: Add New Section

```
TASK: Add new section to page

SECTION: [name/purpose of section]
POSITION: [where in the page hierarchy]
CONTENT:
- [content item 1]
- [content item 2]

DESIGN: [description or reference]

CONSTRAINTS:
- Follow existing HTML patterns
- Use semantic elements
- Add corresponding CSS in styles.css
- Ensure responsive behavior
```

---

## Template: Optimize Performance

```
TASK: Optimize performance

FOCUS: [images / CSS / JS / fonts / specific area]
CURRENT ISSUE: [describe performance problem]
TARGET: [specific metric or goal]

CONSTRAINTS:
- Do not remove functionality
- Document any trade-offs
- Test on slow connection
```

---

## Template: Improve Accessibility

```
TASK: Improve accessibility

ISSUE: [describe accessibility problem]
WCAG CRITERION: [if known, e.g., "1.4.3 Contrast"]
AFFECTED ELEMENTS: [list elements]

CONSTRAINTS:
- Do not change visual design significantly
- Ensure fix works across screen readers
- Test keyboard navigation
```

---

## Template: Add Animation/Interaction

```
TASK: Add interaction

ELEMENT: [target element]
TRIGGER: [hover / click / scroll / load]
BEHAVIOR: [describe the animation or interaction]
DURATION: [suggested timing]

CONSTRAINTS:
- Use CSS transitions/animations where possible
- JS only if CSS insufficient
- Respect prefers-reduced-motion
- Keep subtle, not distracting
```

---

## Template: Code Review Request

```
TASK: Review code

FILES: [list files to review]
FOCUS:
- [ ] Correctness
- [ ] Accessibility
- [ ] Performance
- [ ] Code standards compliance
- [ ] Security (if applicable)

PROVIDE:
- List of issues found
- Severity (critical / major / minor)
- Suggested fixes
```

---

## Template: Explain Code

```
TASK: Explain code

FILE: [file path]
SECTION: [line range or function name]
AUDIENCE: [beginner / intermediate / advanced]

PROVIDE:
- Line-by-line explanation
- Why it's written this way
- Any potential issues or improvements
```

---

## Output Format

For all tasks, AI should:

1. Confirm understanding of the task
2. List files to be modified
3. Make changes (or explain why not possible)
4. Summarize what was done
5. Note any follow-up items

If task conflicts with constraints, explain the conflict and suggest alternatives.
