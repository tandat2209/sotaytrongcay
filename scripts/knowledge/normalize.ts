import type {
  NormalizedKnowledgeDocument,
  StageJourneyItem,
  ValidatedSourceDocument,
} from "./types";

export function normalizeDocument(
  doc: ValidatedSourceDocument,
): NormalizedKnowledgeDocument {
  const fm = doc.frontmatter;

  switch (doc.type) {
    case "plant_species": {
      const fmLifecycles = fm.lifecycles as Record<string, { title: string, repeatable: boolean, initial_stage_id: string, stages: readonly any[] }>;
      const parseStages = (stages: readonly any[]): StageJourneyItem[] =>
        stages.map((item) => ({
          id: String(item.id),
          title: String(item.title),
          sequence: Number(item.sequence),
          transitions: (item.transitions ?? []) as readonly { readonly to: string; readonly condition?: string }[],
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
        status: fm.status as any,
        references: (fm.references ?? []) as readonly string[],
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
        status: fm.status as any,
        references: (fm.references ?? []) as readonly string[],
        speciesId: String(fm.species_id),
        sequence: 0, // Injected during serialization
        lifecycleId: "development", // Injected during serialization
        primaryObjective: String(fm.primary_objective),
        entryCriteria: (fm.entry_criteria ?? []) as readonly string[],
        exitCriteria: (fm.exit_criteria ?? []) as readonly string[],
        estimatedDuration: String(fm.estimated_duration),
        recommendedKnowledgeTopics: (fm.recommended_knowledge_topics ?? []) as readonly string[],
      };
    }

    case "care_plan": {
      const rawInputs = fm.recommended_inputs;
      const recommendedInputs = Array.isArray(rawInputs)
        ? (rawInputs as readonly { group: string; examples: string }[]).map((item) => ({ group: String(item.group), examples: String(item.examples) }))
        : undefined;
      const rawFrequency = fm.frequency as { ground?: { display?: string; interval_days?: number }; container?: { display?: string; interval_days?: number } } | undefined;
      const frequency = rawFrequency?.ground && rawFrequency.container
        ? { ground: { display: String(rawFrequency.ground.display), intervalDays: Number(rawFrequency.ground.interval_days) }, container: { display: String(rawFrequency.container.display), intervalDays: Number(rawFrequency.container.interval_days) } }
        : undefined;
      const notes = Array.isArray(fm.notes) ? (fm.notes as readonly string[]).map(String) : undefined;
      return {
        id: doc.id,
        type: "care_plan",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: fm.status as any,
        references: (fm.references ?? []) as readonly string[],
        goal: String(fm.goal),
        priority: Number(fm.priority),
        speciesIds: (fm.species_ids ?? []) as readonly string[],
        stageIds: (fm.stage_ids ?? []) as readonly string[],
        activityType: fm.activity_type as "watering" | "fertilizing" | "spraying",
        eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: Number((fm.eligibility as { suggest_after_days: number }).suggest_after_days) },
        onMissingHistory: fm.on_missing_history as "suggest" | "withhold",
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
      const rawFrequency = fm.frequency as { ground?: { display?: string; interval_days?: number }; container?: { display?: string; interval_days?: number } } | undefined;
      const frequency = rawFrequency?.ground && rawFrequency.container
        ? { ground: { display: String(rawFrequency.ground.display), intervalDays: Number(rawFrequency.ground.interval_days) }, container: { display: String(rawFrequency.container.display), intervalDays: Number(rawFrequency.container.interval_days) } }
        : undefined;
      const rawNotes = fm.notes;
      const notes = Array.isArray(rawNotes) ? (rawNotes as readonly string[]).map(String) : undefined;

      return {
        id: doc.id,
        type: "care_guide",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: fm.status as any,
        references: (fm.references ?? []) as readonly string[],
        goal: String(fm.goal),
        speciesIds: (fm.species_ids ?? []) as readonly string[],
        stageIds: (fm.stage_ids ?? []) as readonly string[],
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
        sourceType: fm.source_type as any,
        url: String(fm.url),
        accessed: String(fm.accessed),
        status: fm.status as any,
      };
    }
  }
}
