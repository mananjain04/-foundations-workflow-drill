# Workflow Comparison: Vague Prompting vs. Engineered Specification

## Executive Summary
This document compares two development approaches for a User Settings Form feature:
1. **Round 1 (`vague-prompt`):** Implemented using a single unconstrained prompt ("Build a user settings form with validation").
2. **Round 2 (`engineered-prompt`):** Implemented using structured specifications, file references, accessibility constraints, edge-case requirements, and automated unit test verification.

---

## 1. Correctness & Specific Diffs
The structural and logical diff between the two branches highlights the difference between naive code generation and engineering:

- **Modular Architecture:** In `vague-prompt`, all validation and DOM logic was tightly coupled into a single 30-line `app.js` file, preventing unit testing. In `engineered-prompt`, logic was decoupled into a pure function `src/validator.js` module verified by an automated test suite (`test/validator.test.js`).
- **Validation Rigor:** 
  - *Email:* Round 1 checked `!email.includes('@')`, accepting invalid addresses such as `user@com` or `@domain`. Round 2 implemented full RFC 5322 regex validation (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`).
  - *Password:* Round 1 accepted any string >= 6 characters. Round 2 enforced a multi-pattern check requiring min 8 characters, uppercase, lowercase, numeric, and special characters.

---

## 2. Accessibility (WCAG 2.1 AA)
The vague prompt generated HTML that failed basic screen reader standards:
- **Missing Label Links:** In Round 1, `<label>` elements lacked `for` attributes matching input `id`s. In Round 2, explicit `for="username"` associations were established alongside `autocomplete` attributes.
- **Error Linkage & Live Regions:** Round 1 inserted plain `<span>` text without screen reader association. Round 2 added `aria-describedby="usernameHelp usernameError"`, dynamic `aria-invalid="true"` toggling, and `role="alert"` / `aria-live="assertive"` notification blocks.
- **Focus Management:** Upon failed validation, Round 1 left browser focus on the submit button. Round 2 dynamically calculated the `firstInvalidField` and programmatically invoked `.focus()` to assist keyboard and assistive technology users.

---

## 3. Edge Cases & Input Sanitization
Round 1 failed on critical real-world edge cases:
- **Whitespace Handling:** Submitting `"   "` passed Round 1's `if (!username)` check. Round 2 enforced `.trim()` sanitization across all input processing.
- **Form Submission Hijacking:** Round 1 omitted `e.preventDefault()`, causing the browser to trigger a full page GET/POST refresh, clearing form state before validation feedback was visible.
- **Async State & Rate Limiting:** Round 1 permitted rapid multi-clicking of the submit button. Round 2 disabled the button (`submitBtn.disabled = true`) and rendered a loading state during simulated network transport.

---

## 4. Review Effort & Caught AI Mistakes
Accepting unguided AI code required **higher review effort** than directing AI with specs. 

**Caught AI Mistakes in Round 1:**
1. **Critical Syntax Error / Event Bug:** The AI omitted `e.preventDefault()` inside the submit listener, breaking form submission in real browsers.
2. **Naive Validation Regex:** The AI assumed `email.includes('@')` constituted full email validation.
3. **Missing Escape Sanitization:** Bio inputs were directly echoed into success alerts without length capping or sanitization.

Directing the AI via an engineered loop (`explore-plan-code`) eliminated these regressions before code was committed, reducing human review time to verifying automated test results (`npm test`).
