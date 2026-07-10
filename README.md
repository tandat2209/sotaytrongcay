# Sổ tay trồng cây

A mobile-first intelligent gardening coach for beginners. It guides users through each growth stage and automatically builds a gardening journal as recommended work is completed.

Grapes are the first fully guided plant. The product model remains extensible to other species and their own stage playbooks.

## Problem

Beginners rarely fail because they cannot store notes. They struggle to decide what to do, why it matters, what to avoid, and what to prepare next.

Generic advice is difficult to apply because it lacks the plant's current stage, recent care, local weather, and progress.

## Product goals

The first release focuses on three outcomes:

1. Tell beginners what matters today and explain why.
2. Guide each plant toward the next growth-stage milestone.
3. Build trustworthy history automatically as work is completed.

## Proposed MVP

- Create grape plants and select their current growth stage.
- Show one reviewed stage playbook with goal, guidance, risks, completion criteria, and next stage.
- Generate deterministic recommended tasks from the stage playbook.
- Adjust simple recommendations using weather rules.
- Complete a task and automatically create a journal entry.
- Add optional notes and photos after completion.
- Keep manual quick logging through the global FAB.
- Show guidance-first Today and Plant Dashboard experiences.
- Review automatic and manual history in Plant Timeline and global Journal.
- Create and manage one-time reminders.

## Outside the initial scope

- AI-generated recommendations.
- Automated disease diagnosis.
- Guidance for every plant species.
- Complex task scheduling or recurring automation.
- 7-day weather, alerts, and advanced forecasting.
- IoT devices, marketplace, social network, and large-farm administration.

## Documentation

- [Project context](./docs/PROJECT_CONTEXT.md)
- [Mobile UX design](./docs/MOBILE_UX_DESIGN.md)
- [Technical architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Engineering standards](./docs/ENGINEERING_STANDARDS.md)
- [Decision log](./docs/DECISIONS.md)
- [Vietnamese domain language](./CONTEXT.md)
- [Work backlog](./TODO.md)
- [AI contributor instructions](./CLAUDE.md)

## Status

The project is in pre-implementation design. Guidance quality, grape stage playbooks, recommendation rules, and beginner comprehension require validation before implementation.
