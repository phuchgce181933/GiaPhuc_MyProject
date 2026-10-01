# Gia Phuc — Admin Staff Account Management

A production-oriented Node.js / React implementation of **Admin Staff Account
Management + RBAC + Profile Permission** with email notification,
environment-driven configuration, and full test/UC/PlantUML documentation.

> 📝 **Đang viết tài liệu?** Đọc `docs/DOC-GUIDE.md` trước — nó chỉ rõ file nào cần cập nhật cho từng loại thay đổi.
>
> Nghiệp vụ tổng quan nằm trong `docs/UC/UC-PACKAGE.md` (8 use case).
>
> 🤖 **AI agent / collaborator mới?** Đọc `.ai/skills/software-engineering/SKILL.md` — workflow 7 pha (Discover → Impact → Implement → Test → Docs → UML → Validate) với rules, templates và checklists có sẵn cho repo này.

## Stack

* **Backend:** Node.js 18+ / Express 4 / Mongoose 8 / JWT / Zod / Nodemailer
* **Frontend:** React 18 / Vite 5 / React Router 6 / Axios
* **Tests:** Jest 29 (backend unit tests)
* **Lint:** ESLint 8

## Layout

```
.
├── backend/
│   ├── src/
│   │   ├── app.js            # Express app factory
│   │   ├── server.js         # Bootstrap
│   │   ├── config/           # env / db / mail
│   │   ├── constants/        # permission names
│   │   ├── middlewares/      # auth / permission / validate / error
│   │   ├── models/           # User / Role / Permission (Mongoose)
│   │   ├── modules/
│   │   │   ├── auth/         # login + refresh
│   │   │   ├── staff/        # CRUD + role + status
│   │   │   ├── role/
│   │   │   ├── permission/
│   │   │   └── profile/      # /me and /:id (VIEW_PROFILE)
│   │   ├── services/         # EmailService
│   │   └── utils/            # ApiError, JWT, logger
│   ├── scripts/seed.js       # Idempotent seed
│   ├── tests/unit/           # 25 passing tests
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # axios + per-resource API modules
│   │   ├── components/       # Layout + common UI helpers
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # usePermission
│   │   ├── pages/            # Login, Staff (list/create/edit/view), Profile
│   │   └── router/           # App router with PrivateRoute
│   ├── .env.example
│   └── package.json
└── docs/
    ├── UC/UC-PACKAGE.md            # UC-01..UC-08
    ├── tests/UNIT-TEST.md          # 25 cases
    ├── tests/SYSTEM-TEST.md        # 24 scenarios
    ├── plantuml/                   # CD-01, CD-02, SD-01..SD-06
    ├── BACKLOG.md                  # Status report + issues
    └── DOC-GUIDE.md                # Documentation policy

.ai/
  skills/
    software-engineering/           # AI engineering skill (see SKILL.md)
      SKILL.md                      # 7-phase workflow + source-of-truth rules
      rules/                        # 11 concise rule files
      templates/                    # 6 reusable templates (UC/CD/SD/UT/ST/backlog)
      checklists/                   # 4 release / docs / UML / impl checklists
      examples/UC-01..UC-08/        # per-UC working examples
```

## Backend — quick start

```bash
cd backend
cp .env.example .env       # then fill in real values (see below)
npm install
npm run seed               # creates permissions + roles + (optional) admin
npm run dev                # http://localhost:5000
npm test                   # 25 tests
npm run lint
```

### Required environment variables (backend)

| Variable | Notes |
| -------- | ----- |
| `MONGODB_URI` | Full Mongo connection string (Atlas or self-hosted). |
| `MONGODB_DB` | Database name.  Defaults to `giaphuc` at runtime; Jest sets `test_giaPhuc` in `tests/setup.js` so unit tests never touch the production DB. |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Long random strings. |
| `MAIL_USER` | Gmail address. |
| `MAIL_PASS` | Gmail **App Password**, not the account password. |
| `FRONTEND_URL` / `BACKEND_URL` | Public URLs, no localhost in source. |
| `PORT` | Defaults to `5000`. |

### Seed admin (optional)

Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME` in `backend/.env`,
then run `npm run seed`. The admin receives every permission.

## Frontend — quick start

```bash
cd frontend
cp .env.example .env       # set VITE_API_URL
npm install
npm run dev                # http://localhost:5173
npm run build
npm run lint
```

## API surface

All endpoints require `Authorization: Bearer <accessToken>` except
`/api/auth/login` and `/api/auth/refresh`.

| Method | Path | Permission |
| ------ | ---- | ---------- |
| POST | `/api/auth/login` | (public) |
| POST | `/api/auth/refresh` | (public, needs refresh token) |
| GET | `/api/profile/me` | (any authenticated user) |
| GET | `/api/profile/:id` | `VIEW_PROFILE` |
| GET | `/api/staff` | `VIEW_STAFF` |
| GET | `/api/staff/:id` | `VIEW_STAFF` |
| POST | `/api/staff` | `CREATE_STAFF` |
| PUT | `/api/staff/:id` | `UPDATE_STAFF` |
| PATCH | `/api/staff/:id/role` | `ASSIGN_ROLE` |
| PATCH | `/api/staff/:id/status` | `UPDATE_STAFF` |
| GET | `/api/roles` | `VIEW_STAFF` |
| GET | `/api/roles/:id` | `VIEW_STAFF` |
| GET | `/api/permissions` | `VIEW_STAFF` |

### Response envelope

```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "details": null
}
```

Errors return `success: false` with a `code` (e.g. `DUPLICATE_KEY`,
`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`).

## Security

* Passwords are hashed with bcrypt (salt rounds = 10); `passwordHash` is
  `select:false` and stripped from responses by `toSafeJSON()`.
* No credentials / tokens / secrets in any log line.
* Email failures do not roll back the database — the API returns the
  account and an `emailNotificationSent` flag.
* No class, component, route or service hard-codes `localhost`, `127.0.0.1`,
  MongoDB URIs, JWT secrets or email passwords — everything is env-driven.
