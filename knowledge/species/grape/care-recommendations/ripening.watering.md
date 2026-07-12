---
id: grape.recommendation.ripening.watering
type: care_recommendation_definition
title: "Tưới nước giai đoạn quả chín"
goal: "Bắt đầu giảm tưới có kiểm soát khi trái chuyển màu (véraison). Stress nước nhẹ trong giai đoạn này tập trung đường, cải thiện hương vị và màu sắc. Nhưng không để khô hẳn — trái sẽ teo và nứt khi tưới lại."
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.ripening
activity_type: watering
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 4
on_missing_history: suggest
frequency:
  ground: "Mỗi 4–5 ngày, giảm dần so với giai đoạn nuôi quả. Ngừng tưới 5–7 ngày trước thu hoạch"
  container: "Mỗi 3–4 ngày ở liều giảm. Ngừng tưới 3–5 ngày trước thu hoạch"
notes:
  - "Giảm tưới đột ngột khi trái đã bắt đầu chín sẽ gây nứt trái — giảm từ từ là cách đúng."
  - "Trái nho tăng độ ngọt khi stress nước nhẹ — nhưng quá khô sẽ làm trái teo và mất chất lượng."
  - "Ngừng tưới 5–7 ngày trước thu hoạch để trái cô đặc hương vị và dễ bảo quản hơn."
  - "Nhiệt độ đêm cao liên tục cản trở phát triển màu ở nho đỏ — không phải do thiếu tưới."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.fao.grape-production
---
