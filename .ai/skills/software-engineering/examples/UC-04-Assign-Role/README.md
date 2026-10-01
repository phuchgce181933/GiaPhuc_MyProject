# UC-04 — Assign Role (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-04--assign-role)
- Class Diagram: `docs/plantuml/CD-01-Staff-Management.puml`
- Sequence Diagram: `docs/plantuml/SD-04-Assign-Role.puml`
- Unit Tests: `UT-21`, `UT-22`
- System Tests: `ST-08`, `ST-09`

## One-paragraph summary

Caller PATCHes `/api/staff/:id/role` with `{roleId}`. Backend verifies the role
exists in `RoleRepository`, updates `user.role`, returns the safe DTO.
Required permission: `ASSIGN_ROLE`. Note that the JWT is **not** re-issued —
the new role is effective on the next request because `req.user` is populated
fresh each time (the access token only carries `sub`).

## Drift

- The UC body says "effective immediately on subsequent JWT refresh". This is
  a slight inaccuracy: the role is effective on the next request, not the next
  refresh — `req.user` is decoded from the same JWT but the `User` is fetched
  fresh from DB each request. Drift is documented in `rules/01-source-of-truth.md`
  format; recommend updating the UC body to "effective on next request".
