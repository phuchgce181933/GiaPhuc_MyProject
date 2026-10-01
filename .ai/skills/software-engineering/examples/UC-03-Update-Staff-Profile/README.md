# UC-03 — Update Staff Profile (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-03--update-staff-profile)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml`
- Sequence Diagram: `docs/plantuml/SD-03-Update-Staff.puml`
- Unit Tests: `UT-04`, `UT-05`, `UT-25` (validator behaviour)
- System Tests: `ST-06`, `ST-07`

## One-paragraph summary

Caller PUTs `/api/staff/:id` with `{fullName?, email?, phone?, address?,
status?}`. Backend re-validates, runs duplicate checks on email/phone change,
persists the patch, returns the safe DTO. Email is lowercased (`UT-25`).
Required permission: `UPDATE_STAFF`. Conflicts return `409`; missing id
returns `404`.

## Drift

- None known. SD-03 method labels match `staff.service.js` (`updateStaff`).
