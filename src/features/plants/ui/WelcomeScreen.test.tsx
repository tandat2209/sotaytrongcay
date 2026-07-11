import { fireEvent, render } from "@testing-library/react-native";
import { WelcomeScreen } from "./WelcomeScreen";

describe("WelcomeScreen", () => {
  it("starts first plant creation", () => {
    const onStart = jest.fn();
    const screen = render(<WelcomeScreen onStart={onStart} />);

    fireEvent.press(screen.getByRole("button", { name: "Bắt đầu với cây đầu tiên" }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
