---
id: grape.recommendation.recovery.fertilizing
type: care_recommendation_definition
title: "Bón phân giai đoạn sau thu hoạch"
locale: vi-VN
species_ids:
  - plant.grape
stage_ids:
  - grape.stage.recovery
activity_type: fertilizing
eligibility:
  kind: elapsed_days_since_activity
  suggest_after_days: 14
on_missing_history: suggest
goal: "Bổ sung lại nguồn dự trữ dinh dưỡng và carbohydrate cho cây. Sau khi mang trái, cây kiệt sức. Dinh dưỡng bón lúc này được tích lũy vào phần gỗ và bộ rễ, cung cấp năng lượng cho vụ sau."
recommended_inputs:
  - group: "Phân NPK cân đối"
    examples: "NPK 16-16-16 — tiếp tục đạm vì cây cần giữ bộ lá quang hợp để tích trữ năng lượng"
  - group: "Phân hữu cơ bón nặng"
    examples: "Phân bò ủ hoai, phân trùn quế, phân vỏ trấu compost"
  - group: "Bón lót lân và kali"
    examples: "Bột xương, lân tự nhiên, kali sunfat"
  - group: "Vôi điều chỉnh pH (nếu cần)"
    examples: "Vôi dolomite — chỉ dùng khi pH đất giảm dưới 5.5 do bón phân hóa học nhiều"
frequency:
  ground: "1–2 lần bón nặng (lần đầu trong vòng một tuần sau thu hoạch, lần hai sau 2–4 tuần)"
  container: "1–2 lần bón nặng. Cân nhắc thay 20–30% giá thể phía trên bằng phân compost mới"
notes:
  - "Không bỏ qua bón phân sau thu hoạch. Cây kiệt sức bước vào vụ mới sẽ cho năng suất kém."
  - "Đây là thời điểm tốt nhất để cải tạo đất bằng phân hữu cơ — phân có nhiều tuần để phân hủy và hòa nhập trước vụ sau."
  - "Sau khi bón phân phục hồi xong, giảm dần tưới nước để khuyến khích lá rụng và cây nghỉ ngắn trước khi cắt cành vụ mới."
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.umn.growing-grapes-home-garden
  - ref.ucdavis.vineyard-nutrition
---
