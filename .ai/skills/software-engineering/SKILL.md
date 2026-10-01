# Software Engineering Skill — GiaPhuc_MyProject

> Reusable AI Engineering Skill for the **Admin Staff Account Management + RBAC
> + Profile Permission** project. This skill teaches an AI agent how to
> implement, document, test, model and track work in this repository
> **without inventing architecture**.

---

## 0. How to use this skill

When an AI agent is asked to:

- implement a new feature,
- modify an existing feature,
- analyse a change,
- update documentation / UML,
- audit consistency,

it MUST follow the workflow in **§1 Workflow** below and obey every rule under
**§2 Rules**. Each rule is a single short file under `rules/` so the agent can
load only what it needs.

This skill is **layered on top of the project's existing documentation**. It
does NOT replace them — it references and orchestrates them.

| Existing artefact (do not duplicate) | Used for |
| ------------------------------------ | -------- |
| `docs/UC/UC-PACKAGE.md`              | authoritative UC definitions (UC-01..UC-08) |
| `docs/tests/UNIT-TEST.md`            | authoritative unit-test cases (UT-01..UT-25) |
| `docs/tests/SYSTEM-TEST.md`          | authoritative system-test scenarios (ST-01..ST-24) |
| `docs/plantuml/CD-*.puml`, `SD-*.puml` | authoritative UML — must match implementation |
| `docs/BACKLOG.md`                    | authoritative status & issues ledger |
| `docs/DOC-GUIDE.md`                  | documentation policy (extends rule 08) |
| `README.md`                          | public-facing entry point |

The skill **does** provide new artefacts that did not exist before:

- change-impact matrix (`rules/11-change-impact-analysis.md`)
- drift detection process (rule `10-validation.md`)
- checklists (`checklists/`)
- per-UC examples (`examples/UC-XX-*`) that consolidate UC + SD + UT + ST for one slice
- structured PlantUML templates so generated diagrams are visually consistent.

---

## 1. Workflow

Every task runs through **seven phases**, in order. Skipping a phase is a defect.

| Phase | Output | Tooling / artefacts |
| ----- | ------ | ------------------- |
| A — Discover | list of relevant files + ids | `Grep`, `Glob`, `Read` |
| B — Change Impact Analysis | impact matrix | `rules/11-change-impact-analysis.md` |
| C — Implement | source-code change | existing `backend/src/**`, `frontend/src/**` |
| D — Test | passing test command + result | `npm test`, `npm run lint` |
| E — Documentation Update | doc diff | `rules/08-documentation.md` |
| F — UML Update | puml diff | `rules/04-class-diagram.md`, `05-sequence-diagram.md` |
| G — Final Consistency Validation | checklist with PASS/FAIL | `checklists/release-checklist.md` |

Full phase descriptions live in the parent task brief that produced this skill;
they are summarised again in `rules/02-architecture.md`.

---

## 2. Rules (11 short files in `rules/`)

| # | File | One-line summary |
| - | ---- | ---------------- |
| 01 | `01-source-of-truth.md` | When docs disagree with code, code wins; report drift, don't silently edit code to match a stale diagram. |
| 02 | `02-architecture.md` | The Router→Middleware→Controller→Service→Repository→Model pattern is a default, not a law. Only include participants that actually participate. |
| 03 | `03-use-case.md` | UCs must follow the `UC-PACKAGE.md` template; never silently renumber UC IDs. |
| 04 | `04-class-diagram.md` | Class Diagrams reflect real classes only; orthogonal edges; black & white. |
| 05 | `05-sequence-diagram.md` | Sequence Diagrams reflect real runtime calls; `actor / boundary / control / repository / entity / database` categories. |
| 06 | `06-plantuml-style.md` | Reusable skinparam block; no colours; avoid syntax that creates accidental blue links. |
| 07 | `07-testing.md` | UT/ST docs mirror real executed tests; never claim PASS without command + output. |
| 08 | `08-documentation.md` | Follow `docs/DOC-GUIDE.md`; this rule is an AI-specific addendum. |
| 09 | `09-backlog.md` | One row per task in BACKLOG.md; one row per issue in Project Issues. |
| 10 | `10-validation.md` | Drift detection + final consistency check before declaring done. |
| 11 | `11-change-impact-analysis.md` | Build a 12-column impact matrix before editing; refuse edits to unaffected files. |

---

## 3. Templates (in `templates/`)

These are **shells** — AI fills them in.

| Template | Mirrors existing doc | Notes |
| -------- | -------------------- | ----- |
| `use-case-template.md` | `docs/UC/UC-PACKAGE.md` | Field table identical to UC-PACKAGE.md. |
| `class-diagram-template.puml` | `docs/plantuml/CD-01-Staff-Management.puml` | Uses the project's standard skinparams. |
| `sequence-diagram-template.puml` | `docs/plantuml/SD-01-Create-Staff.puml` | Uses the project's standard skinparams. |
| `unit-test-template.md` | `docs/tests/UNIT-TEST.md` | 7-column table. |
| `system-test-template.md` | `docs/tests/SYSTEM-TEST.md` | 7-column table. |
| `backlog-template.md` | `docs/BACKLOG.md` | Two sections: Status Report + Project Issues. |

---

## 4. Checklists (in `checklists/`)

| File | When to use |
| ---- | ----------- |
| `implementation-checklist.md` | After every code change, before committing. |
| `documentation-checklist.md` | After writing docs, before committing. |
| `uml-checklist.md` | After generating any puml. |
| `release-checklist.md` | Before declaring a milestone / UC complete. |

---

## 5. Examples (in `examples/`)

Eight per-UC working examples — one per UC in the existing package. **The folder
names match `docs/UC/UC-PACKAGE.md`**, NOT the informal list in the task brief.
A `examples/README.md` explains the discrepancy (Login/Refresh are candidates
for UC-09 / UC-10 and are not yet in `UC-PACKAGE.md`).

Each example folder contains a small, **traceable** set of artefacts:

```
UC-XX-Name/
  README.md        # one-paragraph summary + links to UC-PACKAGE / SD / UT / ST
  notes.md         # change-impact matrix + drift notes for this UC
  sd-stub.puml     # reference (or extension) to docs/plantuml/SD-XX-*.puml
```

Examples are intentionally **small** — they illustrate the workflow, not the
full implementation. The real artefacts live in `docs/`.

---

## 6. Source-of-truth priority

When sources disagree, use this order (highest priority first):

1. Explicit current user requirement
2. Actual source code (`backend/src/**`, `frontend/src/**`)
3. Actual tests (`backend/tests/**`)
4. Existing API implementation (router → controller → service)
5. Existing model / repository implementation
6. Existing approved UC (`docs/UC/UC-PACKAGE.md`)
7. Existing Class Diagram (`docs/plantuml/CD-*.puml`)
8. Existing Sequence Diagram (`docs/plantuml/SD-*.puml`)
9. README / `docs/DOC-GUIDE.md`
10. Previous AI assumptions (lowest — always re-check)

If 1-9 disagree, **stop and report**. Do not pick a winner unilaterally.

---

## 7. Completion gate

A task is **not** complete until every box in
`checklists/release-checklist.md` is checked. The single most-skipped step
historically is **PHASE G — final consistency validation**. Treat it as a hard
gate.

---

## 8. Out of scope

This skill does NOT cover:

- infrastructure provisioning (MongoDB Atlas cluster, SMTP provider swap)
- CI/CD pipeline setup
- production hardening (rate limiting, httpOnly cookies) — these are tracked in
  `docs/BACKLOG.md` Project Issues #5, #6.
- renumbering of existing UC IDs
- changing existing PlantUML style without updating rule 06 and `DOC-GUIDE.md`.

---

Owner: **Huỳnh Gia Phúc**  
Last updated: 2026-10-02
