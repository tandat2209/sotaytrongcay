---
id: grape.recommendation.trunk-development.fertilizing
type: care_plan
title: Bón phân giai đoạn phát triển thân
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.trunk-development
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 14
on_missing_history: suggest
goal: >-
  Thúc đẩy sinh trưởng mạnh để một chồi chính vươn nhanh lên giàn. Đây là giai
  đoạn nhu cầu đạm (N) bắt đầu tăng.
recommended_inputs:
  - group: Phân giàu đạm (high-N)
    suggestions:
      - id: fertilizer.urea
        name: Urê
        fertilizer_group: single
      - id: fertilizer.fish-emulsion
        name: Phân cá
        fertilizer_group: organic
  - group: Phân NPK cân đối
    suggestions:
      - id: fertilizer.npk-16-16-16
        name: NPK 16-16-16
        fertilizer_group: npk
      - id: fertilizer.compost
        name: Phân compost
        fertilizer_group: organic
frequency:
  ground:
    display: Mỗi 2–4 tuần trong giai đoạn sinh trưởng mạnh
    interval_days: 21
  container:
    display: Mỗi 1–2 tuần ở nửa liều so với trồng đất
    interval_days: 20
notes:
  - >-
    Thừa đạm tạo ra thân mềm, dễ bệnh và chậm hóa gỗ. Nếu cây đã tự mọc khỏe,
    giảm hoặc ngừng bón.
  - Giữ phân cách gốc thân ít nhất 5 cm để tránh thối gốc.
  - "Lá xanh đậm bất thường kèm lóng dài = dư đạm, cần giảm liều."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
priority: 50
---
