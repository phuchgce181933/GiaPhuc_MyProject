# UC-02 — View Staff Profile (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-02--view-staff-profile-by-admin--authorised-user)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml`, `CD-02-Profile-and-Auth.puml`
- Sequence Diagram: `docs/plantuml/SD-02-View-Profile.puml`
- Unit Tests: `UT-12` .. `UT-17` (permission middleware behaviour)
- System Tests: `ST-04`, `ST-05`

## One-paragraph summary

A user with `VIEW_PROFILE` views another user's profile by id. Frontend calls
`GET /api/staff/:id` (or `GET /api/profile/:id`). The route enforces
`VIEW_PROFILE` via `requirePermission`. The response uses the safe DTO — no
`passwordHash`, no `activationToken`. Missing token → 401; missing permission
→ 403; unknown id → 404.

## Drift

- The UC body mentions both `/api/staff/:id` and `/api/profile/:id`. Both are
  real endpoints; `profile/:id` exists in `backend/src/modules/profile/`.
- `requirePermission('VIEW_PROFILE')` middleware is registered on the
  `profile` router. The `staff` router's `:id` route uses `VIEW_STAFF`, not
  `VIEW_PROFILE`. This is a real divergence in the implementation — UC-02
  currently mixes both. Tracking in `docs/BACKLOG.md` is recommended if the
  product team wants to align the permissions.
