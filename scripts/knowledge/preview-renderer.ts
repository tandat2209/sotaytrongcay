type JsonRecord = Readonly<Record<string, unknown>>;

interface PreviewBundle {
  readonly schemaVersion: string;
  readonly contentVersion: string;
  readonly mode: "preview" | "production";
  readonly species: readonly JsonRecord[];
  readonly stagePlaybooks: readonly JsonRecord[];
  readonly carePlans: readonly JsonRecord[];
  readonly guides: readonly JsonRecord[];
  readonly diseases: readonly JsonRecord[];
  readonly pests: readonly JsonRecord[];
  readonly references: readonly JsonRecord[];
}

const ACTIVITY_LABELS: Readonly<Record<string, string>> = {
  watering: "💧 Tưới nước",
  fertilizing: "🌱 Bón phân",
  spraying: "🛡️ Phun/xịt",
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

  const optionalCollection = (key: "diseases" | "pests") => {
    const collection = value[key];
    if (collection === undefined) {
      return [];
    }
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
    diseases: optionalCollection("diseases"),
    pests: optionalCollection("pests"),
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

function searchableCard(
  document: JsonRecord,
  eyebrow: string,
  body: string,
  extraAttributes = "",
): string {
  const searchText = [
    stringValue(document, "id"),
    stringValue(document, "title"),
    stringValue(document, "goal"),
    stringValue(document, "primaryObjective"),
    stringValue(document, "bodyMarkdown"),
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");
  const attributes = extraAttributes ? ` ${extraAttributes}` : "";
  return `<article class="card searchable" data-search="${escapeHtml(searchText)}"${attributes}>
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
      return `<li><a href="#${escapeHtml(stringValue(stage, "id"))}"><strong>${escapeHtml(stringValue(stage, "title"))}</strong><code>${escapeHtml(stringValue(stage, "id"))}</code></a>${transitions.length > 0 ? `<span>→ ${transitions.map(escapeHtml).join(", ")}</span>` : ""}</li>`;
    })
    .join("")}</ol></section>`;
}

function renderSpecies(species: JsonRecord): string {
  const lifecycles = recordValue(species, "lifecycles");
  const body = renderMarkdown(stringValue(species, "bodyMarkdown"));
  return searchableCard(
    species,
    stringValue(species, "scientificName"),
    `<div class="markdown">${body}</div>
<div class="lifecycle-grid">${lifecycles ? renderLifecycle("development", recordValue(lifecycles, "development") ?? {}) : ""}${lifecycles ? renderLifecycle("production", recordValue(lifecycles, "production") ?? {}) : ""}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(species, "references"))}</div>`,
  );
}

function renderStage(stage: JsonRecord): string {
  const criteria = (label: string, key: string) =>
    `<div><h4>${label}</h4><ul>${stringArray(stage, key)
      .map((item) => `<li>${renderInline(item)}</li>`)
      .join("")}</ul></div>`;
  return searchableCard(
    stage,
    `${stringValue(stage, "lifecycleId")} · thứ tự ${numberValue(stage, "sequence") ?? "—"}`,
    `<p class="lead">${renderInline(stringValue(stage, "primaryObjective"))}</p>
<p class="duration">Thời lượng ước tính: <strong>${escapeHtml(stringValue(stage, "estimatedDuration"))}</strong></p>
<div class="criteria">${criteria("Dấu hiệu bắt đầu", "entryCriteria")}${criteria("Dấu hiệu kết thúc", "exitCriteria")}</div>
<div class="markdown">${renderMarkdown(stringValue(stage, "bodyMarkdown"))}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(stage, "references"))}</div>`,
    `id="${escapeHtml(stringValue(stage, "id"))}"`,
  );
}

function renderFrequency(plan: JsonRecord): string {
  const frequency = recordValue(plan, "frequency");
  if (!frequency) {
    return "";
  }
  const row = (label: string, key: string) => {
    const value = recordValue(frequency, key);
    if (!value) return "";
    return `<tr><th>${label}</th><td>${renderInline(stringValue(value, "display"))}</td><td><code>intervalDays: ${numberValue(value, "intervalDays") ?? "—"}</code></td></tr>`;
  };
  return `<div class="review-block"><h4>Tần suất hiển thị và giá trị thực thi</h4><div class="table-wrap"><table><thead><tr><th>Điều kiện</th><th>Nội dung hiển thị</th><th>Giá trị</th></tr></thead><tbody>${row("Trồng đất", "ground")}${row("Trồng chậu", "container")}</tbody></table></div></div>`;
}

function renderCarePlan(plan: JsonRecord): string {
  const eligibility = recordValue(plan, "eligibility");
  const inputs = recordArray(plan, "recommendedInputs");
  const guidance = recordArray(plan, "fertilizerGroupGuidance");
  const notes = stringArray(plan, "notes");
  const activityType = stringValue(plan, "activityType");
  const list = (items: readonly string[]) =>
    items.length > 0
      ? `<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`
      : "";

  return searchableCard(
    plan,
    ACTIVITY_LABELS[activityType] ?? activityType,
    `<p class="lead">${renderInline(stringValue(plan, "goal"))}</p>
<div class="review-block"><h4>Quy tắc đề xuất</h4><p><code>kind: ${escapeHtml(eligibility ? stringValue(eligibility, "kind") : "—")}</code> <code>suggestAfterDays: ${eligibility ? (numberValue(eligibility, "suggestAfterDays") ?? "—") : "—"}</code> <code>onMissingHistory: ${escapeHtml(stringValue(plan, "onMissingHistory"))}</code> <code>priority: ${numberValue(plan, "priority") ?? "—"}</code></p></div>
${renderFrequency(plan)}
${inputs.length > 0 ? `<div class="review-block"><h4>Đầu vào được đề xuất</h4><ul>${inputs.map((input) => `<li><strong>${escapeHtml(stringValue(input, "name"))}</strong> <code>${escapeHtml(stringValue(input, "id"))}</code> <span>${escapeHtml(stringValue(input, "group"))}</span></li>`).join("")}</ul></div>` : ""}
${guidance.length > 0 ? `<div class="review-block"><h4>Hướng dẫn theo nhóm phân bón</h4>${guidance.map((item) => `<p><strong>${escapeHtml(stringValue(item, "group"))}:</strong> ${renderInline(stringValue(item, "description"))}</p>`).join("")}</div>` : ""}
${notes.length > 0 ? `<div class="review-block"><h4>Ghi chú</h4>${list(notes)}</div>` : ""}
<div class="markdown">${renderMarkdown(stringValue(plan, "bodyMarkdown"))}</div>
<p class="scope"><strong>Giai đoạn:</strong> ${stringArray(plan, "stageIds").map(escapeHtml).join(", ")}</p>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(plan, "references"))}</div>`,
    `data-activity="${escapeHtml(activityType)}"`,
  );
}

function renderGuide(guide: JsonRecord): string {
  return searchableCard(
    guide,
    "Hướng dẫn kỹ thuật",
    `<p class="lead">${renderInline(stringValue(guide, "goal"))}</p>
<div class="markdown">${renderMarkdown(stringValue(guide, "bodyMarkdown"))}</div>
<p class="scope"><strong>Giai đoạn:</strong> ${stringArray(guide, "stageIds").map(escapeHtml).join(", ")}</p>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(guide, "references"))}</div>`,
  );
}

function renderThreat(threat: JsonRecord): string {
  return searchableCard(
    threat,
    stringValue(threat, "type") === "disease" ? "Bệnh hại" : "Sâu hại",
    `<p class="scope"><strong>Giai đoạn theo dõi:</strong> ${stringArray(threat, "stageIds").map(escapeHtml).join(", ")}</p>
<div class="markdown">${renderMarkdown(stringValue(threat, "bodyMarkdown"))}</div>
<div class="sources"><strong>Nguồn:</strong>${renderReferences(stringArray(threat, "references"))}</div>`,
  );
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
  return `<article class="card reference searchable" id="${escapeHtml(stringValue(reference, "id"))}" data-search="${escapeHtml(`${stringValue(reference, "title")} ${stringValue(reference, "publisher")}`)}">
<p class="eyebrow">${escapeHtml(stringValue(reference, "publisher"))}</p><h3>${escapeHtml(stringValue(reference, "title"))}</h3>
<p><code>${escapeHtml(stringValue(reference, "id"))}</code></p>
<p class="scope">${escapeHtml(stringValue(reference, "sourceType"))} · truy cập ${escapeHtml(stringValue(reference, "accessed"))} · ${escapeHtml(stringValue(reference, "status"))}</p>
<div class="markdown">${renderMarkdown(stringValue(reference, "bodyMarkdown"))}</div>
${url ? `<a class="source-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Mở nguồn gốc ↗</a>` : '<span class="missing">URL nguồn không hợp lệ</span>'}
</article>`;
}

function section(
  id: string,
  eyebrow: string,
  title: string,
  count: string,
  content: string,
): string {
  return `<section class="page-section" id="${id}"><div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div><span class="count-pill">${count}</span></div><div class="grid">${content || '<p class="empty-section">Không có nội dung trong bundle này.</p>'}</div></section>`;
}

export function renderKnowledgePreview(input: unknown): string {
  const bundle = parseBundle(input);
  const threatCount = bundle.diseases.length + bundle.pests.length;
  const modeLabel =
    bundle.mode === "preview" ? "Bản xem trước" : "Bản sản xuất";

  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Trang duyệt bundle kiến thức Sổ Tay Trồng Cây"><title>Cẩm nang duyệt kiến thức</title>
<style>
:root{--bg:#f4f6f1;--surface:#fff;--ink:#172019;--muted:#647067;--line:#dbe3d7;--brand:#315d3a;--brand-soft:#e6f0e5;--warn:#85560f;--warn-soft:#fff3d8;--code:#f1f3ef;--shadow:0 12px 36px rgba(28,48,31,.07)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:var(--brand)}code{padding:.15em .38em;border-radius:6px;background:var(--code);font-size:.86em;overflow-wrap:anywhere}.topbar{position:sticky;top:0;z-index:5;border-bottom:1px solid var(--line);background:rgba(244,246,241,.94);backdrop-filter:blur(14px)}.topbar-inner{max-width:1440px;margin:auto;padding:12px 24px;display:flex;align-items:center;gap:20px}.brand{font-weight:800;color:var(--ink);text-decoration:none}.topbar nav{display:flex;gap:14px;overflow:auto;margin-left:auto}.topbar nav a{color:var(--muted);font-size:14px;font-weight:650;text-decoration:none;white-space:nowrap}.page{max-width:1440px;margin:auto;padding:30px 24px 80px}.hero{padding:42px;border-radius:28px;color:#fff;background:linear-gradient(135deg,#244b2d,#47704c 72%,#6f4d75);box-shadow:var(--shadow)}.hero h1{max-width:850px;margin:4px 0 12px;font-size:clamp(38px,6vw,68px);line-height:1.04;letter-spacing:-.045em}.hero p{max-width:850px;color:rgba(255,255,255,.84)}.hero .eyebrow{color:#d9edd7}.stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.stat{padding:10px 14px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(255,255,255,.1)}.review-banner{margin:20px 0 40px;padding:18px 20px;border:1px solid #edcf91;border-radius:18px;background:var(--warn-soft);color:#6f470a}.toolbar{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 34px}.search{min-width:min(100%,360px);flex:1;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#fff;font:inherit}.filter{padding:10px 13px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--muted);font:inherit;cursor:pointer}.filter.active{border-color:var(--brand);background:var(--brand-soft);color:var(--brand)}.page-section{scroll-margin-top:70px;margin:0 0 54px}.section-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:18px}.section-heading h2{margin:0;font-size:34px;letter-spacing:-.025em}.eyebrow{margin:0 0 5px;color:var(--brand);font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.count-pill,.status{padding:5px 9px;border-radius:999px;background:var(--brand-soft);color:var(--brand);font-size:12px;font-weight:750;white-space:nowrap}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.card{min-width:0;padding:24px;border:1px solid var(--line);border-radius:22px;background:var(--surface);box-shadow:var(--shadow);scroll-margin-top:80px}.card-heading,.subheading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.card h3{margin:0;font-size:23px;line-height:1.25}.card h4{margin:20px 0 7px;color:var(--brand);font-size:13px;letter-spacing:.07em;text-transform:uppercase}.lead{font-size:17px;color:#344138}.duration,.scope{color:var(--muted)}.criteria,.lifecycle-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.lifecycle{margin-top:18px;padding:16px;border:1px solid var(--line);border-radius:16px;background:#fafbf9}.subheading h3{font-size:17px}.subheading span{color:var(--muted);font-size:13px}.journey{padding-left:22px}.journey li{margin:10px 0}.journey a{display:flex;flex-direction:column;text-decoration:none}.journey span{display:block;color:var(--muted);font-size:12px}.markdown h2,.markdown h3,.markdown h4,.markdown h5{margin:22px 0 8px;font-size:18px}.markdown p{margin:8px 0}.markdown li{margin:5px 0}.sources{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:20px}.ref-chip{padding:3px 7px;border-radius:7px;background:var(--code);font:12px/1.5 ui-monospace,SFMono-Regular,monospace;text-decoration:none}.review-block{margin-top:16px;padding:1px 14px 12px;border-left:3px solid var(--line);background:#fafbf9}.review-block p{margin:7px 0}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:9px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.technical{margin-top:18px;border-top:1px solid var(--line);padding-top:12px}.technical summary{cursor:pointer;color:var(--muted);font-weight:650}.technical dl>div{display:grid;grid-template-columns:100px 1fr;gap:10px}.technical dt{color:var(--muted)}.technical dd{margin:0}.reference h3{font-size:20px}.source-link{display:inline-block;margin-top:12px;font-weight:700}.missing{color:var(--warn)}.empty-section{grid-column:1/-1;color:var(--muted)}.searchable.hidden{display:none}.no-results{display:none;padding:30px;text-align:center;color:var(--muted)}.no-results.show{display:block}.footer{padding:28px;text-align:center;color:var(--muted);border-top:1px solid var(--line)}
@media(max-width:850px){.topbar nav{display:none}.page{padding:20px 14px 60px}.hero{padding:28px}.grid,.criteria,.lifecycle-grid{grid-template-columns:1fr}.section-heading{align-items:flex-start}.section-heading h2{font-size:29px}.card{padding:19px}}
</style></head><body>
<header class="topbar"><div class="topbar-inner"><a class="brand" href="#top">Sổ Tay Trồng Cây · Knowledge Review</a><nav><a href="#species">Loài</a><a href="#stages">Giai đoạn</a><a href="#care-plans">Chăm sóc</a><a href="#guides">Hướng dẫn</a><a href="#threats">Sâu bệnh</a><a href="#references">Nguồn</a></nav></div></header>
<main class="page" id="top"><section class="hero"><p class="eyebrow">${modeLabel}</p><h1>Cẩm nang duyệt kiến thức</h1><p>Trang này được tạo trực tiếp từ bundle JSON để kiểm tra nội dung hiển thị, metadata kiểm duyệt, quan hệ nguồn và các giá trị thực thi.</p><div class="stats"><span class="stat">Schema ${escapeHtml(bundle.schemaVersion)}</span><span class="stat">Nội dung ${escapeHtml(bundle.contentVersion)}</span><span class="stat">${plural(bundle.stagePlaybooks.length, "giai đoạn")}</span><span class="stat">${plural(bundle.carePlans.length, "kế hoạch chăm sóc")}</span><span class="stat">${plural(threatCount, "mục sâu bệnh")}</span></div></section>
<aside class="review-banner"><strong>Chỉ dành cho biên tập và duyệt nội dung.</strong> Tài liệu trạng thái <code>review</code> chưa được phê duyệt để phát hành trong ứng dụng. Các giá trị như <code>suggestAfterDays</code> và <code>intervalDays</code> là hành vi máy đọc được; hãy đối chiếu chúng với câu chữ hiển thị.</aside>
<div class="toolbar"><input class="search" id="search" type="search" placeholder="Tìm theo tiêu đề, ID hoặc nội dung…" aria-label="Tìm nội dung"><button class="filter active" data-filter="all">Tất cả</button><button class="filter" data-filter="watering">Tưới nước</button><button class="filter" data-filter="fertilizing">Bón phân</button><button class="filter" data-filter="spraying">Phun/xịt</button></div>
${section("species", "Danh mục", "Loài cây", plural(bundle.species.length, "loài"), bundle.species.map(renderSpecies).join(""))}
${section("stages", "Vòng đời", "Giai đoạn sinh trưởng", plural(bundle.stagePlaybooks.length, "giai đoạn"), bundle.stagePlaybooks.map(renderStage).join(""))}
${section("care-plans", "Theo dõi được", "Kế hoạch chăm sóc", plural(bundle.carePlans.length, "kế hoạch"), bundle.carePlans.map(renderCarePlan).join(""))}
${section("guides", "Thông tin", "Hướng dẫn kỹ thuật", plural(bundle.guides.length, "hướng dẫn"), bundle.guides.map(renderGuide).join(""))}
${section("threats", "Quan sát", "Sâu bệnh", plural(threatCount, "mục"), [...bundle.diseases, ...bundle.pests].map(renderThreat).join(""))}
${section("references", "Bằng chứng", "Nguồn tham khảo", plural(bundle.references.length, "nguồn"), bundle.references.map(renderReference).join(""))}
<p class="no-results" id="no-results">Không tìm thấy nội dung phù hợp.</p></main>
<footer class="footer">Bundle ${escapeHtml(bundle.mode)} · schema ${escapeHtml(bundle.schemaVersion)} · nội dung ${escapeHtml(bundle.contentVersion)}</footer>
<script>
const search=document.getElementById("search");const cards=[...document.querySelectorAll(".searchable")];const empty=document.getElementById("no-results");let filter="all";function normalize(value){return(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()}function apply(){const query=normalize(search.value);let visible=0;for(const card of cards){const activity=card.dataset.activity;const show=(!query||normalize(card.dataset.search+" "+card.textContent).includes(query))&&(filter==="all"||!activity||activity===filter);card.classList.toggle("hidden",!show);if(show)visible++}empty.classList.toggle("show",visible===0)}search.addEventListener("input",apply);for(const button of document.querySelectorAll(".filter")){button.addEventListener("click",()=>{for(const item of document.querySelectorAll(".filter"))item.classList.remove("active");button.classList.add("active");filter=button.dataset.filter;apply()})}
</script></body></html>\n`;
}
