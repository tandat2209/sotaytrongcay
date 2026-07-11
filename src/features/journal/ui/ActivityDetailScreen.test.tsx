import { render } from "@testing-library/react-native";
import { ActivityDetailScreen } from "./ActivityDetailScreen";

it("shows saved watering details", () => {
  const screen = render(<ActivityDetailScreen activity={{ id: "86ee7489-6147-42b9-b73f-5650ea7fd214", mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d", plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", type: "watering", occurredAt: "2026-07-11T08:30:00.000Z", origin: "manual", amount: { value: 1.5, unit: "liter" }, notes: "Tưới quanh gốc", createdAt: "2026-07-11T08:30:00.000Z" }} plantName="Nho sân thượng" />);

  expect(screen.getByText("1,5 lít")).toBeTruthy();
  expect(screen.getByText("Ghi thủ công")).toBeTruthy();
  expect(screen.getByText("Tưới quanh gốc")).toBeTruthy();
});
