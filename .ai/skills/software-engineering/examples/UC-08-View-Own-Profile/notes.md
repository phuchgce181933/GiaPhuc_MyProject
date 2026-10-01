# UC-08 — Impact matrix (delta)

| Area | Notes |
| ---- | ----- |
| Backend module | `modules/profile/profile.{router,controller,service}.js` |
| Backend tests | covered indirectly via authenticate middleware tests |
| Frontend | `ProfilePage.jsx`, `profile.api.js#getMe` |
| Permissions | none (any authenticated user) |
| Auth middleware | `auth.middleware.js#authenticate` enforces active state |
| UC | UC-08 body |
| CD | `CD-02` |
| SD | `SD-06` |
| UT | `UT-12`, `UT-14` |
| ST | `ST-12`, `ST-13` |
| Backlog | Status #5 (Profile module) |

## Drift

None known.
