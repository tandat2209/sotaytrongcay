---
id: grape.stage.trellis-training
type: growth_stage_playbook
locale: vi-VN
species_id: plant.grape
version: 1.0.0
status: review
primary_objective: Phân nhánh cành cấp 1 đều khắp mặt giàn.
entry_criteria:
  - Đã bấm ngọn thân chính tại mặt giàn
exit_criteria:
  - Cành cấp 1 đạt độ dài tiêu chuẩn
  - Bấm ngọn cành cấp 1
estimated_duration: 2-4 tháng
recommended_playbook: playbook.grape.trellis-training
default_reminder_templates:
  - Định hướng cành bò ngang
  - Phòng trừ nấm bệnh
  - Bón bổ sung vi lượng
recommended_knowledge_topics:
  - Cách tạo cành cấp 1
  - Nhận biết bệnh sương mai
references:
  - ref.osu.growing-table-grapes
---
Chuyển hướng phát triển từ dọc sang ngang, tạo các cành cấp 1 (cành xương cá) tỏa ra mặt giàn.

## UX & Behavioral Design

- **Why it exists:** The structural paradigm shifts 90 degrees. Instead of one vertical trunk, we are managing horizontal laterals.
- **Why separated:** The pruning rule changes entirely. We stopped the trunk to force branching.
- **User Actions to Advance:** "Đã lấp đầy 50% mặt giàn" or "Bấm ngọn cành cấp 1".
- **Active Reminders:** Guiding vines horizontally, checking tie tightness so they don't strangle the vine, watching for fungal diseases as canopy increases.
- **Timeline Highlights:** "Bắt đầu chia cành ngang".
- **UI Communication:** A graphic showing a "T" shape or branches spreading outward.
