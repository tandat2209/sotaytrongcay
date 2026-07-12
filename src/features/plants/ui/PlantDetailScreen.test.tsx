import { fireEvent, render } from "@testing-library/react-native";
import { productionWeather } from "@/shared/weather/weather-state";
import { createPlantDetailProjection } from "../models/plant-detail-projection";
import { PlantDetailScreen } from "./PlantDetailScreen";

const plant = { id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", name: "Nho sân thượng", speciesId: "plant.grape", stageId: "grape.stage.trunk-development", location: null, plantedAt: null, createdAt: "2026-07-11T08:00:00.000Z" };
const projection = createPlantDetailProjection({ activities: [], plant });

describe("PlantDetailScreen", () => {
  it("shows three empty care summaries and opens each care record icon button", () => {
    const onRecordCare = jest.fn();
    const screen = render(<PlantDetailScreen onOpenActivity={jest.fn()} onRecordCare={onRecordCare} projection={projection} weather={productionWeather} />);

    expect(screen.getAllByText("Chưa có dữ liệu")).toHaveLength(3);
    // Record actions are icon buttons identified by their accessibility label
    fireEvent.press(screen.getByRole("button", { name: "Ghi tưới nước" }));
    fireEvent.press(screen.getByRole("button", { name: "Ghi bón phân" }));
    fireEvent.press(screen.getByRole("button", { name: "Ghi phun thuốc" }));
    expect(onRecordCare).toHaveBeenNthCalledWith(1, "watering");
    expect(onRecordCare).toHaveBeenNthCalledWith(2, "fertilizing");
    expect(onRecordCare).toHaveBeenNthCalledWith(3, "spraying");
    // Stage playbook content renders for trunk-development
    expect(screen.getByText(/Mốc tiếp theo/)).toBeTruthy();
  });

  it("opens persisted care activity and provides a return control", () => {
    const onBack = jest.fn();
    const onOpenActivity = jest.fn();
    const saved = createPlantDetailProjection({ activities: [{ id: "86ee7489-6147-42b9-b73f-5650ea7fd214", mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d", plantId: plant.id, type: "watering", occurredAt: "2026-07-11T08:30:00.000Z", origin: "manual", amount: { value: 1.5, unit: "liter" }, notes: null, createdAt: "2026-07-11T08:30:00.000Z" }], plant });
    const screen = render(<PlantDetailScreen onBack={onBack} onOpenActivity={onOpenActivity} onRecordCare={jest.fn()} projection={saved} weather={productionWeather} />);

    expect(screen.getByText(/1,5 lít/)).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Xem lần tưới nước gần nhất" }));
    fireEvent.press(screen.getByRole("button", { name: "Quay lại Cây trồng" }));
    expect(onOpenActivity).toHaveBeenCalledWith("86ee7489-6147-42b9-b73f-5650ea7fd214");
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders without error when weather is unavailable", () => {
    const screen = render(
      <PlantDetailScreen
        onOpenActivity={jest.fn()}
        onRecordCare={jest.fn()}
        projection={projection}
        weather={{ status: "unavailable", reason: "not-configured" }}
      />,
    );

    expect(screen.getByText("Chưa có dữ liệu thời tiết để hiển thị.")).toBeTruthy();
  });

  it("does not render screenshot-only controls absent from the current slice", () => {
    const screen = render(
      <PlantDetailScreen onOpenActivity={jest.fn()} onRecordCare={jest.fn()} projection={projection} weather={productionWeather} />,
    );

    // No sensor metrics (soil moisture %, sunlight hours)
    expect(screen.queryByText(/Độ ẩm đất/i)).toBeNull();
    // No photo or reminder controls
    expect(screen.queryByText(/Nhật ký ảnh/i)).toBeNull();
    expect(screen.queryByText(/Lời nhắc/i)).toBeNull();
    // No stage progress or countdown
    expect(screen.queryByText(/ngày còn lại/i)).toBeNull();
  });

  it("renders stage playbook objective and exit criteria for a known grape stage", () => {
    const screen = render(
      <PlantDetailScreen onOpenActivity={jest.fn()} onRecordCare={jest.fn()} projection={projection} weather={productionWeather} />,
    );

    // Stage card shows the objective from the playbook
    expect(screen.getByText(/Tạo ra một thân chính khỏe mạnh/)).toBeTruthy();
    // Tips section shows 'Mốc tiếp theo' and 'Nần tìm hiểu' from the playbook
    expect(screen.getByText("Mốc tiếp theo")).toBeTruthy();
    expect(screen.getByText("Nên tìm hiểu")).toBeTruthy();
    // Review label is present
    expect(screen.getByText("NỘI DUNG CHỜ DUYỆT")).toBeTruthy();
  });

  it("renders empty state for tips when stagePlaybook is null", () => {
    const unknownPlant = { ...plant, speciesId: "plant.unknown", stageId: "unknown.stage" };
    const projectionWithoutPlaybook = createPlantDetailProjection({ activities: [], plant: unknownPlant });
    const screen = render(
      <PlantDetailScreen onOpenActivity={jest.fn()} onRecordCare={jest.fn()} projection={projectionWithoutPlaybook} weather={productionWeather} />,
    );

    expect(screen.getByText("Chưa có mẹo cho giai đoạn này.")).toBeTruthy();
    expect(screen.queryByText("NỘI DUNG CHỜ DUYỆT")).toBeNull();
  });

  it("shows the Hướng dẫn chi tiết link and invokes onOpenPlaybook when tapped", () => {
    const onOpenPlaybook = jest.fn();
    const screen = render(
      <PlantDetailScreen onOpenActivity={jest.fn()} onOpenPlaybook={onOpenPlaybook} onRecordCare={jest.fn()} projection={projection} weather={productionWeather} />,
    );

    expect(screen.getByText("Hướng dẫn chi tiết")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Xem hướng dẫn chi tiết giai đoạn" }));
    expect(onOpenPlaybook).toHaveBeenCalledTimes(1);
  });

  it("omits the Hướng dẫn chi tiết link when onOpenPlaybook is not provided", () => {
    const screen = render(
      <PlantDetailScreen onOpenActivity={jest.fn()} onRecordCare={jest.fn()} projection={projection} weather={productionWeather} />,
    );

    expect(screen.queryByText("Hướng dẫn chi tiết")).toBeNull();
  });
});
