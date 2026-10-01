# Rule 11 — Change Impact Analysis

Before editing **any** file, build a 12-column impact matrix.

## The matrix

| Area | Affected? | Files | Reason |
| ---- | --------- | ----- | ------ |
| Backend module(s) | yes/no | path:line | which method/route changes |
| Backend tests | yes/no | path | new or updated test cases |
| Frontend pages | yes/no | path | which page consumes the change |
| Frontend API module | yes/no | path | which axios wrapper changes |
| Database / models | yes/no | path | new field, index, or migration |
| Permissions | yes/no | path | permission constant affected |
| ENV vars | yes/no | path | new var, value change, removal |
| Use Case (UC-PACKAGE.md) | yes/no | UC id | flow or contract change |
| Class Diagram | yes/no | CD id | class added/removed/renamed |
| Sequence Diagram | yes/no | SD id | new arrow / new participant |
| Unit Test doc | yes/no | UT id | new or updated case |
| System Test doc | yes/no | ST id | new or updated scenario |
| Backlog Status row | yes/no | row id | which task completes |
| Backlog Issue row | yes/no | row id | new debt surfaced |
| README | yes/no | section | API table / env table / architecture |

## Decision rule

If an area is **NOT** affected, do not edit it. The matrix exists to prevent
drive-by edits.

## When the matrix is large (>10 affected rows)

- Split the work into multiple commits (one per logical area).
- Each commit must leave the repo in a consistent state (tests + lint pass).

## When the matrix is small (<3 rows)

- A single commit is fine.
- Still include the matrix in the response so the user can audit.
