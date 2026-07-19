---
id: grape.recommendation.ripening.fertilizing
type: care_plan
title: Bón phân giai đoạn quả chín
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.ripening
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 14
on_missing_history: suggest
goal: >-
  Chuyển sang bón kali thuần hoặc chủ đạo kali. Ngừng hoàn toàn phân đạm. Cây
  đang vận chuyển đường từ lá vào trái — đạm lúc này kích thích sinh trưởng thân
  lá không mong muốn và làm chậm chín.
recommended_inputs:
  - id: fertilizer.potassium-sulfate
    name: Kali sunfat
    group: potassium-rich
  - id: fertilizer.seaweed-extract
    name: Rong biển
    group: support
  - id: fertilizer.monopotassium-phosphate
    name: MKP – monopotassium phosphate
    group: potassium-rich
frequency:
  ground:
    display: "Mỗi 2–3 tuần, giảm cường độ. Ngừng hoàn toàn 1–2 tuần trước thu hoạch"
    interval_days: 21
  container:
    display: Mỗi 1–2 tuần ở liều nhẹ. Ngừng hoàn toàn 1–2 tuần trước thu hoạch
    interval_days: 20
notes:
  - >-
    Đạm trong giai đoạn chín = nho kém chất lượng. Trái sẽ to nhưng nhiều nước,
    ít đường, màu sắc kém và dễ thối.
  - Giảm tưới nhẹ (không phải để héo) giúp cô đặc đường và cải thiện hương vị.
  - >-
    Nho không lên màu? Kiểm tra kali trước — đây là nguyên nhân dinh dưỡng phổ
    biến nhất gây lên màu kém.
  - >-
    Nhiệt độ đêm liên tục trên 30°C cản trở phát triển màu (anthocyanin) ở giống
    nho đỏ/đen, bất kể dinh dưỡng có tốt đến đâu.
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.ucdavis.vineyard-nutrition
  - ref.fao.grape-production
  - ref.uc-ipm.growing-grape
priority: 50
---
