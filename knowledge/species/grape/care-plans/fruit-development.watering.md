---
id: grape.recommendation.fruit-development.watering
type: care_plan
title: Tưới nước giai đoạn nuôi quả
goal: >-
  Trái đang tăng kích thước nhanh và tích lũy nước. Đây là giai đoạn tiêu thụ
  nước nhiều nhất trong chu kỳ — thiếu nước trực tiếp làm giảm kích thước trái
  và tăng nguy cơ nứt trái khi tưới trở lại.
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.fruit-development
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 2
on_missing_history: suggest
frequency:
  ground:
    display: "Mỗi 2–3 ngày trong thời tiết nóng, 3–4 ngày khi mát hơn"
    interval_days: 2
  container:
    display: Mỗi 1–2 ngày — chậu thoát nước nhanh và trái cần nhiều nước
    interval_days: 1
notes:
  - >-
    Tưới không đều là nguyên nhân chính gây nứt trái — tưới ít lâu rồi tưới
    nhiều đột ngột làm trái căng và nứt.
  - >-
    Mưa lớn sau khô hạn kéo dài = nguy cơ nứt trái cao. Nếu có thể, phủ mặt đất
    (mulch) để giảm dao động ẩm.
  - >-
    Trái teo nhỏ hoặc nhăn mà đất không khô = vấn đề rễ, không phải thiếu nước
    mặt.
  - Giai đoạn này không giảm tưới trừ khi sắp thu hoạch.
version: 1.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.fao.grape-production
priority: 50
---
