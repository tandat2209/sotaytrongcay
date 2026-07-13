# Mandatory engineering standards

This document is the working contract for every code change. If a request conflicts with it, report the conflict before implementation.

## 1. Non-negotiable rules

- Never use `any`. Start untrusted values as `unknown`, then narrow or parse them.
- Keep TypeScript strict mode enabled; never weaken compiler checks to make code pass.
- Never modify unrelated files or overwrite uncommitted user work.
- Explain each architectural decision through context, decision, rationale, and consequences.
- Keep every component below 200 lines, including imports.
- Prefer composition over inheritance.
- Reuse components when semantics and interaction match; avoid flag-heavy abstractions.
- Build one complete feature slice at a time.
- Do not add placeholder code, empty handlers, fake success paths, or unfinished screens.
- Do not add `TODO`, `FIXME`, or equivalent source comments. Track future work in `TODO.md` or the issue tracker.
- Do not create mock or fake implementations unless explicitly requested.
- Follow current Expo, React Native, and Supabase best practices for installed versions.
- Preserve security, accessibility, offline safety, observability, and testability.

## 2. Change scope

Before editing:

1. Read the product, UX, architecture, decision, and feature documentation.
2. Inspect `git status` and preserve existing work.
3. Identify the owning feature and affected public interface.
4. Identify each file that must change and why.

During editing:

- Keep the diff small and single-purpose.
- Do not format, rename, upgrade, or refactor unrelated areas.
- Report nearby issues as possible improvements instead of silently expanding scope.
- Stop and explain if a new out-of-scope file becomes necessary.

## 3. Feature delivery workflow

1. Confirm the user outcome and acceptance criteria.
2. Update domain language or decisions when required.
3. Define the model and invariants.
4. Implement persistence and application behavior.
5. Connect query/mutation state and UI.
6. Handle loading, empty, error, offline, and accessibility states.
7. Test through the feature's public interface.
8. Run quality gates and update related documentation.

Do not scaffold empty future features. Every created file must support behavior delivered in the current task.

## 4. Architectural decisions

Every architectural explanation must include:

- **Context:** the problem or constraint.
- **Decision:** the selected approach.
- **Rationale:** why it fits this project.
- **Consequences:** benefits, costs, risks, and operational effects.
- **Alternatives:** only when alternatives were genuinely considered.

Create an ADR only for a hard-to-reverse choice with a real trade-off that would be surprising without context.

## 5. TypeScript

- Enable `strict`; prefer `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` when compatible.
- Ban `any`, `as any`, `@ts-ignore`, and `@ts-nocheck`.
- Use `@ts-expect-error` only for intentional type tests, with a reason.
- Parse environment, routes, deep links, notifications, and untrusted I/O with Zod.
- Use discriminated unions for state machines and error states.
- Use branded IDs to prevent entity-ID mixups.
- Avoid non-null assertions unless the invariant is proven locally.
- Regenerate generated types; never edit them manually.

## 6. Components and composition

- A component has one clear UI purpose and stays below 200 lines.
- Screens compose UI; feature model/application modules own business behavior.
- Extract a component for independent semantics, real reuse, or clearer screens.
- Extract hooks for reusable React behavior, not core business rules.
- Keep feature components in their feature until compatible reuse exists.
- Shared UI contains stable design primitives, not domain behavior.
- Prefer slots, composition, or finite variants over many boolean props.
- Do not use inheritance for React components or domain models.

## 7. Expo and React Native

- Use Expo Router; keep route files thin.
- Prefer supported Expo modules before custom native dependencies.
- Verify Expo SDK compatibility before adding native packages.
- Render local data before remote work; do not block first render on the network.
- Use virtualized lists for growing collections.
- Handle safe areas, keyboard, lifecycle, permissions, and platform differences.
- Request permissions only when the user starts the related action.
- Meet accessibility requirements for labels, touch targets, text scaling, contrast, and reduced motion.
- Keep render pure and place side effects in explicit lifecycle/application behavior.

## 8. Supabase

- Create one client in the composition root; never import it from screens.
- Ship only the public anon key. Never expose the service-role key.
- Enable and test RLS on every user-owned table.
- Store sessions in secure React Native storage.
- Use database functions for atomic multi-table operations.
- Use Edge Functions for secrets and third-party integrations.
- Keep user-image buckets private with owner, MIME, and size policies.
- Version, review, and test forward-only migrations.
- Make offline mutations idempotent with client mutation IDs.
- Treat server authorization and invariants as authoritative.

## 9. Data, state, and forms

- SQLite owns durable offline data.
- TanStack Query owns async lifecycle and projection cache, not persistence.
- React Hook Form owns form drafts; Zod owns validation.
- Expo Router owns navigation; local UI state stays near the component.
- Do not add another global store without a documented unmet need.
- Write domain data and its outbox item in one local transaction.
- Never make users wait for the network to save offline-capable care records.

## 10. No placeholders, TODOs, or mocks

Forbidden examples include fixed fake data presented as real integration, buttons without behavior, empty catches, hard-coded demo users, future-work comments, and unrequested mock repositories.

If a dependency is missing, report the blocker. Use pure functions, isolated SQLite, Supabase local/test projects, and explicit fixtures. Ask before introducing a test double.

## 11. Testing and quality gates

- Test only core logic: model invariants, schemas, transitions, dates, units, and business rules.
- Do not add or maintain component, UI, feature, integration, or E2E tests during MVP.
- Supabase migrations, RPCs, Storage policies, and RLS remain core logic and require local/test verification when changed.
- Verify UI manually through running app; preserve accessibility labels and roles.

Minimum code-task gates:

1. Typecheck.
2. Lint.
3. Relevant core-logic tests when core logic changes.
4. Appropriate Expo preview/production compile for config or native changes.
5. `git diff --check`.

Never claim compilation succeeded without running the command. Report blocked verification and residual risk honestly.

## 12. Production-readiness checklist

- No `any`, type suppression, or strict-mode regression.
- No component exceeds 200 lines.
- No placeholder, TODO comment, or unrequested mock implementation.
- No secrets or personal data in code or logs.
- Loading, empty, error, offline, and accessibility states are covered.
- Database changes include migrations and RLS tests.
- Logs are structured and sanitized.
- Related docs and backlog are current.
- Required verification commands passed.

## 13. Required task report

Every handoff contains:

### What changed

Describe the delivered behavior or documents and link affected files.

### Why

Connect the change to the requirement. Explain architecture with context, decision, rationale, and consequences.

### Possible improvements

List valuable work outside the current scope, or state “None.”

### Compile and verification

List exact commands and results. For documentation-only work before code exists, state: “Compilation not applicable; Markdown/diff verified.”
