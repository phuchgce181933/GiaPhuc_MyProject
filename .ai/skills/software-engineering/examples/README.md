# Examples Index

Eight per-UC working examples, one per UC in the existing
`docs/UC/UC-PACKAGE.md`.

## Discrepancy with the task brief

The task brief that produced this skill listed example folder names as
`UC-01-Login`, `UC-02-Refresh`, …`UC-08-Permission`. The actual `UC-PACKAGE.md`
uses different UC IDs and names:

| Brief name | Actual UC id | Actual UC name |
| ---------- | ------------ | -------------- |
| UC-01 Login | UC-01 | Create Staff Account |
| UC-02 Refresh | UC-02 | View Staff Profile |
| UC-03 Create Staff | UC-03 | Update Staff Profile |
| UC-04 Update Staff | UC-04 | Assign Role |
| UC-05 Assign Role | UC-05 | Activate / Deactivate Account |
| UC-06 Update Status | UC-06 | Send Staff Account Notification |
| UC-07 Profile | UC-07 | Check Profile Permission |
| UC-08 Permission | UC-08 | View Own Profile |

Per rule 01 (source of truth), the actual package wins. The folders below
match `UC-PACKAGE.md`.

## Login / Refresh

The auth module exists in `backend/src/modules/auth/` (login + refresh) but is
**not** part of `UC-PACKAGE.md`. If you want to document it, propose:

- UC-09 — Login
- UC-10 — Refresh Token

before adding rows to `UC-PACKAGE.md`. Do not silently create them.

## Folder layout

```
UC-XX-<Name>/
  README.md    # summary + cross-links
  notes.md     # change-impact matrix + drift notes
```

Each folder is intentionally tiny. The full artefacts live in:

- `docs/UC/UC-PACKAGE.md` (UC body)
- `docs/plantuml/CD-*.puml`, `SD-*.puml` (diagrams)
- `docs/tests/UNIT-TEST.md`, `SYSTEM-TEST.md` (tests)
- `docs/BACKLOG.md` (status + issues)
