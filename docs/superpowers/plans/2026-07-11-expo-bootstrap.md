# Expo application bootstrap implementation plan

**Goal:** Establish a production-oriented Expo application foundation that compiles with strict TypeScript and exposes the four approved Vietnamese navigation destinations.

**Architecture:** Expo Router owns only route composition. Feature screens live behind public feature exports, shared UI owns stable design primitives, and the bootstrap layer owns application providers. This slice deliberately excludes persistence, authentication, forms, Supabase connectivity, and unapproved feature behavior.

**Technology:** Expo, React Native, TypeScript, Expo Router, TanStack Query, Jest Expo, React Native Testing Library, ESLint.

---

## Task 1: Record the authoritative navigation decision

**Files:**

- Modify: `docs/DECISIONS.md`

1. Correct the status of the contextual-actions-without-FAB decision to `Accepted`.
2. Verify the decision does not conflict with the journal-based stage update decision.

## Task 2: Create the Expo and TypeScript foundation

**Files:**

- Create: `package.json`
- Create: `app.config.ts`
- Create: `expo-env.d.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.js`
- Create: `jest.config.js`
- Create: `.gitignore`
- Create: `assets/` application images required by Expo configuration

1. Select dependency versions compatible with the current Expo SDK.
2. Enable strict TypeScript, unchecked indexed access, and exact optional properties.
3. Add deterministic scripts for start, typecheck, lint, test, and Expo export.
4. Configure Expo metadata without secrets or environment-specific URLs.

## Task 3: Build the application composition root

**Files:**

- Create: `src/bootstrap/AppProviders.tsx`
- Create: `src/shared/ui/theme.ts`
- Create: `src/shared/ui/Screen.tsx`
- Create: `src/shared/ui/EmptyState.tsx`

1. Create one application-owned TanStack Query client.
2. Compose safe-area and query providers at the root.
3. Implement design tokens from `docs/design/DESIGN.md`.
4. Implement accessible, reusable screen and empty-state primitives.

## Task 4: Build the approved four-destination shell

**Files:**

- Create: `app/_layout.tsx`
- Create: `app/index.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/today.tsx`
- Create: `app/(tabs)/plants.tsx`
- Create: `app/(tabs)/journal.tsx`
- Create: `app/(tabs)/me.tsx`
- Create: `src/features/today/ui/TodayScreen.tsx`
- Create: `src/features/today/index.ts`
- Create: `src/features/plants/ui/PlantsScreen.tsx`
- Create: `src/features/plants/index.ts`
- Create: `src/features/journal/ui/JournalScreen.tsx`
- Create: `src/features/journal/index.ts`
- Create: `src/features/me/ui/MeScreen.tsx`
- Create: `src/features/me/index.ts`
- Create: `src/bootstrap/navigation.ts`
- Test: `src/bootstrap/navigation.test.ts`

1. Write a failing navigation-contract test for the four approved destinations and Vietnamese labels.
2. Define a typed navigation contract with no action tab or FAB.
3. Implement thin Expo Router route files that import only public feature screens.
4. Render honest empty states with actionable product explanations and no fabricated data.
5. Add accessible tab icons and labels using an Expo-compatible icon library.

## Task 5: Verify and document the bootstrap

**Files:**

- Modify: `README.md`
- Modify: `TODO.md`
- Create: `pnpm-lock.yaml`

1. Install dependencies and generate the lockfile.
2. Run `pnpm typecheck`.
3. Run `pnpm lint`.
4. Run `pnpm test`.
5. Run `pnpm export`.
6. Run `git diff --check` and inspect the final diff for placeholders, unsafe types, unrelated changes, and files over 200 lines.
7. Update the setup instructions and mark only the completed bootstrap backlog item.
8. Commit the focused implementation.
