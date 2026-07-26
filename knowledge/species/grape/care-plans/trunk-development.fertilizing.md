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
on_missing_history: withhold
goal: >-
  Thúc đẩy sinh trưởng mạnh để một chồi chính vươn nhanh lên giàn. Đây là giai
  đoạn nhu cầu đạm (N) bắt đầu tăng.
recommended_inputs:
  - catalog_id: fertilizer-role.high-nitrogen
    priority: primary
  - catalog_id: fertilizer-role.balanced-nutrition
    priority: alternative
  - catalog_id: fertilizer-role.organic-foundation
    priority: alternative
frequency:
  ground:
    display: Mỗi 2–4 tuần trong giai đoạn sinh trưởng mạnh
    interval_days: 14
  container:
    display: Mỗi 1–2 tuần ở nửa liều so với trồng đất
    interval_days: 7
notes:
  - >-
    Thừa đạm tạo ra thân mềm, dễ bệnh và chậm hóa gỗ. Nếu cây đã tự mọc khỏe,
    giảm hoặc ngừng bón.
  - Giữ phân cách gốc thân ít nhất 5 cm để tránh thối gốc.
  - "Lá xanh đậm bất thường kèm lóng dài = dư đạm, cần giảm liều."
fertilizer_group_guidance:
  - group: nitrogen-rich
    description: >-
      Hỗ trợ sinh trưởng thân và lá ở giai đoạn nuôi thân. Nếu cây đã mọc khỏe,
      lá xanh đậm hoặc lóng dài, cần giảm thay vì tiếp tục tăng đạm.
  - group: npk-balanced
    description: >-
      Cung cấp phối hợp đạm, lân và kali cho mục tiêu nuôi thân và lá. Thành phần
      thực tế phụ thuộc công thức trên nhãn và nguồn dinh dưỡng cây đã nhận.
version: 2.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.umn.fertilizer-urea
  - ref.umn.high-tunnel-nutrient-management
priority: 50
---
