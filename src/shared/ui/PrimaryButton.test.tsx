import { fireEvent, render } from "@testing-library/react-native";
import { PrimaryButton } from "./PrimaryButton";

describe("PrimaryButton", () => {
  it("reports busy state and blocks duplicate presses while saving", () => {
    const onPress = jest.fn();
    const screen = render(<PrimaryButton label="Lưu cây" loading onPress={onPress} />);

    const button = screen.getByRole("button");
    expect(button.props.accessibilityState).toEqual({ busy: true, disabled: true });
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
