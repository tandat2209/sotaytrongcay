import { render } from "@testing-library/react-native";
import { StyleSheet, Text } from "react-native";
import { Screen } from "./Screen";

jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context");
  return {
    ...actual,
    useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 0 }),
  };
});

describe("Screen", () => {
  it("positions a floating action above the bottom safe area", () => {
    const screen = render(
      <Screen floatingAction={<Text>Quick care</Text>} title="Chi tiết cây">
        <Text>Nội dung</Text>
      </Screen>,
    );

    const actionContainer =
      screen.getByText("Quick care").parent?.parent?.parent;

    expect(StyleSheet.flatten(actionContainer?.props.style)).toMatchObject({
      bottom: 58,
    });
  });
});
