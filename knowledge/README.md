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

## Pilot scope

The grape species registry defines the canonical ten-stage journey, but only `grape.stage.trunk-development` currently has a playbook.

Until more playbooks are approved, the product must not imply that every selectable stage has complete tips or recommendations.

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
- `ref.osu.growing-table-grapes`

Changing Vietnamese wording does not change an ID.

## Expert approval required

The pilot content uses agricultural-extension references, but its Vietnamese wording and applicability to local growing conditions remain `review` until a qualified grape-growing reviewer approves them.
