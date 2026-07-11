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

- [Project context](./docs/PROJECT_CONTEXT.md)
- [Mobile UX design](./docs/MOBILE_UX_DESIGN.md)
- [Mobile design guidelines and mockup index](./docs/design/DESIGN.md)
- [Technical architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Knowledge Base architecture](./docs/KNOWLEDGE_BASE_ARCHITECTURE.md)
- [Engineering standards](./docs/ENGINEERING_STANDARDS.md)
- [Decision log](./docs/DECISIONS.md)
- [Vietnamese domain language](./CONTEXT.md)
- [Work backlog](./TODO.md)
- [AI contributor instructions](./CLAUDE.md)

## Status

The project is in pre-implementation design. Care-entry speed, tracking fields, reminder value, and stage-tip comprehension require validation before implementation.
