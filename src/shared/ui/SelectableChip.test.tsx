import { fireEvent, render } from "@testing-library/react-native";
import { Leaf } from "lucide-react-native";
import { SelectableChip } from "./SelectableChip";
import { colors } from "./theme";

describe("SelectableChip", () => {
  it("renders an accessible selected option and invokes its action", () => {
    const onPress = jest.fn();
    const screen = render(
      <SelectableChip
        accessibilityLabel="Hữu cơ, đã chọn"
        icon={Leaf}
        label="Hữu cơ"
        onPress={onPress}
        role="radio"
        selected
      />,
    );

    fireEvent.press(screen.getByRole("radio", { name: "Hữu cơ, đã chọn" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports a solid selected treatment for selection chips", () => {
    const screen = render(
      <SelectableChip
        accessibilityLabel="Kali sunfat, đã chọn"
        label="Kali sunfat"
        onPress={jest.fn()}
        selected
        selectedTone="solid"
        selectedPrefix="✓ "
      />,
    );

    expect(
      screen.getByRole("button", { name: "Kali sunfat, đã chọn" }),
    ).toHaveStyle({ backgroundColor: colors.primary });
    expect(screen.getByText("✓ Kali sunfat")).toBeTruthy();
  });
});
