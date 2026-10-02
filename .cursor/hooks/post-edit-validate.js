/**
 * post-edit-validate.js
 *
 * Cursor hook: afterFileEdit
 * Runs after AI writes/edits any file.
 * Checks: was a backend/frontend source file edited?
 *   → If yes, inject reminder to update UC docs + SD/CD.
 *
 * Exit 0: always allow (fail-open). Hook reminder only.
 * Exit 2: would block (not used here — fail-open).
 */

const fs = require('fs');
const path = require('path');

// Read stdin JSON from Cursor
let rawInput = '';
process.stdin.on('data', chunk => { rawInput += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(rawInput || '{}');
    const filePath = input.filePath || '';

    // Files that trigger the UC/docs reminder
    const SOURCE_PATTERNS = [
      /^backend\/src\/modules\//,
      /^backend\/src\/models\//,
      /^backend\/src\/middlewares\//,
      /^backend\/src\/services\//,
      /^backend\/src\/config\//,
      /^frontend\/src\/pages\//,
      /^frontend\/src\/components\//,
      /^frontend\/src\/api\//,
      /^frontend\/src\/hooks\//,
    ];

    const isSourceFile = SOURCE_PATTERNS.some(p => p.test(filePath));

    if (isSourceFile) {
      // Build reminder — printed to agent's context
      const reminder = `
[Skill Hook — post-edit-validate]
File edited: ${filePath}
REMINDER: After code change, you MUST:
  1. Run Phase E (docs) — update docs/UC/UC-PACKAGE.md if endpoint/permission changed
  2. Run Phase F (UML)  — update SD-XX-*.puml and CD-XX-*.puml
  3. Run Phase G (validate) — run checklists/release-checklist.md before declaring done
  4. Run Phase D (test) — npm test + npm run lint

Source-of-truth: code change must be reflected in UC docs and diagrams before commit.
      `.trim();

      console.log(JSON.stringify({
        additional_context: reminder
      }));
      process.exit(0);
    } else {
      // Non-source file — silent allow
      process.exit(0);
    }
  } catch (e) {
    // Fail-open: if hook crashes, allow the edit
    process.exit(0);
  }
});
