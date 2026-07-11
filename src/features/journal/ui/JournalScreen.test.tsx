import { fireEvent, render } from "@testing-library/react-native";
import { JournalScreen } from "./JournalScreen";

const activity = { id: "86ee7489-6147-42b9-b73f-5650ea7fd214", mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d", plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1", type: "watering", occurredAt: "2026-07-11T08:30:00.000Z", origin: "manual", amount: null, notes: null, createdAt: "2026-07-11T08:30:00.000Z" } as const;

describe("JournalScreen", () => {
  it("lists saved watering and opens its detail", () => {
    const onOpenActivity = jest.fn();
    const screen = render(<JournalScreen activities={[activity]} onOpenActivity={onOpenActivity} plantNames={{ [activity.plantId]: "Nho sân thượng" }} />);

    fireEvent.press(screen.getByRole("button", { name: "Tưới nước · Nho sân thượng" }));
    expect(onOpenActivity).toHaveBeenCalledWith(activity.id);
  });
});
