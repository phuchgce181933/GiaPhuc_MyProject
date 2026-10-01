# Rule 03 — Use Case

UCs follow the **exact** field table used in `docs/UC/UC-PACKAGE.md`:

| Field | Value |
| ----- | ----- |
| UC Name | … |
| UC ID | UC-XX |
| Feature | … |
| Actor | … |
| Description | … |
| Precondition | … |
| Main Flow | numbered steps |
| Alternative Flow | … |
| Exception Flow | … |
| Postcondition | … |

Additional columns the existing package uses (keep them):

- Related API
- Permission
- Related classes
- Related tests
- Class Diagram reference (`CD-XX`)
- Sequence Diagram reference (`SD-XX`)

## Numbering

- UC IDs are **stable**. Never silently renumber.
- The current package contains **UC-01 .. UC-08** for Staff Management. See
  `examples/README.md` for the discrepancy with the informal "UC-01 Login"
  list in the task brief that produced this skill.
- If a feature is genuinely new, propose the next free number (UC-09) and
  **justify** it.

## Templates

Use `templates/use-case-template.md` as a shell, then mirror it into
`docs/UC/UC-PACKAGE.md` — do not create a separate `UC-XX.md` file.

## Anti-patterns

- A UC without Actor or Precondition.
- A UC whose Main Flow includes a class / method that does not exist.
- A UC duplicating another (use "Related UC" instead).
- A UC that documents *intended* behaviour not yet implemented (must be marked
  as such in BACKLOG).
