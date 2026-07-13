export const KNOWLEDGE_DOCUMENT_TYPES = [
  "plant_species",
  "growth_stage_playbook",
  "care_plan",
  "care_guide",
  "reference_source",
] as const;

export type KnowledgeDocumentType = (typeof KNOWLEDGE_DOCUMENT_TYPES)[number];

export type CompilationMode = "production" | "preview";

export type KnowledgeDiagnosticCode =
  | "KNOWLEDGE_DIRECTORY_MISMATCH"
  | "KNOWLEDGE_FRONTMATTER_MISSING"
  | "KNOWLEDGE_PARSE_FAILED"
  | "KNOWLEDGE_SCHEMA_INVALID"
  | "KNOWLEDGE_SCHEMA_LOAD_FAILED"
  | "KNOWLEDGE_TYPE_UNSUPPORTED"
  | "KNOWLEDGE_DUPLICATE_ID"
  | "KNOWLEDGE_RELATIONSHIP_MISSING"
  | "KNOWLEDGE_RELATIONSHIP_WRONG_TYPE"
  | "KNOWLEDGE_STAGE_CHAIN_INVALID"
  | "KNOWLEDGE_ACTIVITY_TYPE_UNSUPPORTED"
  | "KNOWLEDGE_RECOMMENDATION_SCOPE_DUPLICATE"
  | "KNOWLEDGE_REASON_MISSING"
  | "KNOWLEDGE_REFERENCE_REQUIRED"
  | "KNOWLEDGE_DEPENDENCY_INELIGIBLE"
  | "KNOWLEDGE_BUNDLE_INVALID"
  | "KNOWLEDGE_ARTIFACT_STALE"
  | "KNOWLEDGE_WRITE_FAILED"
  | "KNOWLEDGE_VIETNAMESE_CONTENT_MISSING";

export interface KnowledgeDiagnostic {
  readonly code: KnowledgeDiagnosticCode;
  readonly path: string;
  readonly message: string;
  readonly documentId?: string;
  readonly field?: string;
}

export interface ParsedSourceDocument {
  readonly id: string;
  readonly type: string;
  readonly path: string;
  readonly absolutePath: string;
  readonly frontmatter: Record<string, unknown>;
  readonly body: string;
}

export interface ValidatedSourceDocument extends ParsedSourceDocument {
  readonly type: KnowledgeDocumentType;
}

export interface ParseMarkdownFileInput {
  readonly sourcePath: string;
  readonly repositoryRoot: string;
}

export interface ParseMarkdownFileResult {
  readonly document: ParsedSourceDocument | null;
  readonly diagnostics: readonly KnowledgeDiagnostic[];
}

export interface ValidateSourceDocumentsInput {
  readonly repositoryRoot: string;
  readonly knowledgeRoot?: string;
}

export interface ValidateSourceDocumentsResult {
  readonly documents: readonly ValidatedSourceDocument[];
  readonly diagnostics: readonly KnowledgeDiagnostic[];
}

export interface CompileRequest {
  readonly repositoryRoot: string;
  readonly knowledgeRoot: string;
  readonly mode: CompilationMode;
  readonly write: boolean;
  readonly destinationPath?: string;
}

export type CompilationResult =
  | {
      readonly ok: true;
      readonly mode: CompilationMode;
      readonly bundle: unknown;
      readonly serialized: string;
      readonly destinationPath?: string;
    }
  | {
      readonly ok: false;
      readonly diagnostics: readonly KnowledgeDiagnostic[];
    };

export interface NormalizedBaseDocument {
  readonly id: string;
  readonly type: KnowledgeDocumentType;
  readonly path: string;
  readonly title: string;
  readonly version: string;
  readonly bodyMarkdown: string;
}

export interface NormalizedUserFacingBaseDocument extends NormalizedBaseDocument {
  readonly locale: string;
  readonly status: "draft" | "review" | "approved" | "deprecated" | "archived";
  readonly references: readonly string[];
}

export interface StageJourneyItem {
  readonly id: string;
  readonly title: string;
  readonly sequence: number;
  readonly transitions?: readonly { readonly to: string; readonly condition?: string }[];
  readonly playbookStatus: "unavailable" | "draft" | "review" | "approved";
}

export interface LifecycleDefinition {
  readonly title: string;
  readonly repeatable: boolean;
  readonly initialStageId: string;
  readonly stages: readonly StageJourneyItem[];
}

export interface PlantSpeciesLifecycles {
  readonly development: LifecycleDefinition;
  readonly production: LifecycleDefinition;
}

export interface NormalizedPlantSpecies extends NormalizedUserFacingBaseDocument {
  readonly type: "plant_species";
  readonly scientificName: string;
  readonly lifecycles: PlantSpeciesLifecycles;
}

export interface NormalizedGrowthStagePlaybook extends NormalizedUserFacingBaseDocument {
  readonly type: "growth_stage_playbook";
  readonly speciesId: string;
  readonly sequence: number;
  readonly lifecycleId: "development" | "production";
  readonly primaryObjective: string;
  readonly entryCriteria: readonly string[];
  readonly exitCriteria: readonly string[];
  readonly estimatedDuration: string;
  readonly recommendedKnowledgeTopics: readonly string[];
}

export interface NormalizedCarePlan extends NormalizedUserFacingBaseDocument {
  readonly type: "care_plan";
  readonly priority: number;
  readonly goal: string;
  readonly recommendedInputs?: readonly RecommendedInput[];
  readonly frequency?: CareFrequency;
  readonly notes?: readonly string[];
  readonly speciesIds: readonly string[];
  readonly stageIds: readonly string[];
  readonly activityType: "watering" | "fertilizing" | "spraying";
  readonly eligibility: Readonly<{
    readonly kind: "elapsed_days_since_activity";
    readonly suggestAfterDays: number;
  }>;
  readonly onMissingHistory: "suggest" | "withhold";
}

export interface RecommendedInput {
  readonly group: string;
  readonly examples: string;
}

export interface CareFrequency {
  readonly ground: Readonly<{ display: string; intervalDays: number }>;
  readonly container: Readonly<{ display: string; intervalDays: number }>;
}

export interface NormalizedCareGuide extends NormalizedUserFacingBaseDocument {
  readonly type: "care_guide";
  readonly goal: string;
  readonly speciesIds: readonly string[];
  readonly stageIds: readonly string[];
  readonly recommendedInputs?: readonly RecommendedInput[];
  readonly frequency?: CareFrequency;
  readonly notes?: readonly string[];
}

export interface NormalizedReferenceSource extends NormalizedBaseDocument {
  readonly type: "reference_source";
  readonly publisher: string;
  readonly sourceType: "extension_guide" | "research_paper" | "expert_review" | "regulatory_guidance";
  readonly url: string;
  readonly accessed: string;
  readonly status: "active" | "superseded" | "unavailable";
}

export type NormalizedKnowledgeDocument =
  | NormalizedPlantSpecies
  | NormalizedGrowthStagePlaybook
  | NormalizedCarePlan
  | NormalizedCareGuide
  | NormalizedReferenceSource;

