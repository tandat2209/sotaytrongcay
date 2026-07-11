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
      const stageJourney = ((fm.stage_journey ?? []) as readonly any[]).map(
        (item): StageJourneyItem => ({
          id: String(item.id),
          title: String(item.title),
          sequence: Number(item.sequence),
          playbookStatus: item.playbook_status,
        }),
      );

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
        stageJourney,
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
        sequence: Number(fm.sequence),
        stageGroup: fm.stage_group as "development" | "production",
        repeatable: Boolean(fm.repeatable),
        primaryObjective: String(fm.primary_objective),
        entryCriteria: (fm.entry_criteria ?? []) as readonly string[],
        exitCriteria: (fm.exit_criteria ?? []) as readonly string[],
        estimatedDuration: String(fm.estimated_duration),
        recommendedPlaybook: String(fm.recommended_playbook),
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
