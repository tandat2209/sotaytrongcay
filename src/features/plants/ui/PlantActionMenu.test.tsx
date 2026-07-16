import { fireEvent, render } from "@testing-library/react-native";
import { PlantActionMenu } from "./PlantActionMenu";

jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context");
  return {
    ...actual,
    useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 0 }),
  };
});

describe("PlantActionMenu", () => {
  it("keeps the expanded menu above the bottom safe area", () => {
    const screen = render(
      <PlantActionMenu onAddJournal={jest.fn()} onRecordCare={jest.fn()} />,
    );

    fireEvent.press(
      screen.getByRole("button", { name: "Mở thao tác cho cây" }),
    );

    expect(screen.getByTestId("plant-action-menu")).toHaveStyle({
      bottom: 58,
    });
  });
});
