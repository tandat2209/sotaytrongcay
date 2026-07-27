type JsonRecord = Readonly<Record<string, unknown>>;

interface PreviewBundle {
  readonly schemaVersion: string;
  readonly contentVersion: string;
  readonly mode: "preview" | "production";
  readonly species: readonly JsonRecord[];
  readonly stagePlaybooks: readonly JsonRecord[];
  readonly carePlans: readonly JsonRecord[];
  readonly guides: readonly JsonRecord[];
  readonly fertilizerGuides: readonly JsonRecord[];
  readonly diseases: readonly JsonRecord[];
  readonly pests: readonly JsonRecord[];
  readonly warningSigns: readonly JsonRecord[];
  readonly references: readonly JsonRecord[];
}

const ACTIVITY_LABELS: Readonly<Record<string, string>> = {
  watering: "💧 Tưới nước",
  fertilizing: "🌱 Bón phân",
  spraying: "🛡️ Phun/xịt",
};

const STAGE_IMAGE_PATHS: Readonly<Record<string, string>> = {
  "image.grape.stage.bud-break": "../assets/images/grape/stages/bud-break.webp",
  "image.grape.stage.canopy-formation":
    "../assets/images/grape/stages/canopy-formation.webp",
  "image.grape.stage.flowering": "../assets/images/grape/stages/flowering.webp",
  "image.grape.stage.fruit-development":
    "../assets/images/grape/stages/fruit-development.webp",
  "image.grape.stage.fruit-set": "../assets/images/grape/stages/fruit-set.webp",
  "image.grape.stage.harvest": "../assets/images/grape/stages/harvest.webp",
  "image.grape.stage.pruning": "../assets/images/grape/stages/pruning.webp",
  "image.grape.stage.recovery": "../assets/images/grape/stages/recovery.webp",
  "image.grape.stage.ripening": "../assets/images/grape/stages/ripening.webp",
  "image.grape.stage.seedling": "../assets/images/grape/stages/seedling.webp",
  "image.grape.stage.trellis-training":
    "../assets/images/grape/stages/trellis-training.webp",
  "image.grape.stage.trunk-development":
    "../assets/images/grape/stages/trunk-development.webp",
};

const WARNING_SIGN_IMAGE_PATHS: Readonly<Record<string, string>> = {
  "image.grape.warning-sign.flower-young-fruit-damage":
    "../assets/images/grape/warning-signs/flower-young-fruit-damage.webp",
  "image.grape.warning-sign.fruit-cracking-soft-rot":
    "../assets/images/grape/warning-signs/fruit-cracking-soft-rot.webp",
  "image.grape.warning-sign.sticky-residue-or-aphids":
    "../assets/images/grape/warning-signs/sticky-residue-or-aphids.webp",
  "image.grape.warning-sign.white-powder":
    "../assets/images/grape/warning-signs/white-powder.webp",
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRecordArray(value: unknown): value is readonly JsonRecord[] {
  return Array.isArray(value) && value.every(isRecord);
}

function stringValue(record: JsonRecord, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function numberValue(record: JsonRecord, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function recordValue(record: JsonRecord, key: string): JsonRecord | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

function recordArray(record: JsonRecord, key: string): readonly JsonRecord[] {
  const value = record[key];
  return Array.isArray(value) && value.every(isRecord) ? value : [];
}

function stringArray(record: JsonRecord, key: string): readonly string[] {
  const value = record[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseBundle(value: unknown): PreviewBundle {
  if (!isRecord(value)) {
    throw new Error("Invalid compiled knowledge bundle: expected an object.");
  }

  const schemaVersion = stringValue(value, "schemaVersion");
  const contentVersion = stringValue(value, "contentVersion");
  const mode = stringValue(value, "mode");
  const species = value.species;
  const stagePlaybooks = value.stagePlaybooks;
  const carePlans = value.carePlans;
  const guides = value.guides;
  const references = value.references;

  if (
    !schemaVersion ||
    !contentVersion ||
    (mode !== "preview" && mode !== "production") ||
    !isRecordArray(species) ||
    !isRecordArray(stagePlaybooks) ||
    !isRecordArray(carePlans) ||
    !isRecordArray(guides) ||
    !isRecordArray(references)
  ) {
    throw new Error(
      "Invalid compiled knowledge bundle: required metadata or collections are missing.",
    );
  }

  const optionalCollection = (
    key: "diseases" | "pests" | "fertilizerGuides" | "warningSigns",
  ): readonly JsonRecord[] => {
    const collection = value[key];
    if (collection === undefined) return [];
    if (!isRecordArray(collection)) {
      throw new Error(
        `Invalid compiled knowledge bundle: ${key} must be an array.`,
      );
    }
    return collection;
  };

  return {
    schemaVersion,
    contentVersion,
    mode,
    species,
    stagePlaybooks,
    carePlans,
    guides,
    fertilizerGuides: optionalCollection("fertilizerGuides"),
    diseases: optionalCollection("diseases"),
    pests: optionalCollection("pests"),
    warningSigns: optionalCollection("warningSigns"),
    references,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.trim().split(/\r?\n/);
  const output: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const closeParagraph = () => {
    if (paragraph.length > 0) {
      output.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listType !== null) {
      output.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    const unordered = /^[-*]\s+(.+)$/.exec(line);
    const ordered = /^\d+\.\s+(.+)$/.exec(line);

    if (heading) {
      closeParagraph();
      closeList();
      const level = Math.min(heading[1]?.length ?? 1, 4) + 1;
      output.push(`<h${level}>${renderInline(heading[2] ?? "")}</h${level}>`);
    } else if (unordered || ordered) {
      closeParagraph();
      const nextListType = unordered ? "ul" : "ol";
      if (listType !== nextListType) {
        closeList();
        listType = nextListType;
        output.push(`<${listType}>`);
      }
      output.push(
        `<li>${renderInline((unordered ?? ordered)?.[1] ?? "")}</li>`,
      );
    } else if (line.trim() === "") {
      closeParagraph();
      closeList();
    } else {
      closeList();
      paragraph.push(line.trim());
    }
  }

  closeParagraph();
  closeList();
  return output.join("\n");
}

function plural(count: number, singular: string): string {
  return `${count} ${singular}`;
}

function documentSearchText(document: JsonRecord): string {
  return [
    stringValue(document, "id"),
    stringValue(document, "title"),
    stringValue(document, "goal"),
    stringValue(document, "primaryObjective"),
    stringValue(document, "bodyMarkdown"),
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");
}

function renderReferences(ids: readonly string[]): string {
  if (ids.length === 0) {
    return '<span class="missing">Không có nguồn tham khảo</span>';
  }
  return ids
    .map(
      (id) =>
        `<a class="ref-chip" href="#${escapeHtml(id)}">${escapeHtml(id)}</a>`,
    )
    .join("");
}

function renderMeta(document: JsonRecord): string {
  return `<details class="technical"><summary>Thông tin kiểm duyệt</summary><dl>
<div><dt>ID</dt><dd><code>${escapeHtml(stringValue(document, "id"))}</code></dd></div>
<div><dt>Trạng thái</dt><dd>${escapeHtml(stringValue(document, "status"))}</dd></div>
<div><dt>Phiên bản</dt><dd>${escapeHtml(stringValue(document, "version"))}</dd></div>
<div><dt>Ngôn ngữ</dt><dd>${escapeHtml(stringValue(document, "locale") || "—")}</dd></div>
</dl></details>`;
}

function documentCard(
  document: JsonRecord,
  eyebrow: string,
  body: string,
  extraAttributes = "",
): string {
  const attributes = extraAttributes ? ` ${extraAttributes}` : "";
  return `<article class="content-card"${attributes}>
<div class="card-heading"><div><p class="eyebrow">${escapeHtml(eyebrow)}</p><h3>${escapeHtml(stringValue(document, "title"))}</h3></div><span class="status">${escapeHtml(stringValue(document, "status"))}</span></div>
${body}${renderMeta(document)}</article>`;
}

function renderLifecycle(name: string, lifecycle: JsonRecord): string {
  const stages = recordArray(lifecycle, "stages");
  return `<section class="lifecycle"><div class="subheading"><h3>${escapeHtml(stringValue(lifecycle, "title") || name)}</h3><span>${stages.length} giai đoạn · ${lifecycle.repeatable === true ? "lặp lại" : "một lần"}</span></div>
<ol class="journey">${stages
    .map((stage) => {
      const transitions = recordArray(stage, "transitions")
        .map((transition) => stringValue(transition, "to"))
        .filter(Boolean);
      return `<li><a href="#${escapeHtml(stringValue(stage, "id"))}"><strong>${escapeHtml(stringValue(stage, "title"))}</strong><span>Chương ${numberValue(stage, "sequence") ?? "—"}</span></a>${transitions.length > 0 ? `<small>Tiếp theo → ${transitions.map(escapeHtml).join(", ")}</small>` : ""}</li>`;
    })
    .join("")}</ol></section>`;
}

function renderSpecies(species: JsonRecord): string {
  const lifecycles = recordValue(species, "lifecycles");
  return `<section class="species-opening searchable" id="species-${escapeHtml(stringValue(species, "id"))}" data-search="${escapeHtml(documentSearchText(species))}" data-activities="">
<div class="part-label">Phần mở đầu</div><p class="eyebrow">${escapeHtml(stringValue(species, "scientificName"))}</p><h2>${escapeHtml(stringValue(species, "title"))}</h2>
<div class="markdown prose">${renderMarkdown(stringValue(species, "bodyMarkdown"))}</div>
<div class="lifecycle-grid">${lifecycles ? renderLifecycle("development", recordValue(lifecycles, "development") ?? {}) : ""}${lifecycles ? renderLifecycle("production", recordValue(lifecycles, "production") ?? {}) : ""}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(species, "references"))}</div>${renderMeta(species)}</section>`;
}

function renderStageImage(stage: JsonRecord): string {
  const imageId = stringValue(stage, "imageId");
  const source = STAGE_IMAGE_PATHS[imageId];
  if (!source) return "";
  const title = stringValue(stage, "title");
  return `<figure class="stage-figure"><img src="${escapeHtml(source)}" alt="Minh họa giai đoạn ${escapeHtml(title)}" loading="lazy" decoding="async"><figcaption>Minh họa tham chiếu · <code>${escapeHtml(imageId)}</code></figcaption></figure>`;
}

function renderWarningSignImage(sign: JsonRecord): string {
  const imageId = stringValue(sign, "imageId");
  const source = WARNING_SIGN_IMAGE_PATHS[imageId];
  if (!source) return "";
  const title = stringValue(sign, "title");
  return `<figure class="sign-figure"><img src="${escapeHtml(source)}" alt="Minh họa dấu hiệu ${escapeHtml(title)}" loading="lazy" decoding="async"><figcaption>Minh họa tham chiếu · <code>${escapeHtml(imageId)}</code></figcaption></figure>`;
}

function renderFrequency(plan: JsonRecord): string {
  const frequency = recordValue(plan, "frequency");
  if (!frequency) return "";
  const row = (label: string, key: string) => {
    const value = recordValue(frequency, key);
    if (!value) return "";
    return `<tr><th>${label}</th><td>${renderInline(stringValue(value, "display"))}</td><td><code>intervalDays: ${numberValue(value, "intervalDays") ?? "—"}</code></td></tr>`;
  };
  return `<div class="review-block"><h4>Tần suất hiển thị và giá trị thực thi</h4><div class="table-wrap"><table><thead><tr><th>Điều kiện</th><th>Nội dung hiển thị</th><th>Giá trị</th></tr></thead><tbody>${row("Trồng đất", "ground")}${row("Trồng chậu", "container")}</tbody></table></div></div>`;
}

function renderCarePlan(
  plan: JsonRecord,
  fertilizerRoles: ReadonlyMap<string, JsonRecord>,
): string {
  const eligibility = recordValue(plan, "eligibility");
  const inputs = recordArray(plan, "recommendedInputs");
  const guidance = recordArray(plan, "fertilizerGroupGuidance");
  const notes = stringArray(plan, "notes");
  const activityType = stringValue(plan, "activityType");
  const list = (items: readonly string[]) =>
    items.length > 0
      ? `<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`
      : "";

  return documentCard(
    plan,
    ACTIVITY_LABELS[activityType] ?? activityType,
    `<p class="lead">${renderInline(stringValue(plan, "goal"))}</p>
<div class="review-block"><h4>Quy tắc đề xuất</h4><p><code>kind: ${escapeHtml(eligibility ? stringValue(eligibility, "kind") : "—")}</code> <code>suggestAfterDays: ${eligibility ? (numberValue(eligibility, "suggestAfterDays") ?? "—") : "—"}</code> <code>onMissingHistory: ${escapeHtml(stringValue(plan, "onMissingHistory"))}</code> <code>priority: ${numberValue(plan, "priority") ?? "—"}</code></p></div>
${renderFrequency(plan)}
${
  inputs.length > 0
    ? `<div class="review-block"><h4>Vai trò phân bón được đề xuất</h4><ul>${inputs
        .map((input) => {
          const catalogId = stringValue(input, "catalogId");
          const role = fertilizerRoles.get(catalogId);
          const priority = stringValue(input, "priority");
          return `<li><strong>${priority === "primary" ? "Ưu tiên" : "Có thể thay thế"}: ${escapeHtml(role ? stringValue(role, "name") : "Vai trò không tồn tại")}</strong> <code>${escapeHtml(catalogId)}</code>${role ? ` <span>${escapeHtml(stringValue(role, "group"))}</span>` : ""}</li>`;
        })
        .join("")}</ul></div>`
    : ""
}
${guidance.length > 0 ? `<div class="review-block"><h4>Hướng dẫn theo nhóm phân bón</h4>${guidance.map((item) => `<p><strong>${escapeHtml(stringValue(item, "group"))}:</strong> ${renderInline(stringValue(item, "description"))}</p>`).join("")}</div>` : ""}
${notes.length > 0 ? `<div class="review-block"><h4>Ghi chú</h4>${list(notes)}</div>` : ""}
<div class="markdown">${renderMarkdown(stringValue(plan, "bodyMarkdown"))}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(plan, "references"))}</div>`,
    `data-activity="${escapeHtml(activityType)}"`,
  );
}

function renderGuide(guide: JsonRecord): string {
  return documentCard(
    guide,
    "Hướng dẫn kỹ thuật",
    `<p class="lead">${renderInline(stringValue(guide, "goal"))}</p>
<div class="markdown">${renderMarkdown(stringValue(guide, "bodyMarkdown"))}</div>
<p class="scope"><strong>Áp dụng cho:</strong> ${stringArray(guide, "stageIds").map(escapeHtml).join(", ")}</p>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(guide, "references"))}</div>`,
  );
}

function renderWarningSignLinks(signs: readonly JsonRecord[]): string {
  if (signs.length === 0) return "";
  return `<aside class="related"><h3>Cần chú ý</h3><ul>${signs
    .map(
      (sign) =>
        `<li><strong>${escapeHtml(stringValue(sign, "title"))}</strong><span>${renderInline(stringValue(sign, "summary"))}</span><a href="#${escapeHtml(stringValue(sign, "id"))}">Xem cách nhận biết →</a></li>`,
    )
    .join("")}</ul></aside>`;
}

function renderStageChapter(
  stage: JsonRecord,
  chapterNumber: number,
  plans: readonly JsonRecord[],
  guides: readonly JsonRecord[],
  warningSigns: readonly JsonRecord[],
  fertilizerRoles: ReadonlyMap<string, JsonRecord>,
): string {
  const criteria = (label: string, key: string) =>
    `<div><h3>${label}</h3><ul>${stringArray(stage, key)
      .map((item) => `<li>${renderInline(item)}</li>`)
      .join("")}</ul></div>`;
  const activities = [
    ...new Set(plans.map((plan) => stringValue(plan, "activityType"))),
  ].filter(Boolean);
  const searchText = [
    documentSearchText(stage),
    ...plans.map(documentSearchText),
    ...guides.map(documentSearchText),
    ...warningSigns.map(documentSearchText),
  ].join(" ");

  return `<article class="chapter searchable" id="${escapeHtml(stringValue(stage, "id"))}" data-search="${escapeHtml(searchText)}" data-activities="${escapeHtml(activities.join(" "))}">
<header class="chapter-heading"><div><p class="chapter-number">Chương ${chapterNumber}</p><p class="eyebrow">${escapeHtml(stringValue(stage, "lifecycleId"))} · thứ tự ${numberValue(stage, "sequence") ?? "—"}</p><h2>${escapeHtml(stringValue(stage, "title"))}</h2></div><span class="status">${escapeHtml(stringValue(stage, "status"))}</span></header>
<div class="stage-intro">${renderStageImage(stage)}<div class="stage-summary"><p class="lead">${renderInline(stringValue(stage, "primaryObjective"))}</p><p class="duration">Thời lượng ước tính: <strong>${escapeHtml(stringValue(stage, "estimatedDuration"))}</strong></p><div class="criteria">${criteria("Dấu hiệu bắt đầu", "entryCriteria")}${criteria("Dấu hiệu kết thúc", "exitCriteria")}</div></div></div>
<div class="markdown prose">${renderMarkdown(stringValue(stage, "bodyMarkdown"))}</div>
<div class="sources"><strong>Nguồn chương:</strong>${renderReferences(stringArray(stage, "references"))}</div>
${plans.length > 0 ? `<section class="chapter-section"><div class="minor-heading"><p class="eyebrow">Thực hành theo dõi</p><h3>Kế hoạch chăm sóc</h3></div><div class="card-grid">${plans.map((plan) => renderCarePlan(plan, fertilizerRoles)).join("")}</div></section>` : ""}
${guides.length > 0 ? `<section class="chapter-section"><div class="minor-heading"><p class="eyebrow">Đọc thêm</p><h3>Hướng dẫn kỹ thuật</h3></div><div class="card-grid">${guides.map(renderGuide).join("")}</div></section>` : ""}
${renderWarningSignLinks(warningSigns)}${renderMeta(stage)}</article>`;
}

function renderWarningSign(sign: JsonRecord): string {
  return `<article class="content-card searchable" id="${escapeHtml(stringValue(sign, "id"))}" data-search="${escapeHtml(documentSearchText(sign))}" data-activities="">
<div class="card-heading"><div><p class="eyebrow">Dấu hiệu thường gặp</p><h3>${escapeHtml(stringValue(sign, "title"))}</h3></div><span class="status">${escapeHtml(stringValue(sign, "status"))}</span></div>
${renderWarningSignImage(sign)}
<p class="lead">${renderInline(stringValue(sign, "summary"))}</p>
<p class="scope"><strong>Giai đoạn cần chú ý:</strong> ${stringArray(sign, "stageIds").map(escapeHtml).join(", ")}</p>
<div class="markdown">${renderMarkdown(stringValue(sign, "bodyMarkdown"))}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(sign, "references"))}</div>${renderMeta(sign)}</article>`;
}

function renderFertilizerGuide(guide: JsonRecord): string {
  const sections = recordArray(guide, "sections");
  return `<article class="catalogue searchable" data-search="${escapeHtml(documentSearchText(guide))}" data-activities="fertilizing">
<div class="card-heading"><div><p class="eyebrow">Danh mục biên tập</p><h3>${escapeHtml(stringValue(guide, "title"))}</h3></div><span class="status">${escapeHtml(stringValue(guide, "status"))}</span></div>
<div class="markdown prose">${renderMarkdown(stringValue(guide, "bodyMarkdown"))}</div>
<div class="catalogue-sections">${sections
    .map(
      (section) =>
        `<section><h4>${escapeHtml(stringValue(section, "title"))}</h4><dl>${recordArray(
          section,
          "items",
        )
          .map(
            (item) =>
              `<div><dt>${escapeHtml(stringValue(item, "name"))}<code>${escapeHtml(stringValue(item, "group"))}</code></dt><dd>${renderInline(stringValue(item, "description"))}</dd></div>`,
          )
          .join("")}</dl></section>`,
    )
    .join("")}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(guide, "references"))}</div>${renderMeta(guide)}</article>`;
}

function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function renderReference(reference: JsonRecord): string {
  const url = safeHttpUrl(stringValue(reference, "url"));
  return `<article class="reference searchable" id="${escapeHtml(stringValue(reference, "id"))}" data-search="${escapeHtml(documentSearchText(reference))}" data-activities="">
<p class="eyebrow">${escapeHtml(stringValue(reference, "publisher"))}</p><h3>${escapeHtml(stringValue(reference, "title"))}</h3>
<p><code>${escapeHtml(stringValue(reference, "id"))}</code></p>
<p class="scope">${escapeHtml(stringValue(reference, "sourceType"))} · truy cập ${escapeHtml(stringValue(reference, "accessed"))} · ${escapeHtml(stringValue(reference, "status"))}</p>
<div class="markdown">${renderMarkdown(stringValue(reference, "bodyMarkdown"))}</div>
${url ? `<a class="source-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Mở nguồn gốc ↗</a>` : '<span class="missing">URL nguồn không hợp lệ</span>'}
</article>`;
}

function section(
  id: string,
  label: string,
  title: string,
  count: string,
  content: string,
  className = "appendix",
): string {
  return `<section class="book-section ${className}" id="${id}"><header class="section-heading"><div><p class="part-label">${label}</p><h2>${title}</h2></div><span class="count-pill">${count}</span></header><div class="card-grid">${content || '<p class="empty-section">Không có nội dung trong bundle này.</p>'}</div></section>`;
}

function renderContents(
  bundle: PreviewBundle,
  stageById: ReadonlyMap<string, JsonRecord>,
): string {
  const speciesEntries = bundle.species
    .map((species) => {
      const lifecycles = recordValue(species, "lifecycles");
      const lifecycleEntries = ["development", "production"]
        .map((key) => {
          const lifecycle = lifecycles ? recordValue(lifecycles, key) : null;
          if (!lifecycle) return "";
          const stages = recordArray(lifecycle, "stages")
            .map((stageRef) => stageById.get(stringValue(stageRef, "id")))
            .filter((stage): stage is JsonRecord => stage !== undefined);
          return `<li><span>${escapeHtml(stringValue(lifecycle, "title"))}</span><ol>${stages.map((stage) => `<li><a href="#${escapeHtml(stringValue(stage, "id"))}">${escapeHtml(stringValue(stage, "title"))}</a></li>`).join("")}</ol></li>`;
        })
        .join("");
      return `<li><a href="#species-${escapeHtml(stringValue(species, "id"))}"><strong>${escapeHtml(stringValue(species, "title"))}</strong></a><ul>${lifecycleEntries}</ul></li>`;
    })
    .join("");

  return `<section class="contents" id="contents"><p class="part-label">Mục lục</p><h2>Đọc như một cuốn cẩm nang</h2><div class="contents-grid"><ol class="toc-main">${speciesEntries}</ol><ol class="toc-appendices"><li><a href="#warning-signs">Phụ lục A · Dấu hiệu thường gặp</a></li><li><a href="#fertilizer-catalogue">Phụ lục B · Vai trò phân bón</a></li><li><a href="#references">Thư mục nguồn tham khảo</a></li></ol></div></section>`;
}

export function renderKnowledgePreview(input: unknown): string {
  const bundle = parseBundle(input);
  const stageById = new Map(
    bundle.stagePlaybooks.map((stage) => [stringValue(stage, "id"), stage]),
  );
  const fertilizerRoles = new Map<string, JsonRecord>();
  for (const guide of bundle.fertilizerGuides.filter(
    (candidate) => stringValue(candidate, "id") === "fertilizer-guide.focused",
  )) {
    for (const guideSection of recordArray(guide, "sections")) {
      for (const role of recordArray(guideSection, "items")) {
        fertilizerRoles.set(stringValue(role, "id"), role);
      }
    }
  }

  const renderedStages = new Set<string>();
  let chapterNumber = 0;
  const bookBody = bundle.species
    .map((species) => {
      const lifecycles = recordValue(species, "lifecycles");
      const lifecycleParts = ["development", "production"]
        .map((key) => {
          const lifecycle = lifecycles ? recordValue(lifecycles, key) : null;
          if (!lifecycle) return "";
          const chapters = recordArray(lifecycle, "stages")
            .map((stageRef) => stageById.get(stringValue(stageRef, "id")))
            .filter((stage): stage is JsonRecord => stage !== undefined)
            .map((stage) => {
              const stageId = stringValue(stage, "id");
              renderedStages.add(stageId);
              chapterNumber += 1;
              return renderStageChapter(
                stage,
                chapterNumber,
                bundle.carePlans.filter((plan) =>
                  stringArray(plan, "stageIds").includes(stageId),
                ),
                bundle.guides.filter((guide) =>
                  stringArray(guide, "stageIds").includes(stageId),
                ),
                bundle.warningSigns.filter((sign) =>
                  stringArray(sign, "stageIds").includes(stageId),
                ),
                fertilizerRoles,
              );
            })
            .join("");
          return `<section class="lifecycle-part"><header class="lifecycle-divider"><p class="part-label">${key === "development" ? "Phần I" : "Phần II"}</p><h2>${escapeHtml(stringValue(lifecycle, "title"))}</h2><p>${lifecycle.repeatable === true ? "Chu kỳ lặp lại" : "Hành trình một lần"} · ${recordArray(lifecycle, "stages").length} giai đoạn</p></header>${chapters}</section>`;
        })
        .join("");
      return `${renderSpecies(species)}${lifecycleParts}`;
    })
    .join("");

  const unplacedStages = bundle.stagePlaybooks
    .filter((stage) => !renderedStages.has(stringValue(stage, "id")))
    .map((stage) => {
      chapterNumber += 1;
      return renderStageChapter(
        stage,
        chapterNumber,
        bundle.carePlans.filter((plan) =>
          stringArray(plan, "stageIds").includes(stringValue(stage, "id")),
        ),
        bundle.guides.filter((guide) =>
          stringArray(guide, "stageIds").includes(stringValue(stage, "id")),
        ),
        bundle.warningSigns.filter((sign) =>
          stringArray(sign, "stageIds").includes(stringValue(stage, "id")),
        ),
        fertilizerRoles,
      );
    })
    .join("");
  const modeLabel =
    bundle.mode === "preview" ? "Bản xem trước" : "Bản sản xuất";

  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Cẩm nang duyệt bundle kiến thức Sổ Tay Trồng Cây"><title>Cẩm nang duyệt kiến thức</title>
<style>
:root{--canvas:#e9e6dd;--paper:#fffdf8;--ink:#25281f;--muted:#6e7167;--line:#ddd8ca;--brand:#315d3a;--brand-dark:#203f28;--brand-soft:#e8f0e5;--accent:#8b5c34;--warn:#7b4d0b;--warn-soft:#fff4d9;--code:#f1efe7;--shadow:0 24px 70px rgba(42,45,34,.13)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--canvas);color:var(--ink);font:17px/1.72 Georgia,"Times New Roman",serif}a{color:var(--brand)}code,.eyebrow,.part-label,.status,.count-pill,.topbar,.toolbar,.scope,.duration,.technical,.chapter-number,figcaption,.footer,table{font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}code{padding:.15em .38em;border-radius:5px;background:var(--code);font-size:.78em;overflow-wrap:anywhere}.topbar{position:sticky;top:0;z-index:10;border-bottom:1px solid rgba(49,93,58,.18);background:rgba(255,253,248,.94);backdrop-filter:blur(14px)}.topbar-inner{max-width:1180px;margin:auto;padding:11px 24px;display:flex;align-items:center;gap:24px}.brand{font-weight:800;color:var(--ink);text-decoration:none}.topbar nav{display:flex;gap:18px;overflow:auto;margin-left:auto}.topbar nav a{color:var(--muted);font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap}.book{max-width:1180px;margin:28px auto 70px;background:var(--paper);box-shadow:var(--shadow)}.cover{min-height:680px;padding:76px clamp(28px,8vw,100px);display:flex;flex-direction:column;justify-content:space-between;color:#fff;background:linear-gradient(145deg,rgba(22,54,31,.97),rgba(54,94,61,.92)),radial-gradient(circle at 80% 18%,#9e7b54,transparent 38%)}.cover-copy{max-width:780px}.cover h1{margin:16px 0 18px;font-size:clamp(48px,8vw,92px);line-height:.98;letter-spacing:-.045em}.cover .subtitle{max-width:690px;color:rgba(255,255,255,.8);font-size:21px}.cover .eyebrow{color:#d9ead6}.edition{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.2)}.edition span{padding:14px;background:rgba(23,48,29,.76);font:600 13px/1.4 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.review-banner{margin:0;padding:20px clamp(24px,7vw,82px);border-bottom:1px solid #ead3a3;background:var(--warn-soft);color:#65430f}.toolbar{position:sticky;top:47px;z-index:8;display:flex;flex-wrap:wrap;gap:9px;padding:15px clamp(24px,7vw,82px);border-bottom:1px solid var(--line);background:rgba(255,253,248,.96)}.search{min-width:min(100%,340px);flex:1;padding:11px 13px;border:1px solid var(--line);border-radius:8px;background:#fff;font:inherit}.filter{padding:9px 12px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--muted);font:700 13px/1 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}.filter.active{border-color:var(--brand);background:var(--brand);color:#fff}.contents,.species-opening,.book-section{padding:72px clamp(24px,7vw,82px);scroll-margin-top:116px}.contents{border-bottom:1px solid var(--line)}.contents h2,.species-opening h2,.section-heading h2,.lifecycle-divider h2{margin:6px 0 24px;font-size:clamp(34px,5vw,54px);line-height:1.08;letter-spacing:-.03em}.contents-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:50px}.toc-main,.toc-appendices{margin:0;padding-left:22px}.toc-main>li{margin-bottom:20px}.toc-main ul{padding-left:20px;list-style:none}.toc-main ul>li{margin:14px 0}.toc-main ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 18px;margin-top:7px;padding-left:20px}.toc-main a,.toc-appendices a{text-decoration:none}.toc-appendices li{margin:12px 0}.part-label{margin:0;color:var(--accent);font-size:12px;font-weight:850;letter-spacing:.15em;text-transform:uppercase}.eyebrow{margin:0 0 4px;color:var(--brand);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.species-opening{border-bottom:1px solid var(--line)}.species-opening>h2{font-size:64px}.prose{max-width:760px}.lifecycle-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:34px}.lifecycle{padding:22px;border:1px solid var(--line);background:#fff}.subheading{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.subheading h3{margin:0;font-size:22px}.subheading span{color:var(--muted);font:13px/1.4 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.journey{padding-left:22px}.journey li{margin:12px 0}.journey a{display:flex;justify-content:space-between;gap:12px;text-decoration:none}.journey a span,.journey small{display:block;color:var(--muted);font:12px/1.45 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.lifecycle-divider{padding:90px clamp(24px,7vw,82px) 46px;color:#fff;background:var(--brand-dark)}.lifecycle-divider .part-label{color:#c8dfc8}.lifecycle-divider p:last-child{color:#c8d5c9}.chapter{padding:78px clamp(24px,7vw,82px);border-bottom:1px solid var(--line);scroll-margin-top:116px}.chapter-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:34px}.chapter-number{margin:0;color:var(--accent);font-size:13px;font-weight:800;text-transform:uppercase}.chapter-heading h2{margin:2px 0 0;font-size:clamp(40px,6vw,68px);line-height:1.03;letter-spacing:-.04em}.status,.count-pill{display:inline-flex;padding:5px 9px;border-radius:999px;background:var(--brand-soft);color:var(--brand);font-size:11px;font-weight:800;white-space:nowrap}.stage-intro{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(300px,.92fr);gap:36px;align-items:start}.stage-figure,.sign-figure{margin:0}.stage-figure img,.sign-figure img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:var(--brand-soft)}.stage-figure figcaption,.sign-figure figcaption{padding:8px 2px;color:var(--muted);font-size:12px}.lead{font-size:20px;line-height:1.55;color:#3a4438}.duration,.scope{color:var(--muted);font-size:14px}.criteria{display:grid;gap:14px}.criteria>div{padding-top:12px;border-top:1px solid var(--line)}.criteria h3{margin:0 0 5px;color:var(--brand);font:800 12px/1.4 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-transform:uppercase;letter-spacing:.06em}.criteria ul{margin:0;padding-left:20px}.markdown h2,.markdown h3,.markdown h4,.markdown h5{margin:28px 0 9px;font-size:22px;line-height:1.3}.markdown p{margin:10px 0}.markdown li{margin:6px 0}.sources{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:22px;font-size:14px}.ref-chip{padding:3px 7px;border-radius:5px;background:var(--code);font:12px/1.5 ui-monospace,SFMono-Regular,monospace;text-decoration:none}.chapter-section{margin-top:58px}.minor-heading{margin-bottom:18px}.minor-heading h3{margin:0;font-size:31px}.card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.content-card,.catalogue,.reference{min-width:0;padding:24px;border:1px solid var(--line);background:#fff;scroll-margin-top:116px}.card-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.card-heading h3,.reference h3{margin:0;font-size:22px;line-height:1.3}.content-card h4{margin:22px 0 8px;color:var(--brand);font:800 12px/1.4 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.06em;text-transform:uppercase}.review-block{margin-top:18px;padding:2px 14px 12px;border-left:3px solid var(--line);background:#faf9f4}.review-block p{margin:8px 0}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:9px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.technical{margin-top:20px;padding-top:12px;border-top:1px solid var(--line);font-size:13px}.technical summary{cursor:pointer;color:var(--muted);font-weight:700}.technical dl>div{display:grid;grid-template-columns:100px 1fr;gap:10px}.technical dt{color:var(--muted)}.technical dd{margin:0}.related{margin-top:50px;padding:22px 26px;border-left:4px solid var(--accent);background:#f7f2e9}.related h3{margin:0;font-size:20px}.related ul{columns:2;gap:24px;padding:0;list-style:none}.related li{break-inside:avoid;display:grid;gap:3px;margin:16px 0}.related li span{color:var(--muted);font-size:15px;line-height:1.5}.related li a{font:700 13px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none}.book-section{border-bottom:1px solid var(--line)}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:28px}.catalogue{grid-column:1/-1}.catalogue-sections{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:26px}.catalogue-sections section{padding:20px;border:1px solid var(--line);background:#faf9f4}.catalogue-sections h4{margin:0 0 14px;color:var(--brand);font-size:18px}.catalogue-sections dl{margin:0}.catalogue-sections dl>div{padding:12px 0;border-top:1px solid var(--line)}.catalogue-sections dt{font-weight:700}.catalogue-sections dt code{margin-left:7px}.catalogue-sections dd{margin:4px 0 0;color:#51564d}.bibliography .reference{border-width:0 0 1px;padding:22px 0}.source-link{display:inline-block;margin-top:10px;font-weight:700}.missing{color:var(--warn)}.empty-section{grid-column:1/-1;color:var(--muted)}.searchable.hidden{display:none}.no-results{display:none;margin:0;padding:40px;text-align:center;color:var(--muted)}.no-results.show{display:block}.footer{padding:28px;text-align:center;color:var(--muted);font-size:13px}.back-to-top{position:fixed;right:20px;bottom:20px;width:42px;height:42px;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:var(--paper);box-shadow:0 8px 24px rgba(42,45,34,.14);font:800 17px/1 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none}.searchable{transition:opacity .18s ease}
@media(max-width:820px){body{font-size:16px}.topbar nav{display:none}.book{margin:0}.cover{min-height:620px;padding:54px 24px}.edition{grid-template-columns:repeat(2,minmax(0,1fr))}.toolbar{top:46px;padding:12px 14px}.contents,.species-opening,.book-section,.chapter{padding:52px 20px}.contents-grid,.lifecycle-grid,.stage-intro,.card-grid,.catalogue-sections{grid-template-columns:1fr}.toc-main ol{grid-template-columns:1fr}.species-opening>h2{font-size:48px}.lifecycle-divider{padding:64px 20px 36px}.chapter-heading h2{font-size:44px}.related ul{columns:1}.back-to-top{right:12px;bottom:12px}}
@media print{body{background:#fff}.topbar,.toolbar,.back-to-top{display:none}.book{max-width:none;margin:0;box-shadow:none}.cover,.lifecycle-divider{print-color-adjust:exact}.cover,.contents,.species-opening,.lifecycle-divider,.chapter,.book-section{break-before:page}.content-card,.stage-figure,.related{break-inside:avoid}.chapter{border:0}.searchable.hidden{display:block}}
</style></head><body>
<header class="topbar"><div class="topbar-inner"><a class="brand" href="#top">Sổ Tay Trồng Cây · Cẩm nang</a><nav><a href="#contents">Mục lục</a><a href="#chapters">Các chương</a><a href="#warning-signs">Dấu hiệu</a><a href="#fertilizer-catalogue">Phân bón</a><a href="#references">Nguồn</a></nav></div></header>
<main class="book" id="top"><section class="cover"><div class="cover-copy"><p class="eyebrow">${modeLabel}</p><h1>Cẩm nang<br>trồng cây</h1><p class="subtitle">Bản đọc có cấu trúc từ Knowledge Base: đi theo vòng đời cây, từng giai đoạn, kế hoạch chăm sóc và nguồn tham khảo.</p></div><div class="edition"><span>Schema ${escapeHtml(bundle.schemaVersion)}</span><span>Nội dung ${escapeHtml(bundle.contentVersion)}</span><span>${plural(bundle.species.length, "loài cây")}</span><span>${plural(bundle.stagePlaybooks.length, "giai đoạn")}</span><span>${plural(bundle.carePlans.length, "kế hoạch chăm sóc")}</span></div></section>
<aside class="review-banner"><strong>Chỉ dành cho biên tập và duyệt nội dung.</strong> Tài liệu trạng thái <code>review</code> chưa được phê duyệt để phát hành trong ứng dụng. Hình ảnh là minh họa tham chiếu của Stage Playbook, không phải ảnh cây của người dùng hay bằng chứng xác nhận giai đoạn.</aside>
<div class="toolbar"><input class="search" id="search" type="search" placeholder="Tìm trong cẩm nang…" aria-label="Tìm nội dung trong cẩm nang"><button class="filter active" data-filter="all">Tất cả</button><button class="filter" data-filter="watering">Tưới nước</button><button class="filter" data-filter="fertilizing">Bón phân</button><button class="filter" data-filter="spraying">Phun/xịt</button></div>
${renderContents(bundle, stageById)}
<div id="chapters">${bookBody}${unplacedStages}</div>
${section("warning-signs", "Phụ lục A", "Dấu hiệu thường gặp", plural(bundle.warningSigns.length, "dấu hiệu"), bundle.warningSigns.map(renderWarningSign).join(""))}
${section("fertilizer-catalogue", "Phụ lục B", "Vai trò phân bón", plural(bundle.fertilizerGuides.length, "danh mục"), bundle.fertilizerGuides.map(renderFertilizerGuide).join(""))}
${section("references", "Thư mục", "Nguồn tham khảo", plural(bundle.references.length, "nguồn"), bundle.references.map(renderReference).join(""), "bibliography")}
<p class="no-results" id="no-results">Không tìm thấy nội dung phù hợp.</p></main>
<a class="back-to-top" href="#top" aria-label="Trở về đầu trang">↑</a>
<footer class="footer">Bundle ${escapeHtml(bundle.mode)} · schema ${escapeHtml(bundle.schemaVersion)} · nội dung ${escapeHtml(bundle.contentVersion)}</footer>
<script>
const search=document.getElementById("search");const entries=[...document.querySelectorAll(".searchable")];const empty=document.getElementById("no-results");let filter="all";function normalize(value){return(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function apply(){const query=normalize(search.value);let visible=0;for(const entry of entries){const activities=(entry.dataset.activities||"").split(" ").filter(Boolean);const matchesQuery=!query||normalize(entry.dataset.search+" "+entry.textContent).includes(query);const matchesFilter=filter==="all"||activities.includes(filter);const show=matchesQuery&&matchesFilter;entry.classList.toggle("hidden",!show);if(show)visible++}empty.classList.toggle("show",visible===0)}search.addEventListener("input",apply);for(const button of document.querySelectorAll(".filter")){button.addEventListener("click",()=>{for(const item of document.querySelectorAll(".filter"))item.classList.remove("active");button.classList.add("active");filter=button.dataset.filter;apply()})}
</script></body></html>\n`;
}
