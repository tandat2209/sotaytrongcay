import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { CareEntryScreen } from "./CareEntryScreen";

describe("CareEntryScreen", () => {
  it.each([
    ["fertilizing", "Ghi bón phân"],
    ["spraying", "Ghi phun thuốc"],
  ] as const)("saves %s only after explicit confirmation", async (type, title) => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const screen = render(<CareEntryScreen onSave={onSave} plantName="Nho sân thượng" type={type} />);

    expect(screen.getByText(title)).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.changeText(screen.getByLabelText("Ghi chú"), "Đã ghi lại");
    fireEvent.press(screen.getByRole("button", { name: "Lưu hoạt động" }));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ amount: null, notes: "Đã ghi lại" }));
    expect(screen.queryByLabelText("Lượng nước")).toBeNull();
  });

  it("passes the liter amount for watering", async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const screen = render(<CareEntryScreen onSave={onSave} plantName="Nho sân thượng" type="watering" />);

    expect(screen.getByText("Ghi tưới nước")).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText("Lượng nước"), "2,5");
    fireEvent.press(screen.getByRole("button", { name: "Lưu hoạt động" }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith({ amount: { value: 2.5, unit: "liter" }, notes: null }),
    );
  });

  it("does not call onSave when the user navigates back before confirming", () => {
    const onBack = jest.fn();
    const onSave = jest.fn();
    const screen = render(
      <CareEntryScreen onBack={onBack} onSave={onSave} plantName="Nho sân thượng" type="fertilizing" />,
    );

    fireEvent.changeText(screen.getByLabelText("Ghi chú"), "Chưa lưu");
    fireEvent.press(screen.getByRole("button", { name: "Quay lại cây trồng" }));

    expect(onSave).not.toHaveBeenCalled();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows an error and preserves draft input when save fails", async () => {
    const onSave = jest.fn().mockRejectedValue(new Error("network"));
    const screen = render(<CareEntryScreen onSave={onSave} plantName="Nho sân thượng" type="spraying" />);

    fireEvent.changeText(screen.getByLabelText("Ghi chú"), "Ghi chú nháp");
    fireEvent.press(screen.getByRole("button", { name: "Lưu hoạt động" }));

    await waitFor(() =>
      expect(screen.getByText("Chưa thể lưu hoạt động. Dữ liệu đã nhập vẫn được giữ lại.")).toBeTruthy(),
    );
    expect(screen.getByDisplayValue("Ghi chú nháp")).toBeTruthy();
  });
});
