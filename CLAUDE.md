# AI contributor instructions

## Read before working

1. `README.md`
2. `docs/PROJECT_CONTEXT.md`
3. `docs/MOBILE_UX_DESIGN.md`
4. `docs/TECHNICAL_ARCHITECTURE.md`
5. `docs/ENGINEERING_STANDARDS.md`
6. `CONTEXT.md`
7. `docs/DECISIONS.md`
8. `TODO.md`

## Language policy

- Write documentation, code, comments, tests, commits, and technical communication in English.
- Use Vietnamese for in-app copy and canonical business vocabulary where the product requires it.
- Keep literal Vietnamese UI strings in UX specifications, with English explanations around them.
- Use the canonical terms in `CONTEXT.md`; clarify ambiguous terms before changing the model.

## Mandatory engineering rules

Follow `docs/ENGINEERING_STANDARDS.md` in full. In particular:

- never use `any`; keep TypeScript strict;
- do not modify unrelated files;
- keep components under 200 lines;
- prefer composition and deliberate reuse;
- build one complete feature slice at a time;
- do not add placeholders or TODO comments;
- do not create mock or fake implementations unless explicitly requested;
- explain every architectural decision;
- report changes, rationale, possible improvements, and verified compile status after every task.

## Product constraints

- Do not treat assumptions as confirmed requirements.
- Preserve reviewed stage guidance and recommended tasks as the primary experience.
- Completing a recommended task must create history without duplicate input.
- Keep manual Quick Entry fast as a fallback for unplanned work.
- Do not present unsupported plant-care advice as fact.
- Prefer small, testable changes traceable to a product outcome.

## Documentation maintenance

- Update `CONTEXT.md` when domain language changes.
- Update `docs/PROJECT_CONTEXT.md` when users, scope, or risks change.
- Update `docs/DECISIONS.md` when a choice is confirmed.
- Create an ADR only for a hard-to-reverse decision with a real trade-off.
- Update `TODO.md` when work is completed or discovered.
- Stop and report conflicts between documentation and implementation.

## Definition of done

- Relevant behavior is tested.
- Empty, loading, error, offline, and invalid-data states are considered.
- Mobile usability and accessibility are checked for UI changes.
- Sensitive data is absent from logs and errors.
- Related documentation is current.
- Required verification commands have actually passed.
