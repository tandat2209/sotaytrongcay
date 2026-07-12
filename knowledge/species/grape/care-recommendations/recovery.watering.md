---
id: grape.recommendation.recovery.watering
type: care_recommendation_definition
title: "Tưới nước giai đoạn phục hồi sau thu hoạch"
goal: "Sau thu hoạch, cây cần tiếp tục quang hợp để tích lũy năng lượng cho vụ sau. Duy trì tưới đủ để lá hoạt động, sau đó giảm dần để chuẩn bị cho giai đoạn nghỉ ngắn trước khi cắt cành."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.recovery
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 4
on_missing_history: suggest
frequency:
  ground: "Mỗi 4–5 ngày ngay sau thu hoạch, giảm dần xuống 7–10 ngày khi lá bắt đầu già"
  container: "Mỗi 3–4 ngày ban đầu, giảm dần để kích thích lá rụng"
notes:
  - "Không ngừng tưới đột ngột ngay sau thu hoạch — cây cần nước để tiếp tục quang hợp và tích lũy năng lượng dự trữ."
  - "Giảm tưới từ từ trong 3–4 tuần cuối để kích thích lá già và rụng tự nhiên trước khi cắt cành."
  - "Lá vàng đều và rụng là dấu hiệu tốt cuối giai đoạn phục hồi — cây đang chuyển về trạng thái nghỉ ngắn."
  - "Ở Việt Nam không có mùa đông tự nhiên — giảm nước chủ động là cách duy nhất để cây nghỉ ngắn trước vụ mới."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
---
