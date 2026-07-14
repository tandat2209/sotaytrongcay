---
id: plant.grape
type: plant_species
title: Nho
scientific_name: Vitis spp.
locale: vi-VN
version: 1.0.0
status: review
references:
  - ref.osu.growing-table-grapes
  - ref.uc-ipm.young-grape-pruning
  - ref.umn.growing-grapes-home-garden
lifecycles:
  development:
    title: Sinh trưởng kiến thiết
    repeatable: false
    initial_stage_id: grape.stage.seedling
    stages:
      - id: grape.stage.seedling
        title: Cây con
        sequence: 1
        transitions:
          - to: grape.stage.trunk-development
        playbook_status: review
      - id: grape.stage.trunk-development
        title: Phát triển thân
        sequence: 2
        transitions:
          - to: grape.stage.trellis-training
        playbook_status: review
      - id: grape.stage.trellis-training
        title: Leo giàn
        sequence: 3
        transitions:
          - to: grape.stage.canopy-formation
        playbook_status: review
      - id: grape.stage.canopy-formation
        title: Hình thành tán
        sequence: 4
        transitions:
          - to: grape.stage.pruning
        playbook_status: review
  production:
    title: Chu kỳ sản xuất
    repeatable: true
    initial_stage_id: grape.stage.pruning
    stages:
      - id: grape.stage.pruning
        title: Sau cắt cành
        sequence: 1
        transitions:
          - to: grape.stage.bud-break
        playbook_status: review
      - id: grape.stage.bud-break
        title: Bật mầm
        sequence: 2
        transitions:
          - to: grape.stage.flowering
        playbook_status: review
      - id: grape.stage.flowering
        title: Ra hoa
        sequence: 3
        transitions:
          - to: grape.stage.fruit-set
        playbook_status: review
      - id: grape.stage.fruit-set
        title: Đậu quả
        sequence: 4
        transitions:
          - to: grape.stage.fruit-development
        playbook_status: review
      - id: grape.stage.fruit-development
        title: Nuôi quả
        sequence: 5
        transitions:
          - to: grape.stage.ripening
        playbook_status: review
      - id: grape.stage.ripening
        title: Quả chín
        sequence: 6
        transitions:
          - to: grape.stage.harvest
        playbook_status: review
      - id: grape.stage.harvest
        title: Sẵn sàng thu hoạch
        sequence: 7
        transitions:
          - to: grape.stage.recovery
        playbook_status: review
      - id: grape.stage.recovery
        title: Sau thu hoạch
        sequence: 8
        transitions:
          - to: grape.stage.pruning
        playbook_status: review
---

# Nho

## Phạm vi

Gói thí điểm hỗ trợ người trồng nho tại nhà và thiết lập toàn bộ vòng đời của cây nho thông qua 12 giai đoạn.

Tên khoa học dùng `Vitis spp.` vì “Nho” trong sản phẩm là nhóm cây chung. Giống cụ thể có thể được bổ sung vào dữ liệu cây trồng mà không thay đổi ID loài.

## Hành trình sinh trưởng

Toàn bộ 12 giai đoạn tạo thành một mô hình lifecycles (vòng đời).

- **Giai đoạn kiến thiết (Development):** Diễn ra một lần duy nhất từ lúc trồng (Cây con) đến khi hoàn thiện khung giàn (Hình thành tán).
- **Chu kỳ sản xuất (Production):** Lặp lại hàng năm, bắt đầu từ Sau cắt cành và kết thúc ở Sau thu hoạch để bắt đầu vụ mới. Việc chuyển tiếp từ giai đoạn kiến thiết (Hình thành tán) sẽ dẫn thẳng tới chu kỳ sản xuất (Sau cắt cành).

## Giới hạn

Gói này không quy định giống nho cụ thể, hệ giàn, khí hậu, loại đất, kích thước chậu, lượng nước, công thức phân bón hoặc chương trình phun thuốc. Đây là mô hình tổng quan đóng vai trò làm khung xương cho các ứng dụng chăm sóc.
