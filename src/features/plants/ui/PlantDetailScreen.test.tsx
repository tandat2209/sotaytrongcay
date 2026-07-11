import { fireEvent, render } from "@testing-library/react-native";
import { PlantDetailScreen } from "./PlantDetailScreen";

const plant = { id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", name: "Nho sân thượng", speciesId: "plant.grape", stageId: "grape.stage.trunk-development", plantedAt: null, createdAt: "2026-07-11T08:00:00.000Z" };

describe("PlantDetailScreen", () => {
  it("shows recent care and opens watering entry", () => {
    const onWater = jest.fn();
    const screen = render(<PlantDetailScreen activities={[]} onOpenActivity={jest.fn()} onWater={onWater} plant={plant} />);

    expect(screen.getByText("Chưa có dữ liệu")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Ghi tưới nước" }));
    expect(onWater).toHaveBeenCalledTimes(1);
  });

  it("provides a visible route back to the plants list", () => {
    const onBack = jest.fn();
    const screen = render(<PlantDetailScreen activities={[]} onBack={onBack} onOpenActivity={jest.fn()} onWater={jest.fn()} plant={plant} />);

    fireEvent.press(screen.getByRole("button", { name: "Quay lại Cây trồng" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows the most recent watering after save", () => {
    const screen = render(<PlantDetailScreen activities={[{ id: "86ee7489-6147-42b9-b73f-5650ea7fd214", mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d", plantId: plant.id, type: "watering", occurredAt: "2026-07-11T08:30:00.000Z", origin: "manual", amount: { value: 1.5, unit: "liter" }, notes: null, createdAt: "2026-07-11T08:30:00.000Z" }]} onOpenActivity={jest.fn()} onWater={jest.fn()} plant={plant} />);

    expect(screen.getByText("1,5 lít")).toBeTruthy();
  });
});
