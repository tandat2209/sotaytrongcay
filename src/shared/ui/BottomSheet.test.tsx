import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  it("stays hidden until visible and lets its caller dismiss it", () => {
    const onDismiss = jest.fn();
    const screen = render(
      <BottomSheet onDismiss={onDismiss} title="Chọn giai đoạn" visible={false}>
        <Text>Nội dung bảng chọn</Text>
      </BottomSheet>,
    );

    expect(screen.queryByText("Chọn giai đoạn")).toBeNull();

    screen.rerender(
      <BottomSheet onDismiss={onDismiss} title="Chọn giai đoạn" visible>
        <Text>Nội dung bảng chọn</Text>
      </BottomSheet>,
    );

    expect(screen.getByText("Nội dung bảng chọn")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Đóng" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
