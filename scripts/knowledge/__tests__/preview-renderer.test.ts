import { renderKnowledgePreview } from "../preview-renderer";

const bundle = {
  schemaVersion: "2.1.0",
  contentVersion: "1.0.0",
  mode: "preview",
  species: [
    {
      id: "plant.grape",
      type: "plant_species",
      title: "Nho",
      locale: "vi-VN",
      version: "1.0.0",
      status: "review",
      references: ["ref.grape"],
      scientificName: "Vitis spp.",
      lifecycles: {
        development: {
          title: "Kiến thiết",
          repeatable: false,
          initialStageId: "grape.stage.seedling",
          stages: [
            {
              id: "grape.stage.seedling",
              title: "Cây con",
              sequence: 1,
              transitions: [],
              playbookStatus: "review",
            },
          ],
        },
        production: {
          title: "Sản xuất",
          repeatable: true,
          initialStageId: "",
          stages: [],
        },
      },
      bodyMarkdown: "## Phạm vi\n\nNội dung **đang duyệt**.",
    },
  ],
  stagePlaybooks: [
    {
      id: "grape.stage.seedling",
      type: "growth_stage_playbook",
      title: "Cây con",
      locale: "vi-VN",
      version: "1.0.0",
      status: "review",
      references: ["ref.grape"],
      speciesId: "plant.grape",
      sequence: 1,
      lifecycleId: "development",
      primaryObjective: "Nuôi cây khỏe.",
      entryCriteria: ["Cây đã bén rễ"],
      exitCriteria: ["Có chồi chính"],
      estimatedDuration: "2–4 tuần",
      bodyMarkdown: "Theo dõi cây.",
    },
  ],
  carePlans: [
    {
      id: "grape.recommendation.seedling.watering",
      type: "care_plan",
      title: "Kiểm tra nước",
      goal: "Kiểm tra trước khi tưới.",
      locale: "vi-VN",
      version: "1.0.0",
      status: "review",
      references: ["ref.grape"],
      priority: 50,
      speciesIds: ["plant.grape"],
      stageIds: ["grape.stage.seedling"],
      activityType: "watering",
      eligibility: {
        kind: "elapsed_days_since_activity",
        suggestAfterDays: 3,
      },
      onMissingHistory: "suggest",
      frequency: {
        ground: { display: "Mỗi 5–7 ngày", intervalDays: 3 },
        container: { display: "Khi đất bắt đầu khô", intervalDays: 2 },
      },
      notes: ["Không tưới theo lịch cố định."],
      bodyMarkdown: "",
    },
  ],
  guides: [],
  diseases: [],
  pests: [],
  references: [
    {
      id: "ref.grape",
      type: "reference_source",
      title: "Grape <Guide>",
      version: "1.0.0",
      status: "active",
      publisher: "Extension & Research",
      sourceType: "extension_guide",
      url: "https://example.com/grape?lang=vi&view=full",
      accessed: "2026-07-22",
      bodyMarkdown: "Review notes.",
    },
  ],
};

describe("knowledge preview renderer", () => {
  it("renders all review sections and exposes executable care-plan values", () => {
    const html = renderKnowledgePreview(bundle);

    expect(html).toContain("Cẩm nang duyệt kiến thức");
    expect(html).toContain("Schema 2.1.0");
    expect(html).toContain("Nội dung 1.0.0");
    expect(html).toContain("1 giai đoạn");
    expect(html).toContain("1 kế hoạch chăm sóc");
    expect(html).toContain("grape.recommendation.seedling.watering");
    expect(html).toContain("suggestAfterDays: 3");
    expect(html).toContain("intervalDays: 3");
    expect(html).toContain("Mỗi 5–7 ngày");
    expect(html).toContain("Chỉ dành cho biên tập và duyệt nội dung");
  });

  it("renders supported Markdown and escapes bundle-provided HTML", () => {
    const html = renderKnowledgePreview(bundle);

    expect(html).toContain("<h3>Phạm vi</h3>");
    expect(html).toContain("<strong>đang duyệt</strong>");
    expect(html).toContain("Grape &lt;Guide&gt;");
    expect(html).toContain("Extension &amp; Research");
    expect(html).not.toContain("Grape <Guide>");
  });

  it("produces deterministic output", () => {
    expect(renderKnowledgePreview(bundle)).toBe(renderKnowledgePreview(bundle));
  });

  it("rejects an object that is not a compiled knowledge bundle", () => {
    expect(() => renderKnowledgePreview({ mode: "preview" })).toThrow(
      "Invalid compiled knowledge bundle",
    );
  });
});
