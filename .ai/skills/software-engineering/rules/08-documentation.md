# Rule 08 — Documentation

This rule is an **AI-specific addendum** to `docs/DOC-GUIDE.md`. Read the
DOC-GUIDE first; it is authoritative for documentation policy. This rule only
adds the workflow layer the AI must follow.

## AI documentation workflow

After every code change, run:

1. **Phase A** — did the change touch any of: README, UC package, BACKLOG,
   unit tests, system tests, PlantUML, `.env.example`?
2. If yes → list the affected files in the response (in the *Implementation
   Summary → Documentation Updated* section).
3. If no → say "no documentation update required" explicitly.

## Update granularity

- Update only the sections of a doc that the change actually affects.
- Never rewrite a whole doc just because one row changed.
- Never copy the entire implementation into a doc — describe the behaviour, not
  the source.

## Source-of-truth interaction

If a doc contradicts the implementation after a code change, follow rule 01
(source of truth): the implementation wins, the doc is updated, and the
discrepancy is reported.

## Adding a new doc file

Before creating a new doc file:

1. Confirm no existing doc covers it (search `docs/` and README).
2. Confirm the user has approved a new file (default = no).
3. Add a row to BACKLOG.md describing the new doc.

## Anti-patterns

- Writing a doc before the code is merged.
- Writing "this will be implemented" without marking the row as `Not Executed`.
- Hard-coding API paths or status codes that disagree with the router.
- Adding example values that look pretty but contradict the validator.
