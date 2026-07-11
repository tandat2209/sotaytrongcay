/**
 * @jest-environment node
 */

import { selectEligibleContent } from "../eligibility";
import { serializeBundle } from "../serialize";
import type {
  NormalizedKnowledgeDocument,
  NormalizedPlantSpecies,
  NormalizedGrowthStagePlaybook,
  NormalizedReferenceSource,
} from "../types";

describe("compiler selection and serialization integration", () => {
  const mockSpecies: NormalizedPlantSpecies = {
    id: "plant.grape",
    type: "plant_species",
    title: "Nho",
    version: "1.0.0",
    bodyMarkdown: "Cây nho.",
    locale: "vi-VN",
    status: "approved",
    references: ["ref.osu"],
    scientificName: "Vitis vinifera",
    lifecycles: {
      development: { title: "Dev", repeatable: false, initialStageId: "stage.trunk", stages: [{ id: "stage.trunk", title: "Nuôi thân", sequence: 1, playbookStatus: "approved", transitions: [{ to: "stage.prod" }] }] },
      production: { title: "Prod", repeatable: true, initialStageId: "stage.prod", stages: [{ id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: [] }] }
    },
    path: "species.md",
  };

  const mockPlaybook: NormalizedGrowthStagePlaybook = {
    id: "stage.trunk",
    type: "growth_stage_playbook",
    title: "Nuôi thân",
    version: "1.0.0",
    bodyMarkdown: "Playbook nuôi thân.",
    locale: "vi-VN",
    status: "approved",
    references: ["ref.osu"],
    speciesId: "plant.grape",
    sequence: 1,
    machineId: "development",
    primaryObjective: "Objective",
    entryCriteria: [],
    exitCriteria: [],
    estimatedDuration: "1 week",
        defaultReminderTemplates: [],
    recommendedKnowledgeTopics: [],
    path: "stage.md",
  };

  const mockRef: NormalizedReferenceSource = {
    id: "ref.osu",
    type: "reference_source",
    title: "OSU Grape Guide",
    version: "1.0.0",
    bodyMarkdown: "OSU Reference.",
    publisher: "OSU Extension",
    sourceType: "extension_guide",
    url: "http://example.com/osu",
    accessed: "2026-07-11",
    status: "active",
    path: "ref.md",
  };

  describe("eligibility and selection", () => {
    it("selects only approved user-facing documents and active reachable references in production mode", () => {
      const draftPlaybook: NormalizedGrowthStagePlaybook = {
        ...mockPlaybook,
        id: "stage.draft",
        status: "draft",
      };

      const reviewPlaybook: NormalizedGrowthStagePlaybook = {
        ...mockPlaybook,
        id: "stage.review",
        status: "review",
      };

      const nonViDoc: NormalizedPlantSpecies = {
        ...mockSpecies,
        id: "plant.en-grape",
        locale: "en-US",
      };

      const result = selectEligibleContent(
        [mockSpecies, mockPlaybook, mockRef, draftPlaybook, reviewPlaybook, nonViDoc],
        "production",
      );

      expect(result.ok).toBe(true);
      const ids = result.documents.map((d) => d.id);
      expect(ids).toContain("plant.grape");
      expect(ids).toContain("stage.trunk");
      expect(ids).toContain("ref.osu");
      expect(ids).not.toContain("stage.draft");
      expect(ids).not.toContain("stage.review");
      expect(ids).not.toContain("plant.en-grape");
    });

    it("selects review and approved documents in preview mode", () => {
      const reviewPlaybook: NormalizedGrowthStagePlaybook = {
        ...mockPlaybook,
        id: "stage.review",
        status: "review",
      };

      const result = selectEligibleContent(
        [mockSpecies, mockPlaybook, mockRef, reviewPlaybook],
        "preview",
      );

      expect(result.ok).toBe(true);
      const ids = result.documents.map((d) => d.id);
      expect(ids).toContain("plant.grape");
      expect(ids).toContain("stage.trunk");
      expect(ids).toContain("stage.review");
    });

    it("fails with KNOWLEDGE_DEPENDENCY_INELIGIBLE when a dependency is ineligible in production mode", () => {
      const speciesWithReviewStage: NormalizedPlantSpecies = {
        ...mockSpecies,
        lifecycles: {
          development: { title: "Dev", repeatable: false, initialStageId: "stage.review", stages: [{ id: "stage.review", title: "Review Stage", sequence: 1, playbookStatus: "review", transitions: [{ to: "stage.prod" }] }] },
          production: { title: "Prod", repeatable: true, initialStageId: "stage.prod", stages: [{ id: "stage.prod", title: "Prod", sequence: 1, playbookStatus: "approved", transitions: [] }] }
        },
      };

      const reviewPlaybook: NormalizedGrowthStagePlaybook = {
        ...mockPlaybook,
        id: "stage.review",
        status: "review",
      };

      const result = selectEligibleContent(
        [speciesWithReviewStage, reviewPlaybook, mockRef],
        "production",
      );

      expect(result.ok).toBe(false);
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_DEPENDENCY_INELIGIBLE",
        }),
      );
    });

    it("fails when a reachable reference is inactive", () => {
      const inactiveRef: NormalizedReferenceSource = {
        ...mockRef,
        status: "superseded",
      };

      const result = selectEligibleContent(
        [mockSpecies, mockPlaybook, inactiveRef],
        "production",
      );

      expect(result.ok).toBe(false);
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_DEPENDENCY_INELIGIBLE",
          documentId: "plant.grape",
          field: "references",
        }),
      );
    });
  });

  describe("determinism and serialization", () => {
    it("produces identical serialized outputs regardless of discovery order", () => {
      const orderA = [mockSpecies, mockPlaybook, mockRef];
      const orderB = [mockRef, mockPlaybook, mockSpecies];

      const serializedA = serializeBundle(orderA, "production");
      const serializedB = serializeBundle(orderB, "production");

      expect(serializedA).toBe(serializedB);
    });

    it("ensures nested arrays are sorted lexically", () => {
      const playbookWithUnorderedRefs: NormalizedGrowthStagePlaybook = {
        ...mockPlaybook,
        references: ["ref.z", "ref.a", "ref.m"],
      };

      const result = serializeBundle([playbookWithUnorderedRefs], "production");
      const parsed = JSON.parse(result);
      expect(parsed.stagePlaybooks[0].references).toEqual(["ref.a", "ref.m", "ref.z"]);
    });

    it("ensures output has exactly one trailing newline and no metadata timestamp", () => {
      const result = serializeBundle([mockSpecies], "production");
      expect(result.endsWith("\n")).toBe(true);
      expect(result.endsWith("\n\n")).toBe(false);

      const parsed = JSON.parse(result);
      expect(parsed).not.toHaveProperty("timestamp");
      expect(parsed).not.toHaveProperty("date");
    });
  });
});
