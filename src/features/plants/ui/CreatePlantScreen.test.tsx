import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { CreatePlantScreen } from "./CreatePlantScreen";

describe("CreatePlantScreen", () => {
  it("validates then saves a named grape plant without optional fields", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const screen = render(<CreatePlantScreen onSave={onSave} />);

    // Attempt to save with no name
    fireEvent.press(screen.getByRole("button", { name: "Lưu cây" }));
    expect(screen.getByText("Hãy đặt tên cho cây")).toBeTruthy();

    // Fill in the required name field
    fireEvent.changeText(screen.getByLabelText("Tên gọi riêng"), "Nho sân thượng");
    fireEvent.press(screen.getByRole("button", { name: "Lưu cây" }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Nho sân thượng",
          speciesId: "plant.grape",
          location: null,
          plantedAt: null,
        }),
      ),
    );
  });

  it("passes location when provided", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const screen = render(<CreatePlantScreen onSave={onSave} />);

    fireEvent.changeText(screen.getByLabelText("Tên gọi riêng"), "Nho sân thượng");
    fireEvent.changeText(screen.getByLabelText("Vị trí"), "Ban công hướng Đông");
    fireEvent.press(screen.getByRole("button", { name: "Lưu cây" }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ location: "Ban công hướng Đông" }),
      ),
    );
  });

  it("shows the species title in the screen title", () => {
    const screen = render(<CreatePlantScreen onSave={jest.fn()} />);

    expect(screen.getByText(/Thiết lập: Nho/i)).toBeTruthy();
  });

  it("shows reassurance text below the save button", () => {
    const screen = render(<CreatePlantScreen onSave={jest.fn()} />);

    expect(
      screen.getByText(/Bạn có thể thay đổi các thông tin này bất kỳ lúc nào/),
    ).toBeTruthy();
  });

  it("shows a save error on failure and preserves the draft", async () => {
    const onSave = jest.fn().mockRejectedValue(new Error("DB error"));
    const screen = render(<CreatePlantScreen onSave={onSave} />);

    fireEvent.changeText(screen.getByLabelText("Tên gọi riêng"), "Nho sân thượng");
    fireEvent.press(screen.getByRole("button", { name: "Lưu cây" }));

    await waitFor(() =>
      expect(screen.getByText("Chưa thể lưu cây. Dữ liệu đã nhập vẫn được giữ lại.")).toBeTruthy(),
    );
    // Name field still has the draft value
    expect(screen.getByLabelText("Tên gọi riêng").props.value).toBe("Nho sân thượng");
  });
});
