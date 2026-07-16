import { fireEvent, render } from "@testing-library/react-native";
import { ActivityDetailScreen } from "./ActivityDetailScreen";

it("shows saved watering details", () => {
  const screen = render(
    <ActivityDetailScreen
      activity={{
        id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
        mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
        plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
        type: "watering",
        occurredAt: "2026-07-11T08:30:00.000Z",
        origin: "manual",
        intensity: "moderate",
        estimatedAmountLiters: 1.5,
        notes: "Tưới quanh gốc",
        createdAt: "2026-07-11T08:30:00.000Z",
      }}
      plantName="Nho sân thượng"
      speciesTitle="Nho"
      stageId="pruning"
      stageTitle="Cắt tỉa"
      onDelete={() => undefined}
      onEdit={() => undefined}
    />,
  );

  expect(screen.getByText("Mức tưới")).toBeTruthy();
  expect(screen.getByText("Tưới vừa")).toBeTruthy();
  expect(screen.getByText("Lượng nước ước tính")).toBeTruthy();
  expect(screen.getByText("1,5 lít")).toBeTruthy();
  expect(screen.getByText("Ghi thủ công")).toBeTruthy();
  expect(screen.getByText("Tưới quanh gốc")).toBeTruthy();
  expect(screen.getByTestId("activity-detail-plant-identity")).toHaveStyle({
    flex: 0,
  });
});

it("keeps secondary actions in the overflow menu", () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const screen = render(
    <ActivityDetailScreen
      activity={{
        id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
        mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
        plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
        type: "watering",
        occurredAt: "2026-07-11T08:30:00.000Z",
        origin: "manual",
        intensity: "moderate",
        estimatedAmountLiters: null,
        notes: null,
        createdAt: "2026-07-11T08:30:00.000Z",
      }}
      onDelete={onDelete}
      onEdit={onEdit}
      onBack={() => undefined}
      plantName="Nho sân thượng"
      speciesTitle="Nho"
      stageId="pruning"
      stageTitle="Cắt tỉa"
    />,
  );

  fireEvent.press(screen.getByLabelText("Tùy chọn hoạt động"));

  expect(screen.getByTestId("activity-detail-menu")).toBeTruthy();
  expect(screen.getByText("Xóa hoạt động")).toBeTruthy();
  fireEvent.press(screen.getByText("Chỉnh sửa"));
  expect(onEdit).toHaveBeenCalledTimes(1);
});

it("does not label fertilizing notes as water", () => {
  const screen = render(
    <ActivityDetailScreen
      activity={{
        id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
        mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
        plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
        type: "fertilizing",
        occurredAt: "2026-07-11T08:30:00.000Z",
        origin: "manual",
        intensity: null,
        estimatedAmountLiters: null,
        notes: "Đã ghi lại",
        createdAt: "2026-07-11T08:30:00.000Z",
      }}
      plantName="Nho sân thượng"
      speciesTitle="Nho"
      stageId="pruning"
      stageTitle="Cắt tỉa"
      onDelete={() => undefined}
      onEdit={() => undefined}
    />,
  );

  expect(screen.getByText("Đã ghi lại")).toBeTruthy();
  expect(screen.queryByText("Lượng nước ước tính")).toBeNull();
});

it("shows spraying details without a Lượng nước field", () => {
  const screen = render(
    <ActivityDetailScreen
      activity={{
        id: "c791e36d-b28e-4542-bf31-7c5ebac16d21",
        mutationId: "d353342e-9fe0-43a3-9d84-1b0ed436011d",
        plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
        type: "spraying",
        occurredAt: "2026-07-11T09:00:00.000Z",
        origin: "manual",
        intensity: null,
        estimatedAmountLiters: null,
        notes: "Quan sát lá",
        createdAt: "2026-07-11T09:00:00.000Z",
      }}
      plantName="Nho sân thượng"
      speciesTitle="Nho"
      stageId="pruning"
      stageTitle="Cắt tỉa"
      onDelete={() => undefined}
      onEdit={() => undefined}
    />,
  );

  expect(screen.getByText("Chi tiết hoạt động")).toBeTruthy();
  expect(screen.getByText("Phun thuốc")).toBeTruthy();
  expect(screen.getByText("Quan sát lá")).toBeTruthy();
  expect(screen.queryByText("Lượng nước ước tính")).toBeNull();
});
