---
id: grape.stage.recovery
type: growth_stage_playbook
title: Phục hồi
locale: vi-VN
species_id: plant.grape
sequence: 8
version: 1.0.0
status: review
machine_id: production
primary_objective: Phục hồi sức khỏe toàn diện cho cây, cải tạo đất.
entry_criteria:
  - Vừa thu hoạch xong toàn bộ trái
exit_criteria:
  - Lá bắt đầu già úa
  - Cây sẵn sàng cho chu kỳ cắt cành mới
estimated_duration: 1-2 tháng
recommended_playbook: playbook.grape.recovery
default_reminder_templates:
  - Bón lót phân chuồng, phân lân
  - Tưới đẫm nước rửa rễ
  - Dọn vệ sinh vườn rậm rạp
recommended_knowledge_topics:
  - Vì sao nho cần ngủ đông?
  - Cách ủ phân vi sinh bón gốc
references:
  - ref.osu.growing-table-grapes
---
Cây kiệt sức sau khi mang trái. Cần thời gian để tĩnh dưỡng, tích lũy năng lượng xuống bộ rễ chuẩn bị cho vụ sau.

## UX & Behavioral Design

- **Why it exists:** Vines need to replenish carbohydrates in their root system before being forced to sprout again.
- **Why separated:** Skipping this kills the vine long-term. The user must be forced to wait.
- **User Actions to Advance:** Pushing the "Bắt đầu cắt cành vụ tiếp theo" button.
- **Active Reminders:** Heavy organic fertilizer application (bón lót), resting the soil.
- **Timeline Highlights:** "Bắt đầu dưỡng sức".
- **UI Communication:** A "Sleeping/Resting" visual. A countdown timer suggesting when the next pruning window should ideally open. After recovery, it loops smoothly back to stage `grape.stage.pruning`.
