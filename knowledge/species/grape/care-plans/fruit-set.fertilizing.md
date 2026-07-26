---
id: grape.recommendation.fruit-set.fertilizing
type: care_plan
title: Bón phân giai đoạn đậu quả
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.fruit-set
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 7
on_missing_history: withhold
goal: >-
  Tiếp tục bón phân ngay sau khi đậu trái được xác nhận. Các trái nho nhỏ đang
  phân chia tế bào nhanh chóng và cây cần đầy đủ dinh dưỡng.
recommended_inputs:
  - catalog_id: fertilizer-role.balanced-nutrition
    priority: primary
  - catalog_id: fertilizer-role.organic-foundation
    priority: alternative
frequency:
  ground:
    display: Mỗi 1–2 tuần — đây là giai đoạn bón nặng
    interval_days: 7
  container:
    display: >-
      Hàng tuần ở liều vừa phải — nho trồng chậu mất dinh dưỡng rất nhanh do
      tưới thường xuyên
    interval_days: 7
notes:
  - >-
    Bón trễ sau đậu quả là nguyên nhân phổ biến gây rụng trái non. Tiếp tục bón
    phân ngay khi thấy trái hình thành.
  - >-
    Nếu đã tỉa bớt chùm, các trái còn lại được chia phần dinh dưỡng lớn hơn — có
    thể không cần tăng liều.
version: 2.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
  - ref.ucdavis.vineyard-nutrition
  - ref.umn.high-tunnel-nutrient-management
priority: 50
---
