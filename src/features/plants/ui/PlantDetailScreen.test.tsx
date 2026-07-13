import { fireEvent, render } from "@testing-library/react-native";
import type { CareActivity } from "@/features/journal";
import { productionWeather } from "@/shared/weather/weather-state";
import { createPlantDetailProjection } from "../models/plant-detail-projection";
import { PlantDetailScreen } from "./PlantDetailScreen";

const plant = { id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", name: "Nho sân thượng", speciesId: "plant.grape", stageId: "grape.stage.trunk-development", growingMethod: "container" as const, location: null, plantedAt: null, createdAt: "2026-07-11T08:00:00.000Z" };
const evaluatedAt = new Date("2026-07-13T10:00:00.000Z");
const savedWatering: CareActivity = { id: "86ee7489-6147-42b9-b73f-5650ea7fd214", mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d", plantId: plant.id, type: "watering", occurredAt: "2026-07-11T08:30:00.000Z", origin: "manual", amount: { value: 1.5, unit: "liter" }, notes: null, createdAt: "2026-07-11T08:30:00.000Z" };

function projection(activities: readonly CareActivity[] = [], selectedPlant = plant) {
  return createPlantDetailProjection({ activities, evaluatedAt, plant: selectedPlant });
}

function renderScreen(overrides: Partial<React.ComponentProps<typeof PlantDetailScreen>> = {}) {
  return render(<PlantDetailScreen
    onOpenActivity={jest.fn()}
    onRecordCare={jest.fn()}
    projection={projection()}
    weather={productionWeather}
    {...overrides}
  />);
}

describe("PlantDetailScreen", () => {
  it("shows all lifecycle stages in a compact journey with an accessible current marker", () => {
    const screen = renderScreen();

    expect(screen.getByText("Hành trình sinh trưởng")).toBeTruthy();
    expect(screen.getByLabelText("Phát triển thân, hiện tại")).toBeTruthy();
    for (const stage of projection().lifecycleStages) {
      expect(screen.getAllByText(stage.title)).not.toHaveLength(0);
    }
    expect(screen.queryByText("Hiện tại")).toBeNull();
    expect(screen.getByText(/Tạo ra một thân chính khỏe mạnh/)).toBeTruthy();
    expect(screen.getByText("Chăm sóc hôm nay")).toBeTruthy();
    expect(screen.getAllByText("NỘI DUNG CHỜ DUYỆT")).not.toHaveLength(0);
  });

  it("shows sourced watering and fertilizing care cards", () => {
    const screen = renderScreen({ projection: projection([savedWatering]) });

    expect(screen.getAllByText("Tưới nước")).not.toHaveLength(0);
    expect(screen.getAllByText("Bón phân")).not.toHaveLength(0);
    expect(screen.getByText("Chưa cần")).toBeTruthy();
    expect(screen.getByText(/1,5 lít/)).toBeTruthy();
    expect(screen.getByText("Chưa có tần suất đã duyệt")).toBeTruthy();
    expect(screen.getByText(/Mỗi 1–2 tuần/)).toBeTruthy();
  });

  it("keeps care recording inside Quick Care instead of duplicating card actions", () => {
    const screen = renderScreen();

    expect(screen.queryByRole("button", { name: "Ghi tưới nước" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Ghi bón phân" })).toBeNull();
    expect(screen.getByRole("button", { name: "Chăm sóc nhanh" })).toBeTruthy();
  });

  it("opens saved activity and stage guide", () => {
    const onOpenActivity = jest.fn();
    const onOpenPlaybook = jest.fn();
    const screen = renderScreen({ onOpenActivity, onOpenPlaybook, projection: projection([savedWatering]) });

    fireEvent.press(screen.getByRole("button", { name: "Xem lần tưới nước gần nhất" }));
    const guideButton = screen.getAllByRole("button", { name: "Mở hướng dẫn giai đoạn" })[0];
    expect(guideButton).toBeDefined();
    fireEvent.press(guideButton!);
    expect(onOpenActivity).toHaveBeenCalledWith(savedWatering.id);
    expect(onOpenPlaybook).toHaveBeenCalledTimes(1);
  });

  it("opens plant-scoped Quick Care choices", () => {
    const onRecordCare = jest.fn();
    const screen = renderScreen({ onRecordCare });

    fireEvent.press(screen.getByRole("button", { name: "Chăm sóc nhanh" }));
    expect(screen.getByText("Chọn hoạt động muốn ghi")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Ghi phun thuốc" }));
    expect(onRecordCare).toHaveBeenCalledWith("spraying");
  });

  it("keeps recent activity lightweight and navigable", () => {
    const onOpenActivity = jest.fn();
    const screen = renderScreen({ onOpenActivity, projection: projection([savedWatering]) });

    expect(screen.getByText("Hoạt động gần đây")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Mở tưới nước" }));
    expect(onOpenActivity).toHaveBeenCalledWith(savedWatering.id);
  });

  it("renders truthful unsupported and unavailable states", () => {
    const unknownPlant = { ...plant, speciesId: "plant.unknown", stageId: "unknown.stage" };
    const screen = renderScreen({
      projection: projection([], unknownPlant),
      weather: { status: "unavailable", reason: "not-configured" },
    });

    expect(screen.getAllByText("Chưa xác định")).not.toHaveLength(0);
    expect(screen.getAllByText("Chưa có gợi ý")).toHaveLength(2);
    expect(screen.getByText("Chưa có dữ liệu thời tiết để hiển thị.")).toBeTruthy();
    expect(screen.queryByText(/Khỏe mạnh/i)).toBeNull();
    expect(screen.queryByText(/ngày trong giai đoạn/i)).toBeNull();
    expect(screen.queryByText(/Độ ẩm đất/i)).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
  });
});
