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

## Current MVP

- Create grape plants and select their current growth stage.
- Track watering, fertilizing, and spraying.
- Store optional care details, notes, and photo journal updates.
- Show recent care, stage context, and locally managed schedules on Plant Detail.
- Browse review-stage Playbooks with Care Plans, informational guides, and observation-only pest/disease context.
- Start care entry from “Việc cần làm hôm nay”; record activity only after the user saves it.
- Add a photo journal entry and optionally update the plant's stage in the same flow.
- Review saved history in the global Journal and Plant Detail.
- Customize stage and plant Care Plan schedules and local notifications.
- Manage reusable private fertilizers from “Mở rộng”.

## Outside the initial scope

- Automatically completing or recording informational tips.
- AI-generated recommendations.
- Automated disease diagnosis.
- Guidance for every plant species.
- Live weather-driven guidance or risk forecasting.
- 7-day weather, alerts, IoT devices, marketplace, and social features.

## Documentation

For documentation ownership, precedence, and reading order, see the [documentation map](./docs/README.md).

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

The Expo MVP supports local-first plant tracking, three care-entry flows, photo journal updates, stage guidance, schedule snapshots, local reminders, and reusable fertilizers. Grape Knowledge Base content remains review-stage until qualified review promotes it.

## Local development

Prerequisites:

- Node.js 22.13 or newer.
- pnpm 10.32.1 or a compatible pnpm 10 release.

Install and start the application:

```sh
pnpm install
pnpm start
```

Build a directly installable Android preview with EAS:

```sh
pnpm dlx eas-cli build --platform android --profile preview
```

The `preview` profile creates an APK for internal distribution. After the build
finishes, open the EAS installation link on an Android device; Google Play
registration is not required.

Run the quality gates:

```sh
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm export
```

The Expo SDK 57 baseline targets iOS, Android, and static web output. Supabase credentials are not required yet because remote data access has not been implemented.
