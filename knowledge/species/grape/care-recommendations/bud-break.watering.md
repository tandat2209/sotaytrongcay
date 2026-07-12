---
id: grape.recommendation.bud-break.watering
type: care_recommendation_definition
title: "Tưới nước giai đoạn bật mầm"
goal: "Chồi non đang phát triển rất nhanh và cần nước đều đặn. Nhu cầu nước tăng mạnh so với giai đoạn cắt cành — nhưng đất vẫn cần thoát nước tốt để rễ không bị úng."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.bud-break
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 3
on_missing_history: suggest
frequency:
  ground: "Mỗi 3–4 ngày hoặc khi thấy lớp đất mặt khô"
  container: "Mỗi 2–3 ngày — chồi non cần ẩm đều"
notes:
  - "Tưới đều và đủ ngay từ đầu giai đoạn — thiếu nước trong lúc bật mầm làm chồi bật không đều."
  - "Không để đất khô hẳn: chồi non mất nước rất nhanh trong thời tiết nóng."
  - "Tưới vào gốc, tránh tưới lên chồi non đang bung — dễ gây bệnh nấm ở điểm tăng trưởng."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
---
