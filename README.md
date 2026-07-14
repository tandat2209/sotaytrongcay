# Sổ tay trồng cây

A mobile-first plant-care companion that helps users track essential care and understand stage-specific tips.

Grapes are the first supported plant. The product model remains extensible to other species and their own growth-stage guidance.

## Problem

Gardeners need a reliable answer to practical questions:

- When did I last water or fertilize this plant?
- What product and amount did I use?
- What should I check next?
- What should I know about the current growth stage?

Paper notes, photos, and memory make care history difficult to trust. Generic advice is also hard to apply without plant and stage context.

## Product goals

The first release focuses on three outcomes:

1. Record important care quickly and accurately.
2. See recent care and upcoming reminders for each plant.
3. Provide concise stage-specific tips without turning every tip into a task.

## Proposed MVP

- Create grape plants and select their current growth stage.
- Track watering, fertilizing, and spraying.
- Store optional product, amount, method, notes, and photos.
- Show last care and next reminder on Plant Detail.
- Show stage tips, things to avoid, warning signs, and milestones on Plant Detail.
- Use weather and history to suggest care for consideration.
- Start care entry from “Việc cần làm hôm nay”; record activity only after the user saves it.
- Add a photo journal entry and optionally update the plant's stage in the same flow.
- Review history in Plant Timeline and the global Journal.
- Create and manage one-time reminders.

## Outside the initial scope

- Automatically completing or recording informational tips.
- AI-generated recommendations.
- Automated disease diagnosis.
- Guidance for every plant species.
- Complex scheduling or recurring automation.
- 7-day weather, alerts, IoT devices, marketplace, and social features.

## Documentation

### Ownership and precedence

Product scope is owned by [Project context](./docs/PROJECT_CONTEXT.md); interaction behavior by [Mobile UX design](./docs/MOBILE_UX_DESIGN.md); confirmed decisions by [Decision log](./docs/DECISIONS.md); and validated knowledge field contracts by `knowledge/_schemas/`. [Knowledge Base architecture](./docs/KNOWLEDGE_BASE_ARCHITECTURE.md) and [Grape Knowledge Base pilot](./knowledge/README.md) explain the authoring model and package scope, but must not override those contracts or infer runtime automation from review-stage content.

When sources conflict, use accepted product decisions for behavior and schemas for data shape; then align the lower-precedence documentation.

- [Project context](./docs/PROJECT_CONTEXT.md)
- [Mobile UX design](./docs/MOBILE_UX_DESIGN.md)
- [Mobile design guidelines and mockup index](./docs/design/DESIGN.md)
- [Technical architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Knowledge Base architecture](./docs/KNOWLEDGE_BASE_ARCHITECTURE.md)
- [Grape Knowledge Base pilot](./knowledge/README.md)
- [Mockup review](./docs/design/SCREEN_REVIEW.md)
- [Engineering standards](./docs/ENGINEERING_STANDARDS.md)
- [Decision log](./docs/DECISIONS.md)
- [Vietnamese domain language](./CONTEXT.md)
- [Work backlog](./TODO.md)
- [AI contributor instructions](./CLAUDE.md)

## Status

The Expo application foundation is bootstrapped with strict TypeScript, four approved Vietnamese navigation destinations, shared design primitives, TanStack Query providers, and automated quality gates. Product validation remains required before care-entry implementation.

## Local development

Prerequisites:

- Node.js 22.13 or newer.
- pnpm 10.32.1 or a compatible pnpm 10 release.

Install and start the application:

```sh
pnpm install
pnpm start
```

Run the quality gates:

```sh
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm export
```

The Expo SDK 57 baseline targets iOS, Android, and static web output. Supabase credentials are not required yet because remote data access has not been implemented.
