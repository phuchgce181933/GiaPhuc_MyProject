# Rule 04 — Class Diagram

Use `templates/class-diagram-template.puml` as the starting shell.

## Inclusion rules

Only draw a class when **all** of the following hold:

- the class file exists under `backend/src/` or `frontend/src/`;
- the class participates in the UC being modelled.

## Attributes and methods

- Use `+ public`, `- private`, `# protected`.
- Omit getters/setters unless they carry business logic.
- Keep attributes to **important fields only** (`passwordHash`, `isActive`,
  `role`, etc.). Skip timestamps unless they're part of the UC.
- Methods listed must exist as defined in the source.

## Relationships

| Notation | When |
| -------- | ---- |
| `-->`   | A calls a method on B (control dependency). |
| `..>`   | A instantiates / uses B without holding a reference (factory / util). |
| `--\|>` | Inheritance. |
| `..\|>` | Implementation of an interface (this repo has none yet). |
| `*--`   | Composition (B cannot exist without A). |
| `o--`   | Aggregation (B can exist without A). |

Default direction: top-down (Router at top, DB not drawn on CD).

## Style

- Black & white only. See rule 06.
- Orthogonal edges (`linetype ortho`).
- Use the project's existing skinparam block.

## Anti-patterns

- Drawing a "DatabaseManager", "UserManager", "BaseController", "BaseRepository"
  unless the file exists.
- Drawing every method on every class.
- Adding classes that "look architecturally correct" but are not in `src/`.
- Drawing a UC's CD with classes from a different UC just because they share
  a module.
