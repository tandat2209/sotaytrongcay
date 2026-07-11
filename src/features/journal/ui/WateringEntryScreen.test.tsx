import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { WateringEntryScreen } from "./WateringEntryScreen";

describe("WateringEntryScreen", () => {
  it("saves watering only after explicit Save with optional amount", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const screen = render(<WateringEntryScreen onSave={onSave} plantName="Nho sân thượng" />);

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText("lít")).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText("Lượng nước"), "1,5");
    fireEvent.press(screen.getByRole("button", { name: "Lưu hoạt động" }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ amount: { value: 1.5, unit: "liter" }, notes: null }));
  });
});
