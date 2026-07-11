/**
 * @jest-environment node
 */

import { normalizeDocument } from "../normalize";
import { validateRelationships } from "../relationship-validator";
import { validateStageGraphs } from "../stage-graph-validator";
import { validateContentQuality } from "../content-quality-validator";
import type { ValidatedSourceDocument } from "../types";

describe("graph validation and normalization", () => {
  describe("normalization", () => {
    it("converts snake_case frontmatter keys to camelCase in normalized output", () => {
      const mockDoc: ValidatedSourceDocument = {
        id: "plant.grape",
        type: "plant_species",
        path: "knowledge/species/grape/species.md",
        absolutePath: "/path/to/species.md",
        body: "# Nho\nBody here",
        frontmatter: {
          title: "Nho",
          version: "1.0.0",
          locale: "vi-VN",
          status: "approved",
          scientific_name: "Vitis vinifera",
          lifecycles: {
            development: {
              title: "Dev",
              repeatable: false,
              initial_stage_id: "grape.stage.trunk-development",
              stages: [
                {
                  id: "grape.stage.trunk-development",
                  title: "Nuôi thân",
                  sequence: 1,
                  playbook_status: "approved",
                },
              ]
            },
            production: { title: "Prod", repeatable: true, initial_stage_id: "prod.start", stages: [] }
          },
          references: ["ref.osu"],
        },
      };

      const normalized = normalizeDocument(mockDoc);
      expect(normalized).toMatchObject({
        id: "plant.grape",
        type: "plant_species",
        title: "Nho",
        version: "1.0.0",
        bodyMarkdown: "# Nho\nBody here",
        locale: "vi-VN",
        status: "approved",
        scientificName: "Vitis vinifera",
        lifecycles: {
          development: {
            stages: [
              {
                id: "grape.stage.trunk-development",
                title: "Nuôi thân",
                sequence: 1,
                playbookStatus: "approved",
              },
            ]
          },
          production: { stages: [] }
        },
        references: ["ref.osu"],
      });
      // Ensure raw snake_case and path properties do not seep into the output document fields unless permitted
      expect(normalized).not.toHaveProperty("scientific_name");
      expect(normalized).not.toHaveProperty("stage_journey");
    });
  });

  describe("relationship validation", () => {
    it("detects duplicate global IDs", () => {
      const docs: any[] = [
        {
          id: "duplicate.id",
          type: "plant_species",
          path: "path1.md",
          title: "Nho",
          version: "1.0.0",
          bodyMarkdown: "Tưới nước cho cây nho.",
          locale: "vi-VN",
          status: "approved",
          scientificName: "Vitis vinifera",
          lifecycles: { development: { stages: [] }, production: { stages: [] } },
          references: [],
        },
        {
          id: "duplicate.id",
          type: "reference_source",
          path: "path2.md",
          title: "Duplicate Source",
          version: "1.0.0",
          bodyMarkdown: "Test source.",
          publisher: "Publisher",
          sourceType: "extension_guide",
          url: "http://example.com",
          accessed: "2026-07-11",
          status: "active",
        },
      ];

      const diagnostics = validateRelationships(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_DUPLICATE_ID",
          documentId: "duplicate.id",
        }),
      );
    });

    it("detects missing or wrong-type references", () => {
      const docs: any[] = [
        {
          id: "grape.stage.trunk-development",
          type: "growth_stage_playbook",
          path: "playbook.md",
          title: "Nuôi thân",
          version: "1.0.0",
          bodyMarkdown: "Phát triển thân.",
          locale: "vi-VN",
          status: "approved",
          speciesId: "plant.grape", // Correct type
                    primaryObjective: "Objective",
          entryCriteria: [],
          exitCriteria: [],
          estimatedDuration: "1 week",
          recommendedPlaybook: "playbook",
          recommendedKnowledgeTopics: [],
          references: ["missing.ref"], // Missing reference
        },
        {
          id: "plant.grape",
          type: "plant_species",
          path: "species.md",
          title: "Nho",
          version: "1.0.0",
          bodyMarkdown: "Cây nho.",
          locale: "vi-VN",
          status: "approved",
          scientificName: "Vitis vinifera",
          lifecycles: { development: { stages: [{ id: "grape.stage.trunk-development", title: "Nuôi thân", sequence: 1, playbookStatus: "approved" }] }, production: { stages: [] } },
          references: [],
        },
      ];

      const diagnostics = validateRelationships(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_RELATIONSHIP_MISSING",
          documentId: "grape.stage.trunk-development",
          field: "references",
        }),
      );

    });
  });

  describe("stage graph validation", () => {
    it("flags missing cross-lifecycle transition", () => {
      const docs: any[] = [
        {
          id: "plant.grape",
          type: "plant_species",
          path: "species.md",
          title: "Nho",
          version: "1.0.0",
          bodyMarkdown: "Cây nho.",
          locale: "vi-VN",
          status: "approved",
          scientificName: "Vitis vinifera",
          lifecycles: {
            development: {
              stages: [
                { id: "stage1", title: "Stage 1", sequence: 1, playbookStatus: "approved" },
                { id: "stage2", title: "Stage 2", sequence: 3, playbookStatus: "approved" }, // Gap: sequence 2 missing
              ]
            },
            production: { stages: [] }
          },
          references: [],
        },
      ];

      const diagnostics = validateStageGraphs(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_STAGE_CHAIN_INVALID",
          documentId: "plant.grape",
          field: "lifecycles.development",
        }),
      );
    });

    it("verifies nextStageId successor matching and status alignment", () => {
      const docs: any[] = [
        {
          id: "plant.grape",
          type: "plant_species",
          path: "species.md",
          title: "Nho",
          version: "1.0.0",
          bodyMarkdown: "Cây nho.",
          locale: "vi-VN",
          status: "approved",
          scientificName: "Vitis vinifera",
          lifecycles: {
            development: {
              stages: [
                { id: "stage1", title: "Stage 1", sequence: 1, playbookStatus: "approved", transitions: [{ to: "stage2" }] },
                { id: "stage2", title: "Stage 2", sequence: 2, playbookStatus: "approved", transitions: [{ to: "stage3" }] },
              ]
            },
            production: { 
              stages: [
                { id: "stage3", title: "Stage 3", sequence: 1, playbookStatus: "approved", transitions: [] },
              ] 
            }
          },
          references: [],
        },
        {
          id: "stage1",
          type: "growth_stage_playbook",
          path: "stage1.md",
          title: "Stage 1",
          version: "1.0.0",
          bodyMarkdown: "Nội dung stage 1.",
          locale: "vi-VN",
          status: "approved",
          speciesId: "plant.grape",
                    primaryObjective: "Objective",
          entryCriteria: [],
          exitCriteria: [],
          estimatedDuration: "1 week",
          recommendedPlaybook: "playbook",
          recommendedKnowledgeTopics: [],
          references: [],
        },
        {
          id: "stage2",
          type: "growth_stage_playbook",
          path: "stage2.md",
          title: "Stage 2",
          version: "1.0.0",
          bodyMarkdown: "Nội dung stage 2.",
          locale: "vi-VN",
          status: "approved",
          speciesId: "plant.grape",
                    primaryObjective: "Objective",
          entryCriteria: [],
          exitCriteria: [],
          estimatedDuration: "1 week",
          recommendedPlaybook: "playbook",
          recommendedKnowledgeTopics: [],
          references: [],
        },
        {
          id: "stage3",
          type: "growth_stage_playbook",
          path: "stage3.md",
          title: "Stage 3",
          version: "1.0.0",
          bodyMarkdown: "Nội dung stage 3.",
          locale: "vi-VN",
          status: "approved",
          speciesId: "plant.grape",
          primaryObjective: "Objective",
          entryCriteria: [],
          exitCriteria: [],
          estimatedDuration: "1 week",
          recommendedPlaybook: "playbook",
          recommendedKnowledgeTopics: [],
          references: [],
        },
      ];

      const diagnostics = validateStageGraphs(docs);
      expect(diagnostics).toEqual([]);
    });
  });

  describe("content quality validation", () => {
    it("reports missing reason in care recommendations", () => {
      const docs: any[] = [
        {
          id: "recommendation.test",
          type: "care_recommendation_definition",
          path: "rec.md",
          title: "Tưới nước",
          version: "1.0.0",
          bodyMarkdown: "## Hướng dẫn\nTưới nước hàng ngày.\n", // Missing "## Vì sao nên làm"
          locale: "vi-VN",
          status: "approved",
          speciesIds: [],
          stageIds: [],
          activityType: "watering",
          references: [],
        },
      ];

      const diagnostics = validateContentQuality(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_REASON_MISSING",
          documentId: "recommendation.test",
        }),
      );
    });

    it("requires references when avoid or safety advice is present", () => {
      const docs: any[] = [
        {
          id: "stage.test",
          type: "growth_stage_playbook",
          path: "stage.md",
          title: "Giai đoạn ra hoa",
          version: "1.0.0",
          bodyMarkdown: "## Điều cần tránh\nKhông bón phân quá liều.\n",
          locale: "vi-VN",
          status: "approved",
          speciesId: "plant.grape",
          sequence: 1,
          careRecommendationIds: [],
          guideIds: [],
          nextStageId: null,
          references: [], // Safety section requires references
        },
      ];

      const diagnostics = validateContentQuality(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_REFERENCE_REQUIRED",
          documentId: "stage.test",
          field: "references",
        }),
      );
    });

    it("detects lack of Vietnamese content in user-facing documents", () => {
      const docs: any[] = [
        {
          id: "plant.grape",
          type: "plant_species",
          path: "species.md",
          title: "Grape", // English only, no diacritics
          version: "1.0.0",
          bodyMarkdown: "This is a grape species in English with no Vietnamese diacritics.",
          locale: "vi-VN",
          status: "approved",
          scientificName: "Vitis vinifera",
          lifecycles: { development: { stages: [] }, production: { stages: [] } },
          references: [],
        },
      ];

      const diagnostics = validateContentQuality(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_VIETNAMESE_CONTENT_MISSING",
          documentId: "plant.grape",
          field: "locale",
        }),
      );
    });
  });
});
