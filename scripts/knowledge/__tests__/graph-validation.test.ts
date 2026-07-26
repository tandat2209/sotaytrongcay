/**
 * @jest-environment node
 */

import { normalizeDocument } from "../normalize";
import { validateRelationships } from "../relationship-validator";
import { validateStageGraphs } from "../stage-graph-validator";
import { validateContentQuality } from "../content-quality-validator";
import type {
  NormalizedCarePlan,
  NormalizedDisease,
  NormalizedFertilizerGuide,
  ValidatedSourceDocument,
} from "../types";

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
              ],
            },
            production: {
              title: "Prod",
              repeatable: true,
              initial_stage_id: "prod.start",
              stages: [],
            },
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
            ],
          },
          production: { stages: [] },
        },
        references: ["ref.osu"],
      });
      // Ensure raw snake_case and path properties do not seep into the output document fields unless permitted
      expect(normalized).not.toHaveProperty("scientific_name");
      expect(normalized).not.toHaveProperty("stage_journey");
    });

    it("normalizes pest and disease relationship fields without inventing warning signs", () => {
      const mockDoc: ValidatedSourceDocument = {
        id: "disease.grape.powdery-mildew",
        type: "disease",
        path: "knowledge/catalogs/diseases/grape-powdery-mildew.md",
        absolutePath: "/path/to/grape-powdery-mildew.md",
        body: "## Dấu hiệu có thể quan sát\n\nMảng trắng dạng bột.",
        frontmatter: {
          title: "Bệnh phấn trắng trên nho",
          version: "1.0.0",
          locale: "vi-VN",
          status: "review",
          species_ids: ["plant.grape"],
          stage_ids: ["grape.stage.bud-break"],
          warning_sign_ids: [],
          references: ["ref.example"],
        },
      };

      expect(normalizeDocument(mockDoc)).toMatchObject({
        id: "disease.grape.powdery-mildew",
        type: "disease",
        speciesIds: ["plant.grape"],
        stageIds: ["grape.stage.bud-break"],
        warningSignIds: [],
      });
    });

    it("normalizes Care Plan catalogue-role references without product details", () => {
      const mockDoc: ValidatedSourceDocument = {
        id: "grape.recommendation.test.fertilizing",
        type: "care_plan",
        path: "knowledge/species/grape/care-plans/test.fertilizing.md",
        absolutePath: "/path/to/test.fertilizing.md",
        body: "",
        frontmatter: {
          title: "Bón phân thử nghiệm",
          version: "2.0.0",
          locale: "vi-VN",
          status: "review",
          references: ["ref.example"],
          priority: 50,
          goal: "Chọn vai trò phân bón phù hợp.",
          species_ids: ["plant.grape"],
          stage_ids: ["grape.stage.test"],
          activity_type: "fertilizing",
          eligibility: {
            kind: "elapsed_days_since_activity",
            suggest_after_days: 7,
          },
          on_missing_history: "suggest",
          recommended_inputs: [
            {
              catalog_id: "fertilizer-role.high-nitrogen",
              priority: "primary",
            },
            {
              catalog_id: "fertilizer-role.organic-foundation",
              priority: "alternative",
            },
          ],
        },
      };

      expect(normalizeDocument(mockDoc)).toMatchObject({
        recommendedInputs: [
          {
            catalogId: "fertilizer-role.high-nitrogen",
            priority: "primary",
          },
          {
            catalogId: "fertilizer-role.organic-foundation",
            priority: "alternative",
          },
        ],
      });
    });
  });

  describe("relationship validation", () => {
    const fertilizerPlan = (
      overrides: Partial<NormalizedCarePlan>,
    ): NormalizedCarePlan => ({
      id: "care.grape.test.fertilizing",
      type: "care_plan",
      path: "care-plan.md",
      title: "Bón phân thử nghiệm",
      version: "1.0.0",
      bodyMarkdown: "Nội dung thử nghiệm.",
      locale: "vi-VN",
      status: "review",
      references: [],
      priority: 1,
      goal: "Kiểm tra hướng dẫn nhóm phân bón.",
      speciesIds: [],
      stageIds: [],
      activityType: "fertilizing",
      eligibility: {
        kind: "elapsed_days_since_activity",
        suggestAfterDays: 7,
      },
      onMissingHistory: "withhold",
      ...overrides,
    });

    const fertilizerGuide: NormalizedFertilizerGuide = {
      id: "fertilizer-guide.focused",
      type: "fertilizer_guide",
      path: "fertilizer-guide.md",
      title: "Vai trò phân bón thử nghiệm",
      version: "1.0.0",
      bodyMarkdown: "Nội dung thử nghiệm.",
      locale: "vi-VN",
      status: "review",
      references: [],
      sections: [
        {
          id: "test",
          title: "Nhóm thử nghiệm",
          items: [
            {
              id: "fertilizer-role.balanced-nutrition",
              name: "NPK cân đối",
              group: "npk-balanced",
              description: "Vai trò dinh dưỡng cân đối.",
            },
          ],
        },
      ],
    };

    it("requires fertilizing Care Plans to withhold when history is missing", () => {
      const diagnostics = validateRelationships([
        fertilizerPlan({ onMissingHistory: "suggest" }),
      ]);

      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_FERTILIZER_MISSING_HISTORY_INVALID",
          field: "onMissingHistory",
        }),
      );
    });

    it("rejects fertilizer guidance for a group not present in recommended inputs", () => {
      const diagnostics = validateRelationships([
        fertilizerGuide,
        fertilizerPlan({
          recommendedInputs: [
            {
              catalogId: "fertilizer-role.balanced-nutrition",
              priority: "primary",
            },
          ],
          fertilizerGroupGuidance: [
            {
              group: "potassium-rich",
              description: "Hỗ trợ mục tiêu dinh dưỡng của giai đoạn.",
            },
          ],
        }),
      ]);

      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_FERTILIZER_GROUP_GUIDANCE_INVALID",
          field: "fertilizerGroupGuidance",
        }),
      );
    });

    it("rejects duplicate fertilizer-group guidance", () => {
      const diagnostics = validateRelationships([
        fertilizerGuide,
        fertilizerPlan({
          recommendedInputs: [
            {
              catalogId: "fertilizer-role.balanced-nutrition",
              priority: "primary",
            },
          ],
          fertilizerGroupGuidance: [
            { group: "npk-balanced", description: "Mô tả thứ nhất." },
            { group: "npk-balanced", description: "Mô tả thứ hai." },
          ],
        }),
      ]);

      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_FERTILIZER_GROUP_GUIDANCE_INVALID",
          message: expect.stringContaining("more than once"),
        }),
      );
    });

    it("rejects a Care Plan reference to a missing fertilizer role", () => {
      const diagnostics = validateRelationships([
        fertilizerGuide,
        fertilizerPlan({
          recommendedInputs: [
            {
              catalogId: "fertilizer-role.missing",
              priority: "primary",
            },
          ],
        }),
      ]);

      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_FERTILIZER_ROLE_REFERENCE_INVALID",
          message: expect.stringContaining("missing fertilizer role"),
        }),
      );
    });

    it("requires exactly one primary fertilizer role", () => {
      const diagnostics = validateRelationships([
        fertilizerGuide,
        fertilizerPlan({
          recommendedInputs: [
            {
              catalogId: "fertilizer-role.balanced-nutrition",
              priority: "alternative",
            },
          ],
        }),
      ]);

      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_FERTILIZER_ROLE_REFERENCE_INVALID",
          message: expect.stringContaining("exactly one primary"),
        }),
      );
    });

    it("detects duplicate global IDs", () => {
      const docs = [
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
          lifecycles: {
            development: { stages: [] },
            production: { stages: [] },
          },
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
      const docs = [
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
          lifecycles: {
            development: {
              stages: [
                {
                  id: "grape.stage.trunk-development",
                  title: "Nuôi thân",
                  sequence: 1,
                  playbookStatus: "approved",
                },
              ],
            },
            production: { stages: [] },
          },
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
      const docs = [
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
                {
                  id: "stage1",
                  title: "Stage 1",
                  sequence: 1,
                  playbookStatus: "approved",
                },
                {
                  id: "stage2",
                  title: "Stage 2",
                  sequence: 3,
                  playbookStatus: "approved",
                }, // Gap: sequence 2 missing
              ],
            },
            production: { stages: [] },
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
      const docs = [
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
                {
                  id: "stage1",
                  title: "Stage 1",
                  sequence: 1,
                  playbookStatus: "approved",
                  transitions: [{ to: "stage2" }],
                },
                {
                  id: "stage2",
                  title: "Stage 2",
                  sequence: 2,
                  playbookStatus: "approved",
                  transitions: [{ to: "stage3" }],
                },
              ],
            },
            production: {
              stages: [
                {
                  id: "stage3",
                  title: "Stage 3",
                  sequence: 1,
                  playbookStatus: "approved",
                  transitions: [],
                },
              ],
            },
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
          references: [],
        },
      ];

      const diagnostics = validateStageGraphs(docs);
      expect(diagnostics).toEqual([]);
    });
  });

  describe("content quality validation", () => {
    const carePlan = {
      id: "grape.recommendation.test.watering",
      type: "care_plan" as const,
      path: "knowledge/species/grape/care-plans/test.watering.md",
      title: "Kiểm tra lịch tưới",
      goal: "Kiểm tra cây trước khi tưới.",
      version: "1.0.0",
      bodyMarkdown: "",
      locale: "vi-VN",
      status: "review" as const,
      priority: 50,
      speciesIds: ["plant.grape"],
      stageIds: ["grape.stage.test"],
      activityType: "watering" as const,
      eligibility: {
        kind: "elapsed_days_since_activity" as const,
        suggestAfterDays: 5,
      },
      onMissingHistory: "suggest" as const,
      references: ["ref.example"],
    };

    it("reports a Care Plan interval that differs from its earliest displayed cadence", () => {
      const diagnostics = validateContentQuality([
        {
          ...carePlan,
          frequency: {
            ground: { display: "Mỗi 5–7 ngày", intervalDays: 3 },
            container: { display: "Hàng tuần", intervalDays: 20 },
          },
        },
      ]);

      expect(diagnostics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "KNOWLEDGE_CARE_PLAN_FREQUENCY_INVALID",
            documentId: carePlan.id,
            field: "frequency.ground.intervalDays",
          }),
          expect.objectContaining({
            code: "KNOWLEDGE_CARE_PLAN_FREQUENCY_INVALID",
            documentId: carePlan.id,
            field: "frequency.container.intervalDays",
          }),
        ]),
      );
    });

    it("rejects a recurring Care Plan frequency for one-time display guidance", () => {
      const diagnostics = validateContentQuality([
        {
          ...carePlan,
          frequency: {
            ground: {
              display: "Một lần duy nhất trong tuần đầu",
              intervalDays: 7,
            },
            container: {
              display: "Một lần duy nhất trong tuần đầu",
              intervalDays: 7,
            },
          },
        },
      ]);

      expect(diagnostics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "KNOWLEDGE_CARE_PLAN_FREQUENCY_INVALID",
            field: "frequency.ground.display",
          }),
          expect.objectContaining({
            code: "KNOWLEDGE_CARE_PLAN_FREQUENCY_INVALID",
            field: "frequency.container.display",
          }),
        ]),
      );
    });

    it("accepts aligned Care Plan cadences followed by explanatory punctuation", () => {
      const diagnostics = validateContentQuality([
        {
          ...carePlan,
          frequency: {
            ground: {
              display: "Mỗi 5–7 ngày — kiểm tra đất trước khi tưới",
              intervalDays: 5,
            },
            container: {
              display: "Mỗi 1–2 tuần, giảm khi cây sinh trưởng chậm",
              intervalDays: 7,
            },
          },
        },
      ]);

      expect(diagnostics).toEqual([]);
    });

    it("reports missing goal in care guides", () => {
      const docs = [
        {
          id: "guide.test",
          type: "care_guide",
          path: "guide.md",
          title: "Tưới nước",
          goal: "",
          version: "1.0.0",
          bodyMarkdown: "## Hướng dẫn\nTưới nước hàng ngày.\n",
          locale: "vi-VN",
          status: "approved",
          speciesIds: [],
          stageIds: [],
          references: [],
        },
      ];

      const diagnostics = validateContentQuality(docs);
      expect(diagnostics).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_REASON_MISSING",
          documentId: "guide.test",
        }),
      );
    });

    it("requires references when avoid or safety advice is present", () => {
      const docs = [
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
      const docs = [
        {
          id: "plant.grape",
          type: "plant_species",
          path: "species.md",
          title: "Grape", // English only, no diacritics
          version: "1.0.0",
          bodyMarkdown:
            "This is a grape species in English with no Vietnamese diacritics.",
          locale: "vi-VN",
          status: "approved",
          scientificName: "Vitis vinifera",
          lifecycles: {
            development: { stages: [] },
            production: { stages: [] },
          },
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

    it("requires every safety-oriented disease section to contain content", () => {
      const disease: NormalizedDisease = {
        id: "disease.grape.powdery-mildew",
        type: "disease",
        path: "knowledge/catalogs/diseases/grape-powdery-mildew.md",
        title: "Bệnh phấn trắng trên nho",
        version: "1.0.0",
        bodyMarkdown: `## Dấu hiệu có thể quan sát

Mảng trắng dạng bột.

## Điều kiện rủi ro

Theo dõi mô xanh.

## Phòng ngừa

Giữ tán thông thoáng.

## Hành động an toàn ban đầu

Kiểm tra trước khi xử lý.

## Khi nào cần chuyên gia
`,
        locale: "vi-VN",
        status: "review",
        references: ["ref.example"],
        speciesIds: ["plant.grape"],
        stageIds: ["grape.stage.bud-break"],
        warningSignIds: [],
      };

      expect(validateContentQuality([disease])).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_REQUIRED_SECTION_MISSING",
          documentId: disease.id,
          field: "bodyMarkdown",
        }),
      );
    });
  });
});
