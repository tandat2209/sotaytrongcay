---
id: grape.stage.mature-vine
type: growth_stage_playbook
title: "Cây trưởng thành"
locale: vi-VN
species_id: plant.grape
sequence: 5
version: 1.0.0
status: review
stage_group: development
repeatable: false
primary_objective: "Duy trì sức khỏe và đợi thời điểm thích hợp để cắt cành ép trái."
entry_criteria:
  - "Cành mẹ đã hóa gỗ hoàn toàn"
  - "Thời tiết phù hợp cho vụ mới"
exit_criteria:
  - "Thực hiện thao tác cắt cành (Pruning)"
estimated_duration: "1-4 tuần (chờ đợi thời điểm)"
recommended_playbook: playbook.grape.mature-vine-prep
default_reminder_templates:
  - "Chuẩn bị dụng cụ cắt tỉa"
  - "Chuẩn bị thuốc bảo vệ thực vật"
recommended_knowledge_topics:
  - "Khi nào nên cắt cành ép trái?"
  - "Kỹ thuật cắt cành"
references:
  - ref.osu.growing-table-grapes
---

Cây đã hoàn thiện khung bộ, tích lũy đủ dinh dưỡng và sẵn sàng bước vào chu kỳ cho trái đầu tiên.

## UX & Behavioral Design

- **Why it exists:** An idle state. The structure is complete, waiting for the human decision to start the production cycle.
- **Why separated:** Represents the end of the "setup" phase. 
- **User Actions to Advance:** Clicking the definitive "Bắt đầu cắt cành" button.
- **Active Reminders:** Preparing tools, buying supplies for the upcoming season.
- **Timeline Highlights:** "Sẵn sàng cho vụ đầu tiên!".
- **UI Communication:** A celebratory "Achievement Unlocked" badge. The UI highly emphasizes the next big step: Start Production Cycle.
