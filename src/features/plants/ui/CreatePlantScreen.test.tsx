import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { CreatePlantScreen } from "./CreatePlantScreen";

describe("CreatePlantScreen", () => {
  it("validates then saves a named grape plant", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const screen = render(<CreatePlantScreen onSave={onSave} />);

    fireEvent.press(screen.getByRole("button", { name: "Lưu cây" }));
    expect(screen.getByText("Hãy đặt tên cho cây")).toBeTruthy();

    fireEvent.changeText(screen.getByLabelText("Tên cây"), "Nho sân thượng");
    fireEvent.press(screen.getByRole("button", { name: "Lưu cây" }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      name: "Nho sân thượng",
      speciesId: "plant.grape",
    })));
  });
});
