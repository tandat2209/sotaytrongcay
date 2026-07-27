# Plant-care Knowledge Base

## Purpose

This directory contains curated, non-user plant knowledge. User plants, activities, journal photos, reminders, weather observations, and confirmed stage history never belong here.

The first package is a review-ready grape pilot for “Nuôi thân”. It proves the authoring contract without claiming that every grape stage is ready for production.

## Publishing states

- `draft`: incomplete author work; excluded from previews and production.
- `review`: structurally complete and sourced; available to editorial preview only.
- `approved`: reviewed for the declared locale and scope; eligible for the mobile bundle.
- `deprecated`: retained for historical references but excluded from new recommendations.
- `archived`: unavailable to runtime retrieval.

Only `approved` documents may appear as agricultural guidance in the production app.

## Build path

```text
Markdown + frontmatter
    ↓ parse
JSON Schema and relationship validation
    ↓ compile approved vi-VN content
knowledge/_generated/mobile-bundle.json
    ↓ bundled Expo asset
BundledKnowledgeRepository
    ↓
Today and Plant Detail
```

The generated directory is build output and must not be edited by hand.

For editorial review, compile the preview bundle and its human-readable HTML
page together:

```sh
pnpm knowledge:compile:preview
```

This writes `knowledge/_generated/mobile-bundle.preview.json` and renders
`knowledge/_generated/preview.html` directly from that JSON. To re-render an
unchanged bundle without compiling Markdown again, run
`pnpm knowledge:render:preview`. The HTML intentionally shows both editorial
wording and machine-readable Care Plan values so reviewers can catch contract
or scheduling mismatches before approval.

## Pilot scope

The grape species registry defines the canonical development and production lifecycles. All 12 grape stage playbooks are review-stage material, not approved production guidance.

A review-stage playbook provides concise objective, observations, duration, and sources. It does not create reminders, tasks, transitions, or care instructions. The product must not imply that a selectable stage has approved tips or recommendations until the relevant content is approved.

The pilot includes one review-stage spraying Care Plan for powdery-mildew prevention at bud break, with Vietnamese applicability context from the Vietnam Academy of Agricultural Sciences. It remains editorial-preview content: its elapsed-day threshold is a checkpoint for reviewing an already confirmed prevention plan, not a fixed instruction to spray, and it prescribes no product or dosage.

The pilot also includes review-stage target catalogs for grape powdery mildew,
thrips, mealybugs, scale insects, phylloxera, and aphids. These are `disease`
and `pest` knowledge entities, not diagnoses, Care Plans, reminders, or
spraying schedules. Their stage relationships indicate when monitoring is
relevant. They compile only into preview bundle schema `1.1.0`; production
stays on `1.0.0` until explicit approval.

The current spraying Care Entry may read only a target's stable ID, type,
Vietnamese title, and species relationship from the preview catalog for optional
history classification. Saving snapshots the selected title; an absent target
catalog hides the selector and does not block legacy Knowledge Base bundles or
activity history. Separately, the preview Stage Playbook may show a target's
authored body only when its species and monitoring stage match the playbook. It
is read-only observation context, not diagnosis, spraying eligibility, a
reminder, or a Care Entry prefill.

Each review-stage grape Stage Playbook may also carry one optional stable
`image_id`. The static asset resolver bundles its matching WebP from
`knowledge/assets/images/` for offline preview display. A stage illustration is
general visual context, not a photo of the user's plant or evidence that its
stage is confirmed. Production publication requires the usual content review
and recorded image source, licence, attribution, Vietnamese alt text, and
review status.

## Care-content ownership

- A `care_plan` is the authored source for tracked watering, fertilizing, and spraying guidance: title, goal, optional growing-method frequency, recommended inputs, fertilizer-group guidance, notes, scope, eligibility, missing-history policy, and priority. Frequency is executable: each display starts with a recurring daily or weekly cadence, and `interval_days` equals the earliest cadence shown. One-time, finite, or conditional timing remains guidance without frequency so it cannot create a repeating reminder. Fertilizing plans use `on_missing_history: suggest` so unknown history creates a Today backfill prompt; this prompt is not a completed activity and saving remains explicit. A fertilizing plan's `recommended_inputs` references exactly one primary `fertilizer-role.*` catalogue entry and may reference alternatives; it never copies product IDs, formulas, names, or groups. Optional `fertilizer_group_guidance` reuses the canonical groups resolved from those roles for stage-specific explanations; every described group must occur among the resolved recommendations and may appear only once.
- A `care_guide` contains generic informational techniques such as training or pruning and is not required by a Care Plan.
- A `disease` or `pest` provides a stable reviewed target identity, affected species and monitoring stages, observable evidence, prevention context, safe first response, escalation guidance, and sources. It does not establish that a plant has the issue or that spraying is due.
- A `warning_sign` owns one canonical observation article and its short stage-card summary. Its optional stable `image_id` resolves to an offline WebP under `knowledge/assets/images/`; the image illustrates what to inspect but does not establish a diagnosis. Its stage relationships surface “Cần chú ý” links in Stage Playbook, while the same document appears under `Mở rộng → Dấu hiệu thường gặp`. Possible Pest or Disease causes remain conditional and never establish diagnosis, spraying eligibility, or completed care.
- The compiler validates Care Plan scope and emits its presentation and decision fields together.
- Fertilizer Management reads the ordered review-stage `fertilizer_guide` under `knowledge/catalogs/fertilizers/`. It is the single catalogue of product-independent fertilizer roles; each role owns its display name and canonical group, while its presentation section is management-only. Care Plans reference those roles by ID and priority, and the runtime resolves the catalogue name and group for stage guidance and Care Entry. Listing or saving a stable identity is preparation only and creates no care history or immediate fertilizing recommendation.
- Informational guides, including pruning or training techniques, do not create activities, recommendations, reminders, or history.

## Documentation ownership

- The schemas in `_schemas/` define the authored and mobile-bundle field contracts.
- This README defines package scope, publishing states, and safety boundaries.
- `docs/KNOWLEDGE_BASE_ARCHITECTURE.md` defines the conceptual authoring model and must conform to the schemas.
- Product behavior comes from `docs/PROJECT_CONTEXT.md`, `docs/MOBILE_UX_DESIGN.md`, and accepted entries in `docs/DECISIONS.md`.

When these sources conflict, schema field contracts and accepted product decisions take precedence. Update lower-precedence documentation rather than inferring runtime behavior from review content.

## Safety constraints

- Do not prescribe commercial products or pesticide treatments without expert review.
- Do not infer dosage from species and stage alone.
- Do not publish fixed watering frequency or volume without climate, container, soil, drainage, and weather assumptions.
- Do not present warning signs as diagnoses.
- Do not convert a tip or guide into completed user history.
- Do not let AI-generated content bypass approved deterministic rules.

## Stable IDs

IDs are immutable, lowercase, language-neutral, and namespaced by domain. Examples:

- `plant.grape`
- `grape.stage.trunk-development`
- `grape.recommendation.check-soil-before-watering`
- `grape.guide.train-main-shoot`
- `disease.grape.powdery-mildew`
- `pest.grape.thrips`
- `pest.grape.mealybugs`
- `pest.grape.scale-insects`
- `pest.grape.phylloxera`
- `pest.grape.aphids`
- `ref.osu.growing-table-grapes`

Changing Vietnamese wording does not change an ID.

## Expert approval required

The pilot content uses agricultural-extension references, but its Vietnamese wording and applicability to local growing conditions remain `review` until a qualified grape-growing reviewer approves them.
