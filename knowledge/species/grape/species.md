---
id: plant.grape
type: plant_species
title: "Nho"
scientific_name: "Vitis spp."
locale: vi-VN
version: 1.0.0
status: review
stage_journey:
  - id: grape.stage.seedling
    title: "Cây con"
    sequence: 1
    playbook_status: review
  - id: grape.stage.trunk-development
    title: "Nuôi thân chính"
    sequence: 2
    playbook_status: review
  - id: grape.stage.trellis-training
    title: "Leo giàn"
    sequence: 3
    playbook_status: review
  - id: grape.stage.canopy-formation
    title: "Tạo tán"
    sequence: 4
    playbook_status: review
  - id: grape.stage.mature-vine
    title: "Cây trưởng thành"
    sequence: 5
    playbook_status: review
  - id: grape.stage.pruning
    title: "Cắt cành"
    sequence: 6
    playbook_status: review
  - id: grape.stage.bud-break
    title: "Kích mầm"
    sequence: 7
    playbook_status: review
  - id: grape.stage.flowering
    title: "Ra hoa"
    sequence: 8
    playbook_status: review
  - id: grape.stage.fruit-set
    title: "Đậu quả"
    sequence: 9
    playbook_status: review
  - id: grape.stage.fruit-development
    title: "Nuôi quả"
    sequence: 10
    playbook_status: review
  - id: grape.stage.ripening
    title: "Chín quả"
    sequence: 11
    playbook_status: review
  - id: grape.stage.harvest
    title: "Thu hoạch"
    sequence: 12
    playbook_status: review
  - id: grape.stage.recovery
    title: "Phục hồi"
    sequence: 13
    playbook_status: review
references:
  - ref.osu.growing-table-grapes
  - ref.uc-ipm.young-grape-pruning
  - ref.umn.growing-grapes-home-garden
---

# Nho

## Phạm vi

Gói thí điểm hỗ trợ người trồng nho tại nhà và thiết lập toàn bộ vòng đời của cây nho thông qua 13 giai đoạn.

Tên khoa học dùng `Vitis spp.` vì “Nho” trong sản phẩm là nhóm cây chung. Giống cụ thể có thể được bổ sung vào dữ liệu cây trồng mà không thay đổi ID loài.

## Hành trình sinh trưởng

Toàn bộ 13 giai đoạn tạo thành một mô hình state-machine (máy trạng thái).
- **Giai đoạn kiến thiết (Development):** Diễn ra một lần duy nhất từ lúc trồng (Cây con) đến khi hoàn thiện khung giàn (Cây trưởng thành).
- **Chu kỳ sản xuất (Production):** Lặp lại hàng năm, bắt đầu từ Cắt cành và kết thúc ở Phục hồi để bắt đầu vụ mới.

## Giới hạn

Gói này không quy định giống nho cụ thể, hệ giàn, khí hậu, loại đất, kích thước chậu, lượng nước, công thức phân bón hoặc chương trình phun thuốc. Đây là mô hình tổng quan đóng vai trò làm khung xương cho các ứng dụng chăm sóc.
