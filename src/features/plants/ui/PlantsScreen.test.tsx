import { render } from "@testing-library/react-native";
import { PlantsScreen } from "./PlantsScreen";

const plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  growingMethod: "container" as const,
  location: null,
  plantedAt: null,
  stageStartedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
};

describe("PlantsScreen", () => {
  it("shows persisted plants instead of the empty state", () => {
    const screen = render(<PlantsScreen plants={[plant]} />);

    expect(screen.getByText("Nho sân thượng")).toBeTruthy();
    expect(screen.queryByText("Chưa có cây trồng")).toBeNull();
  });
});
