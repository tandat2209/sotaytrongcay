import { fireEvent, render } from "@testing-library/react-native";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("announces its Vietnamese label and does not press when disabled", () => {
    const onPress = jest.fn();
    const screen = render(<IconButton accessibilityLabel="Quay lại Cây trồng" disabled icon="chevron-back" onPress={onPress} />);

    const button = screen.getByRole("button", { name: "Quay lại Cây trồng" });
    expect(button.props.accessibilityState).toEqual({ disabled: true });
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
