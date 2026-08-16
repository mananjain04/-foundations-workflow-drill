# Project Development Rules (`CLAUDE.md`)

## 1. Decouple Business Logic from DOM
- **Rule:** Never embed validation logic or string transformations directly inside DOM event handlers.
- **Implementation:** Isolate core logic into pure utility functions (e.g., `src/validator.js`) that take plain data payloads and return clean validation result objects `{ isValid, errors, cleanData }`. This ensures logic can be executed and tested in headless Node.js environments without DOM dependencies.

## 2. Mandatory WCAG 2.1 AA Accessibility Standards
- **Rule:** Every form input must be fully accessible to screen readers and keyboard navigation.
- **Implementation:**
  - Establish explicit `<label for="inputId">` bindings for all inputs.
  - Link input fields to error messages via `aria-describedby="inputIdHelp inputIdError"`.
  - Dynamically toggle `aria-invalid="true|false"` on input elements during validation.
  - Automatically invoke `.focus()` on the first invalid field when form submission fails.
  - Use `role="alert"` / `aria-live="assertive"` for error containers and `role="status"` / `aria-live="polite"` for asynchronous submit status regions.

## 3. Automated Verification & Boundary Coverage
- **Rule:** Never mark a feature complete without running an executable unit test suite (`npm test`).
- **Implementation:**
  - All input string checks must explicitly test for whitespace trimming (`.trim()`), min/max bounds, and malformed regex patterns.
  - Submit handlers must explicitly prevent default page reload (`e.preventDefault()`) and disable submit buttons during pending async requests to prevent duplicate submissions.
