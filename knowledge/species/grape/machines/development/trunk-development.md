---
id: grape.stage.trunk-development
type: growth_stage_playbook
title: Nuôi thân chính
locale: vi-VN
species_id: plant.grape
sequence: 2
version: 1.0.0
status: review
machine_id: development
primary_objective: Tạo ra một thân chính khỏe mạnh, mập mạp và vươn tới mặt giàn.
entry_criteria:
  - Mầm chính khỏe mạnh, bắt đầu vươn cao
exit_criteria:
  - Thân chính chạm dây kẽm mặt giàn
  - Đã bấm ngọn thân chính
estimated_duration: 1-3 tháng
recommended_playbook: playbook.grape.trunk-development
default_reminder_templates:
  - Cột dây định hình thân
  - Lẩy chồi nách (chồi phụ)
  - Bón phân đạm định kỳ
recommended_knowledge_topics:
  - Kỹ thuật lẩy chồi nách
  - Cách cột dây không làm nghẹt thân
references:
  - ref.osu.growing-table-grapes
---
Tập trung toàn bộ dinh dưỡng để nuôi một thân duy nhất vươn thẳng lên giàn.

## UX & Behavioral Design

- **Why it exists:** Vines naturally sprawl. Without human intervention (removing side shoots), it won't form a strong trunk.
- **Why separated:** The objective shifted from "survival" to "directed structural growth".
- **User Actions to Advance:** User logs "Thân đã chạm giàn" or performs the action "Bấm ngọn ngưng phát triển cao".
- **Active Reminders:** Weekly tasks to tie the vine to a stake and pinch off side shoots (chồi nách) to direct energy upward.
- **Timeline Highlights:** User logging the height of the vine (e.g., "Cao 1m").
- **UI Communication:** Vertical growth visualization. The Playbook becomes highly task-oriented ("Nhiệm vụ tuần này: Lẩy chồi nách").
