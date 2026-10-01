# UC-07 — Check Profile Permission (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-07--check-profile-permission)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml` (PermissionMiddleware)
- Sequence Diagram: authZ branch inside `docs/plantuml/SD-02-View-Profile.puml`
- Unit Tests: `UT-12`, `UT-13`, `UT-14`, `UT-15`, `UT-16`, `UT-17`
- System Tests: implicit in every protected route's ST-XX row

## One-paragraph summary

Middleware `requirePermission(...perms)` checks `req.user.role.permissions`.
If **all** listed permissions are present → `next()`; otherwise throws
`ApiError(403, "Missing permission(s): X, Y")`. The middleware requires
`req.user` to be set by `authenticate`; without it → `401`. If the role is
null → `403`.

## Drift

- The UC body says "If X is in the set → continue". The actual behaviour is
  "ALL of X, Y, … must be in the set". `UT-17` documents this clearly.
  Suggest updating the UC body to: "If **all** required permissions are in
  `req.user.role.permissions` → continue; otherwise → 403."
