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
      imageId: "image.grape.stage.seedling",
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
  warningSigns: [
    {
      id: "sign.grape.white-powder",
      type: "warning_sign",
      title: "Bột trắng trên lá hoặc quả",
      summary: "Quan sát nhiều vị trí trước khi kết luận.",
      imageId: "image.grape.warning-sign.white-powder",
      status: "review",
      stageIds: ["grape.stage.seedling"],
      references: ["ref.grape"],
      bodyMarkdown:
        "## Bạn có thể quan sát thấy\n\nMảng trắng.\n\n## Nguyên nhân có thể\n\n- Bụi bám.\n\n## Hãy kiểm tra\n\nMặt dưới lá.\n\n## Nên làm gì\n\nGiữ cây thông thoáng.",
    },
  ],
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
    expect(html).toContain('id="contents"');
    expect(html).toContain("Chương 1");
    expect(html).toContain("Phụ lục A");
    expect(html).toContain("Dấu hiệu thường gặp");
    expect(html).toContain("Xem cách nhận biết →");
    expect(html).toContain('href="#sign.grape.white-powder"');
    expect(html).toContain(
      'src="../assets/images/grape/warning-signs/white-powder.webp"',
    );
    expect(html).toContain("grape.recommendation.seedling.watering");
    expect(html).toContain("suggestAfterDays: 3");
    expect(html).toContain("intervalDays: 3");
    expect(html).toContain("Mỗi 5–7 ngày");
    expect(html).toContain("Chỉ dành cho biên tập và duyệt nội dung");
  });

  it("places referenced stage images inside their chapters", () => {
    const html = renderKnowledgePreview(bundle);

    expect(html).toContain('src="../assets/images/grape/stages/seedling.webp"');
    expect(html).toContain('alt="Minh họa giai đoạn Cây con"');
    expect(html).toContain("image.grape.stage.seedling");
  });

  it("renders supported Markdown and escapes bundle-provided HTML", () => {
    const html = renderKnowledgePreview(bundle);

    expect(html).toContain("<h3>Phạm vi</h3>");
    expect(html).toContain("<strong>đang duyệt</strong>");
    expect(html).toContain("Grape &lt;Guide&gt;");
    expect(html).toContain("Extension &amp; Research");
    expect(html).not.toContain("Grape <Guide>");
  });

  it("resolves Care Plan fertilizer roles from the focused catalogue", () => {
    const html = renderKnowledgePreview({
      ...bundle,
      schemaVersion: "2.3.0",
      carePlans: [
        {
          ...bundle.carePlans[0],
          activityType: "fertilizing",
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
        },
      ],
      fertilizerGuides: [
        {
          id: "fertilizer-guide.focused",
          sections: [
            {
              id: "test",
              title: "Nhóm thử nghiệm",
              items: [
                {
                  id: "fertilizer-role.high-nitrogen",
                  name: "Phân giàu đạm",
                  group: "nitrogen-rich",
                },
                {
                  id: "fertilizer-role.organic-foundation",
                  name: "Phân hữu cơ",
                  group: "organic",
                },
              ],
            },
          ],
        },
      ],
    });

    expect(html).toContain("Ưu tiên: Phân giàu đạm");
    expect(html).toContain("Có thể thay thế: Phân hữu cơ");
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
