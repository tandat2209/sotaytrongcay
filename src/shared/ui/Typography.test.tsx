import { render } from "@testing-library/react-native";
import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders a semantic headline variant", () => {
    const screen = render(
      <Typography variant="headlineMedium">Cây trồng</Typography>,
    );

    expect(screen.getByText("Cây trồng")).toBeTruthy();
  });
});
