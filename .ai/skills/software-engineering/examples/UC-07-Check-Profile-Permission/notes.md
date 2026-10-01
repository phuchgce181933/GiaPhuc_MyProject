# UC-07 — Impact matrix (delta)

| Area | Notes |
| ---- | ----- |
| Backend module | `middlewares/permission.middleware.js` |
| Backend tests | `permission.middleware.test.js` (UT-12..17) |
| Frontend | none (backend-only) |
| Permissions | n/a (this UC **enforces** permissions) |
| UC | UC-07 body |
| CD | `CD-01` (PermissionMiddleware) |
| SD | authZ branch in `SD-02` |
| UT | `UT-12..17` |
| ST | implicit across all protected ST rows |
| Backlog | Status #3 (RBAC layer) |

## Drift

ALL-vs-ANY semantics: see `README.md`. Update UC body, not implementation.
