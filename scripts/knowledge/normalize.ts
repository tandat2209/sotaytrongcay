import type {
  NormalizedKnowledgeDocument,
  StageJourneyItem,
  ValidatedSourceDocument,
} from "./types";

type UserFacingStatus = "draft" | "review" | "approved" | "deprecated" | "archived";
type ReferenceStatus = "active" | "superseded" | "unavailable";
type SourceType = "extension_guide" | "research_paper" | "expert_review" | "regulatory_guidance";
type RawStage = Readonly<{
  id: unknown;
  title: unknown;
  sequence: unknown;
  transitions?: unknown;
  playbook_status: "unavailable" | "draft" | "review" | "approved";
}>;
type RawLifecycle = Readonly<{ title: unknown; repeatable: unknown; initial_stage_id: unknown; stages: readonly RawStage[] }>;
type RawFrequency = Readonly<{ ground?: Readonly<{ display?: unknown; interval_days?: unknown }>; container?: Readonly<{ display?: unknown; interval_days?: unknown }> }>;

function stringList(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function userFacingStatus(value: unknown): UserFacingStatus {
  return value === "draft" || value === "review" || value === "approved" || value === "deprecated" || value === "archived" ? value : "draft";
}

function referenceStatus(value: unknown): ReferenceStatus {
  return value === "active" || value === "superseded" || value === "unavailable" ? value : "unavailable";
}

function sourceType(value: unknown): SourceType {
  return value === "extension_guide" || value === "research_paper" || value === "expert_review" || value === "regulatory_guidance" ? value : "expert_review";
}

export function normalizeDocument(
  doc: ValidatedSourceDocument,
): NormalizedKnowledgeDocument {
  const fm = doc.frontmatter;

  switch (doc.type) {
    case "plant_species": {
      const fmLifecycles = fm.lifecycles as Readonly<{ development?: RawLifecycle; production?: RawLifecycle }> | undefined;
      const parseStages = (stages: readonly RawStage[]): StageJourneyItem[] =>
        stages.map((item) => ({
          id: String(item.id),
          title: String(item.title),
          sequence: Number(item.sequence),
          transitions: Array.isArray(item.transitions) ? item.transitions.filter((transition): transition is Readonly<{ to: string; condition?: string }> => typeof transition === "object" && transition !== null && "to" in transition && typeof transition.to === "string") : [],
          playbookStatus: item.playbook_status,
        }));

      const lifecycles = {
        development: {
          title: String(fmLifecycles?.development?.title),
          repeatable: Boolean(fmLifecycles?.development?.repeatable),
          initialStageId: String(fmLifecycles?.development?.initial_stage_id),
          stages: parseStages(fmLifecycles?.development?.stages ?? []),
        },
        production: {
          title: String(fmLifecycles?.production?.title),
          repeatable: Boolean(fmLifecycles?.production?.repeatable),
          initialStageId: String(fmLifecycles?.production?.initial_stage_id),
          stages: parseStages(fmLifecycles?.production?.stages ?? []),
        },
      };

      return {
        id: doc.id,
        type: "plant_species",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: userFacingStatus(fm.status),
        references: stringList(fm.references),
        scientificName: String(fm.scientific_name),
        lifecycles,
      };
    }

    case "growth_stage_playbook": {
      return {
        id: doc.id,
        type: "growth_stage_playbook",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: userFacingStatus(fm.status),
        references: stringList(fm.references),
        speciesId: String(fm.species_id),
        sequence: 0, // Injected during serialization
        lifecycleId: "development", // Injected during serialization
        primaryObjective: String(fm.primary_objective),
        entryCriteria: stringList(fm.entry_criteria),
        exitCriteria: stringList(fm.exit_criteria),
        estimatedDuration: String(fm.estimated_duration),
        recommendedKnowledgeTopics: stringList(fm.recommended_knowledge_topics),
      };
    }

    case "care_plan": {
      const rawInputs = fm.recommended_inputs;
      const recommendedInputs = Array.isArray(rawInputs)
        ? rawInputs.filter((item): item is Readonly<{ group: unknown; examples: unknown }> => typeof item === "object" && item !== null && "group" in item && "examples" in item).map((item) => ({ group: String(item.group), examples: String(item.examples) }))
        : undefined;
      const rawFrequency = fm.frequency as RawFrequency | undefined;
      const frequency = rawFrequency?.ground && rawFrequency.container
        ? { ground: { display: String(rawFrequency.ground.display), intervalDays: Number(rawFrequency.ground.interval_days) }, container: { display: String(rawFrequency.container.display), intervalDays: Number(rawFrequency.container.interval_days) } }
        : undefined;
      const notes = Array.isArray(fm.notes) ? stringList(fm.notes) : undefined;
      return {
        id: doc.id,
        type: "care_plan",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: userFacingStatus(fm.status),
        references: stringList(fm.references),
        goal: String(fm.goal),
        priority: Number(fm.priority),
        speciesIds: stringList(fm.species_ids),
        stageIds: stringList(fm.stage_ids),
        activityType: fm.activity_type === "watering" || fm.activity_type === "fertilizing" || fm.activity_type === "spraying" ? fm.activity_type : "watering",
        eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: Number((fm.eligibility as Readonly<{ suggest_after_days?: unknown }> | undefined)?.suggest_after_days) },
        onMissingHistory: fm.on_missing_history === "suggest" || fm.on_missing_history === "withhold" ? fm.on_missing_history : "withhold",
        ...(recommendedInputs !== undefined && { recommendedInputs }),
        ...(frequency !== undefined && { frequency }),
        ...(notes !== undefined && { notes }),
      };
    }

    case "care_guide": {
      const rawInputs = fm.recommended_inputs;
      const recommendedInputs = Array.isArray(rawInputs)
        ? (rawInputs as readonly { group: string; examples: string }[]).map((item) => ({
            group: String(item.group),
            examples: String(item.examples),
          }))
        : undefined;
      const rawFrequency = fm.frequency as RawFrequency | undefined;
      const frequency = rawFrequency?.ground && rawFrequency.container
        ? { ground: { display: String(rawFrequency.ground.display), intervalDays: Number(rawFrequency.ground.interval_days) }, container: { display: String(rawFrequency.container.display), intervalDays: Number(rawFrequency.container.interval_days) } }
        : undefined;
      const rawNotes = fm.notes;
      const notes = Array.isArray(rawNotes) ? stringList(rawNotes) : undefined;

      return {
        id: doc.id,
        type: "care_guide",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: userFacingStatus(fm.status),
        references: stringList(fm.references),
        goal: String(fm.goal),
        speciesIds: stringList(fm.species_ids),
        stageIds: stringList(fm.stage_ids),
        ...(recommendedInputs !== undefined && { recommendedInputs }),
        ...(frequency !== undefined && { frequency }),
        ...(notes !== undefined && { notes }),
      };
    }

    case "reference_source": {
      return {
        id: doc.id,
        type: "reference_source",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        publisher: String(fm.publisher),
        sourceType: sourceType(fm.source_type),
        url: String(fm.url),
        accessed: String(fm.accessed),
        status: referenceStatus(fm.status),
      };
    }
  }
}
