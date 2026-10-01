# UC-05 — Activate / Deactivate Account (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-05--activate--deactivate-account)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml`
- Sequence Diagram: `docs/plantuml/SD-05-Activate-Deactivate.puml`
- Unit Tests: `UT-23`, `UT-24`
- System Tests: `ST-10`, `ST-11`

## One-paragraph summary

Caller PATCHes `/api/staff/:id/status` with `{isActive}`. Backend updates the
user, returns the safe DTO. Required permission: `UPDATE_STAFF`. Deactivated
users are blocked from authenticating — `authenticate` middleware returns
`403 Forbidden` (the `User.isActive === false` check lives in
`auth.middleware.js`).

## Drift

- None known. `setActive` method in `staff.service.js` matches SD-05 label.
