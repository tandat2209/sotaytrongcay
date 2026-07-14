---
name: verification-and-handoff
description: Verify and report completion of implementation work in this repository. Use before declaring any code, UI, knowledge compiler, schema, or behavior change finished, and whenever selecting test, typecheck, lint, export, or knowledge-validation commands.
---

# Verification and handoff

Read the quality-gate and reporting sections of `docs/ENGINEERING_STANDARDS.md`, then choose the smallest sufficient checks from `package.json` for the affected surface.

## Required review

- Test the changed behavior at the appropriate level.
- Consider empty, loading, error, offline, and invalid-data states where applicable.
- For UI changes, check mobile usability, accessibility labels/roles, touch targets, and visible state feedback.
- Keep sensitive data out of logs and errors.
- Confirm related documentation is current.
- Inspect the final diff for unrelated changes and accidental generated output.

## Available commands

Use pnpm, matching the repository package manager:

- Format check: `pnpm format:check`
- TypeScript: `pnpm typecheck`
- Lint: `pnpm lint`
- Tests: `pnpm test`
- Expo export: `pnpm export`
- Knowledge validation and production compilation: `pnpm knowledge:check`
- Knowledge preview compilation when preview artifacts are intentionally changed: `pnpm knowledge:compile:preview`

Do not run every command mechanically. Run the checks required by the affected surface and report any skipped gate with the reason.

## Final report

State:

1. what changed;
2. why it changed;
3. architectural or product decisions made;
4. possible improvements that are genuinely useful but outside scope;
5. exact commands run and their outcomes, including failures or skipped checks.

Never describe unrun verification as passed.
