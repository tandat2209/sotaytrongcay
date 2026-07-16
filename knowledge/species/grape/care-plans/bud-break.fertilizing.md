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
  - group: Phân giàu đạm (high-N)
    suggestions:
      - id: fertilizer.urea
        name: Urê
        fertilizer_group: single
      - id: fertilizer.fish-emulsion
        name: Phân cá
        fertilizer_group: organic
      - id: fertilizer.npk-20-10-10
        name: NPK 20-10-10
        fertilizer_group: npk
  - group: "Vi lượng bổ sung (Zn, B, Fe)"
    suggestions:
      - id: fertilizer.trace-elements
        name: Vi lượng Zn, B, Fe
        fertilizer_group: supplement
frequency:
  ground:
    display: Mỗi 1–2 tuần trong giai đoạn chồi đang phát triển mạnh
    interval_days: 21
  container:
    display: Hàng tuần ở liều pha loãng (50–75% liều trồng đất)
    interval_days: 20
notes:
  - >-
    Giai đoạn này rất ngắn (2–3 tuần) — bón trễ sẽ lỡ thời điểm quan trọng cho
    năng suất vụ.
  - >-
    Trong thời tiết nóng, luôn tưới nước ngay sau khi rải urê lên đất, nếu không
    urê sẽ bốc hơi mất tác dụng.
  - >-
    Không bón bo "phòng ngừa." Bo giúp thụ phấn nhưng ngưỡng ngộ độc rất hẹp —
    chỉ dùng khi có bằng chứng thiếu bo.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.fao.grape-production
priority: 50
---
