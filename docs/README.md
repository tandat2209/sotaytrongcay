# Project documentation

This directory stores product context, UX decisions, architecture, and engineering standards.

## Documentation ownership and precedence

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) owns product scope, users, risks, and MVP capabilities.
- [MOBILE_UX_DESIGN.md](./MOBILE_UX_DESIGN.md) owns interaction and screen behavior.
- [Design guidelines](./design/DESIGN.md) own visual language, component hierarchy, and compact action treatment.
- [DECISIONS.md](./DECISIONS.md) owns confirmed decisions and their rationale.
- `knowledge/_schemas/` owns authored and mobile-bundle field contracts.
- [KNOWLEDGE_BASE_ARCHITECTURE.md](./KNOWLEDGE_BASE_ARCHITECTURE.md) owns the conceptual authoring model and must conform to schemas and accepted decisions.
- [Engineering standards](./ENGINEERING_STANDARDS.md) owns implementation and verification requirements.
- [Research notes](./research/README.md) store dated findings and option analysis. They are supporting evidence, not behavior or data-shape authority.

When sources conflict, accepted decisions control behavior and schemas control data shape. Update lower-precedence documentation rather than inferring automation from mockups or review-stage knowledge content.

Do not duplicate screen behavior between `MOBILE_UX_DESIGN.md` and `design/DESIGN.md`: the former owns the behavioral contract, while the latter owns reusable visual treatment.

## Reading order

1. [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
2. [MOBILE_UX_DESIGN.md](./MOBILE_UX_DESIGN.md)
3. [DESIGN.md](./design/DESIGN.md)
4. [Mockup review](./design/SCREEN_REVIEW.md)
5. [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
6. [KNOWLEDGE_BASE_ARCHITECTURE.md](./KNOWLEDGE_BASE_ARCHITECTURE.md)
7. [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
8. [DECISIONS.md](./DECISIONS.md)
9. [CONTEXT.md](../CONTEXT.md)
10. [TODO.md](../TODO.md)

## Maintenance rules

- Update context when user knowledge, scope, or risk changes.
- Record confirmed decisions with their rationale.
- Keep assumptions separate from decisions.
- Create ADRs only for hard-to-reverse decisions with real trade-offs.
- Keep `TODO.md` current after research, implementation, or release work.
