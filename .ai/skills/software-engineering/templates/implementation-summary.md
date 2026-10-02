# Implementation Summary Template

Use this template in the **final response** of every task. Fill in every
section; leave no `TBD` or `n/a` without an explanation.

---

```md
# Implementation Summary

## 1. Changed
- <bullet — one logical unit per bullet, group by file when helpful>

## 2. Files Changed
- `<path/to/file>` (each file touched, including created ones)

## 3. Tests
- command: `<the exact command, e.g. \`cd backend && npm test\`>`
- result: `<PASS — N/N passed on YYYY-MM-DD>` or
          `<FAIL — N failures, see <file:line>>` or
          `<N/A — reason>`

## 4. Documentation Updated
- `<path/to/doc>` — <one-line summary of what changed>
- (or "no documentation update required" — must be intentional)

## 5. UML Updated
- Class Diagram: `<CD-XX-<Name>.puml modified? new?>` or `<no UML change>`
- Sequence Diagram: `<SD-XX-<Name>.puml modified? new?>` or `<no UML change>`
- Traceability table in `docs/UC/UC-PACKAGE.md` updated: yes / no / N/A

## 6. Backlog Updated
- Status row: `<new row #N | edited row #M>` or `<no backlog change>`
- Issue row: `<new row #N | edited row #M | no new issue>`

## 7. Validation
- Architecture: PASS / FAIL / N/A — <one-line evidence>
- Tests: PASS / FAIL / N/A — <one-line evidence>
- Documentation: PASS / FAIL / N/A — <one-line evidence>
- UML: PASS / FAIL / N/A — <one-line evidence>
- Configuration / security: PASS / FAIL / N/A — <one-line evidence>

## 8. Remaining Issues
- `None`
- or `<list of open items with severity (blocker / major / minor) and
  recommended next action>`
```

---

## Truthfulness rules

- A `PASS` requires the **command + observed output** that backs it.
  - Example: `Tests: PASS — \`npm test\` 25/25 passed on 2026-10-02`.
- A `FAIL` requires the failing output (not just "regression").
- An `N/A` requires a one-sentence explanation. Examples:
  - `N/A — no source code touched, documentation-only commit`.
  - `N/A — change is in a sub-module with its own pipeline (not in scope)`.
- "Not yet tested" is `N/A`, **never** `PASS`.
- If you did not run the command, say so. Do not invent counts.

## Header before the summary

Add a single line at the very top of the response:

```
Change types: <TYPE A–H list>
Impact matrix: <15 rows, link to it or inline table>
```

This makes the rest of the response auditable in 5 seconds.

## Worked example

```md
Change types: TYPE C, TYPE D
Impact matrix: 15 rows, 6 Yes / 9 No (inline)

# Implementation Summary

## 1. Changed
- Add `statusCode` field to staff update response envelope.
- `StaffService.updateStaff` now returns the safe DTO even on no-change.

## 2. Files Changed
- `backend/src/modules/staff/staff.service.js`
- `backend/src/modules/staff/staff.controller.js`
- `docs/UC/UC-PACKAGE.md`
- `docs/tests/UNIT-TEST.md`
- `docs/BACKLOG.md`

## 3. Tests
- command: `cd backend && npm test`
- result: PASS — 26/26 passed on 2026-10-02

## 4. Documentation Updated
- `docs/UC/UC-PACKAGE.md` — UC-03 Postcondition updated.
- `docs/tests/UNIT-TEST.md` — UT-26 added.

## 5. UML Updated
- Class Diagram: no UML change (signature unchanged)
- Sequence Diagram: SD-03 — added `Svc --> Ctrl : statusCode` arrow.
- Traceability table in UC-PACKAGE.md: N/A (no UC added)

## 6. Backlog Updated
- Status row: edited row #4 (note appended)
- Issue row: no new issue

## 7. Validation
- Architecture: PASS — no new layer added.
- Tests: PASS — 26/26.
- Documentation: PASS — UC-03 body reflects new behavior.
- UML: PASS — SD-03 label matches `updateStaff(...)` signature.
- Configuration / security: N/A — no env / secret change.

## 8. Remaining Issues
- None
```