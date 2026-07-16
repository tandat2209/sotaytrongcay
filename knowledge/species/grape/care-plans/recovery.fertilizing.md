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
  - group: Phân NPK cân đối
    suggestions:
      - id: fertilizer.npk-16-16-16
        name: NPK 16-16-16
        fertilizer_group: npk
  - group: Phân hữu cơ bón nặng
    suggestions:
      - id: fertilizer.composted-cow-manure
        name: Phân bò ủ hoai
        fertilizer_group: organic
      - id: fertilizer.vermicompost
        name: Phân trùn quế
        fertilizer_group: organic
      - id: fertilizer.rice-husk-compost
        name: Phân vỏ trấu compost
        fertilizer_group: organic
  - group: Bón lót lân và kali
    suggestions:
      - id: fertilizer.bone-meal
        name: Bột xương
        fertilizer_group: organic
      - id: fertilizer.rock-phosphate
        name: Lân tự nhiên
        fertilizer_group: single
      - id: fertilizer.potassium-sulfate
        name: Kali sunfat
        fertilizer_group: single
  - group: Vôi điều chỉnh pH (nếu cần)
    suggestions:
      - id: fertilizer.dolomitic-lime
        name: Vôi dolomite
        fertilizer_group: supplement
frequency:
  ground:
    display: >-
      1–2 lần bón nặng (lần đầu trong vòng một tuần sau thu hoạch, lần hai sau
      2–4 tuần)
    interval_days: 21
  container:
    display: >-
      1–2 lần bón nặng. Cân nhắc thay 20–30% giá thể phía trên bằng phân compost
      mới
    interval_days: 20
notes:
  - >-
    Không bỏ qua bón phân sau thu hoạch. Cây kiệt sức bước vào vụ mới sẽ cho
    năng suất kém.
  - >-
    Đây là thời điểm tốt nhất để cải tạo đất bằng phân hữu cơ — phân có nhiều
    tuần để phân hủy và hòa nhập trước vụ sau.
  - >-
    Sau khi bón phân phục hồi xong, giảm dần tưới nước để khuyến khích lá rụng
    và cây nghỉ ngắn trước khi cắt cành vụ mới.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
  - ref.ucdavis.vineyard-nutrition
priority: 50
---
