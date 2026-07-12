# Project Overview

Sổ Tay Trồng Cây is a mobile-first MVP for Vietnamese home growers to track plant care quickly and receive safe, stage-aware guidance.

# Technology Stack

- **App:** Expo, React Native, Expo Router, strict TypeScript
- **Local data:** Expo SQLite, TanStack Query
- **Backend and sync:** Supabase
- **Validation and tests:** Zod, Jest, ESLint

# Core Rules & Conventions

- Write technical artifacts in English and in-app copy in Vietnamese.
- Use strict TypeScript; never use `any`.
- Keep components under 200 lines and prefer simple composition.
- Use camelCase for variables/functions and PascalCase for React components.
- Keep changes small, focused, and testable. Preserve unrelated user work.
- This is an MVP: try fast, fail fast, learn, and avoid speculative abstractions or over-engineering.
- Never present unsupported plant-care advice as fact.

# Workflow & Prohibitions

- Build one complete feature slice at a time using existing patterns.
- Do not add placeholders, TODO comments, fake implementations, or unnecessary dependencies.
- Treat accepted decisions as behavior authority and schemas as data-shape authority; report conflicts instead of guessing.
- Run relevant verification and report exact results. Never claim an unrun check passed.
- Update and align project skills (in `.agents/skills/`) and documentation (in `docs/`) to keep them synchronized with codebase changes.
- Maintain backlog items and future tasks under [TODO.md](file:///Users/datnguyen/Documents/sotaytrongcay/TODO.md).
