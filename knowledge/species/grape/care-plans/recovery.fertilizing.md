---
id: grape.recommendation.recovery.fertilizing
type: care_plan
title: Bón phân giai đoạn sau thu hoạch
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.recovery
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 14
on_missing_history: suggest
goal: >-
  Bổ sung lại nguồn dự trữ dinh dưỡng và carbohydrate cho cây. Sau khi mang
  trái, cây kiệt sức. Dinh dưỡng bón lúc này được tích lũy vào phần gỗ và bộ rễ,
  cung cấp năng lượng cho vụ sau.
recommended_inputs:
  - catalog_id: fertilizer-role.organic-foundation
    priority: primary
  - catalog_id: fertilizer-role.balanced-nutrition
    priority: alternative
  - catalog_id: fertilizer-role.high-phosphorus
    priority: alternative
  - catalog_id: fertilizer-role.potassium-only
    priority: alternative
notes:
  - >-
    Trồng đất: bón 1–2 lần; lần đầu trong vòng một tuần sau thu hoạch và lần hai
    sau 2–4 tuần.
  - >-
    Trồng chậu: bón 1–2 lần và cân nhắc thay 20–30% giá thể phía trên bằng vật
    liệu hữu cơ đã hoai mục.
  - >-
    Không bỏ qua bón phân sau thu hoạch. Cây kiệt sức bước vào vụ mới sẽ cho
    năng suất kém.
  - >-
    Đây là thời điểm tốt nhất để cải tạo đất bằng phân hữu cơ — phân có nhiều
    tuần để phân hủy và hòa nhập trước vụ sau.
  - >-
    Sau khi bón phân phục hồi xong, giảm dần tưới nước để khuyến khích lá rụng
    và cây nghỉ ngắn trước khi cắt cành vụ mới.
fertilizer_group_guidance:
  - group: organic
    description: >-
      Bổ sung vật chất hữu cơ và hỗ trợ cải thiện đất trong thời gian phục hồi;
      ưu tiên nguồn đã hoai mục và tránh để vật liệu chưa phân hủy sát gốc.
  - group: phosphorus-rich
    description: >-
      Cung cấp lân, một dưỡng chất liên quan đến chuyển hóa năng lượng và phát
      triển rễ. Chỉ cân nhắc theo điều kiện đất và cây, không xem là xử lý rễ bắt
      buộc sau thu hoạch.
  - group: npk-balanced
    description: >-
      Cung cấp phối hợp đạm, lân và kali để hỗ trợ mục tiêu phục hồi nguồn dự trữ.
      Việc có cần bổ sung hay không vẫn phụ thuộc sức cây và dinh dưỡng sẵn có.
version: 2.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
  - ref.ucdavis.vineyard-nutrition
  - ref.umn.high-tunnel-nutrient-management
  - ref.umn.phosphorus-fertilizers
  - ref.uc-ipm.growing-grape
priority: 50
---
