---
id: grape.stage.flowering
type: growth_stage_playbook
title: Ra hoa
locale: vi-VN
species_id: plant.grape
sequence: 3
version: 1.0.0
status: review
machine_id: production
primary_objective: Đảm bảo tỉ lệ thụ phấn cao nhất, tránh rụng bông.
entry_criteria:
  - Nụ hoa bắt đầu hé mở cánh
exit_criteria:
  - Hoa tàn
  - Bầu nhụy phình to thành hạt xanh nhỏ (đậu trái)
estimated_duration: 1-2 tuần
recommended_playbook: playbook.grape.flowering
default_reminder_templates:
  - DỪNG phun tất cả các loại thuốc
  - DỪNG bón phân
  - Giảm tối đa tưới nước
recommended_knowledge_topics:
  - Tại sao nho rụng bông?
  - Ảnh hưởng của sương mù đến thụ phấn
references:
  - ref.osu.growing-table-grapes
---
Hoa nở đồng loạt để thụ phấn. Giai đoạn cực kỳ nhạy cảm với nước và hóa chất.

## UX & Behavioral Design

- **Why it exists:** A delicate physiological event. Interference causes crop failure.
- **Why separated:** Completely inverted care rules: STOP doing things (no water, no fertilizer, no spray).
- **User Actions to Advance:** "Đã đậu trái non".
- **Active Reminders:** Warnings to NOT water heavily or spray chemicals.
- **Timeline Highlights:** "Bắt đầu nở hoa".
- **UI Communication:** Delicate flower icon. A prominent visual "WARNING: Sensitive Phase" banner across the UI. Playbook is mostly "Hands off".
