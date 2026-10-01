# UC-08 — View Own Profile (example)

## Canonical references

- UC body: [`docs/UC/UC-PACKAGE.md`](../../../../../docs/UC/UC-PACKAGE.md#uc-08--view-own-profile)
- Class Diagram: `docs/plantuml/CD-02-Profile-and-Auth.puml`
- Sequence Diagram: `docs/plantuml/SD-06-View-Own-Profile.puml`
- Unit Tests: `UT-12`, `UT-14` (authenticate middleware behaviour)
- System Tests: `ST-12`, `ST-13`

## One-paragraph summary

Authenticated user GETs `/api/profile/me`. The route only needs
`authenticate` — **no `requirePermission`**. Returns the safe DTO of the
caller. Inactive account → `403` (authenticate blocks). Missing token →
`401`.

## Drift

- None known. `profile.service.js#getMe` matches SD-06 label.
