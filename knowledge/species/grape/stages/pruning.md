---
id: grape.stage.pruning
type: growth_stage_playbook
title: "Cắt cành"
locale: vi-VN
species_id: plant.grape
sequence: 6
version: 1.0.0
status: review
stage_group: production
repeatable: true
primary_objective: "Tạo vết cắt kích thích mầm ngủ nảy nở đồng loạt."
entry_criteria:
  - "Từ trạng thái Trưởng thành hoặc Phục hồi"
  - "Người dùng thực hiện cắt cành"
exit_criteria:
  - "Mắt ngủ bắt đầu sưng to"
  - "Nứt nanh (mầm xanh xuất hiện)"
estimated_duration: "1-2 tuần"
recommended_playbook: playbook.grape.pruning
default_reminder_templates:
  - "Quét thuốc chống nấm vết cắt"
  - "Dọn sạch lá rụng khỏi vườn"
  - "Siết nước (ngưng tưới)"
recommended_knowledge_topics:
  - "Cách xác định mắt ngủ khỏe"
  - "Vệ sinh vườn sau cắt cành"
references:
  - ref.osu.growing-table-grapes
---

Cắt bỏ các cành thừa, lá cũ để kích thích cây ngủ đông ngắn và dồn lực bật mầm mới.

## UX & Behavioral Design

- **Why it exists:** It initiates the biological clock of the production cycle. It resets the vine.
- **Why separated:** It's a violent intervention that temporarily strips the vine of leaves.
- **User Actions to Advance:** "Mắt ngủ sưng to" (Bud swelling observation).
- **Active Reminders:** Disease control on fresh cuts (quét nấm), stopping watering to simulate stress (siết nước).
- **Timeline Highlights:** "Cắt cành vụ X". This zero-indexes the season timeline.
- **UI Communication:** A dramatic UI shift. Bare branches icon. The overarching "Season 1" tracker begins.
