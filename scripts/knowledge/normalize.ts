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
        defaultReminderTemplates: (fm.default_reminder_templates ?? []) as readonly string[],
        recommendedKnowledgeTopics: (fm.recommended_knowledge_topics ?? []) as readonly string[],
      };
    }

    case "care_recommendation_definition": {
      return {
        id: doc.id,
        type: "care_recommendation_definition",
        path: doc.path,
        title: String(fm.title),
        version: String(fm.version),
        bodyMarkdown: doc.body,
        locale: String(fm.locale),
        status: fm.status as any,
        references: (fm.references ?? []) as readonly string[],
        speciesIds: (fm.species_ids ?? []) as readonly string[],
        stageIds: (fm.stage_ids ?? []) as readonly string[],
        activityType: fm.activity_type as any,
      };
    }

    case "care_guide": {
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
        speciesIds: (fm.species_ids ?? []) as readonly string[],
        stageIds: (fm.stage_ids ?? []) as readonly string[],
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
