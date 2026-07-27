---
id: grape.recommendation.bud-break.fertilizing
type: care_plan
title: Bón phân giai đoạn bật mầm
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.bud-break
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 7
on_missing_history: suggest
goal: >-
  Đây là giai đoạn nhu cầu đạm (N) cao nhất. Chồi non đang phát triển nhanh,
  bung lá và hình thành các chùm hoa nhỏ sẽ trở thành trái.
recommended_inputs:
  - catalog_id: fertilizer-role.high-nitrogen
    priority: primary
  - catalog_id: fertilizer-role.organic-foundation
    priority: alternative
frequency:
  ground:
    display: Mỗi 1–2 tuần trong giai đoạn chồi đang phát triển mạnh
    interval_days: 7
  container:
    display: Hàng tuần ở liều pha loãng (50–75% liều trồng đất)
    interval_days: 7
notes:
  - >-
    Giai đoạn này rất ngắn (2–3 tuần) — bón trễ sẽ lỡ thời điểm quan trọng cho
    năng suất vụ.
  - >-
    Đọc nhãn của loại phân đã chọn và tưới theo hướng dẫn sử dụng; không tự suy
    ra liều từ tên vai trò phân bón.
  - >-
    Không bón bo "phòng ngừa." Bo giúp thụ phấn nhưng ngưỡng ngộ độc rất hẹp —
    chỉ dùng khi có bằng chứng thiếu bo.
version: 2.0.1
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.fao.grape-production
  - ref.umn.fertilizer-urea
priority: 50
---
