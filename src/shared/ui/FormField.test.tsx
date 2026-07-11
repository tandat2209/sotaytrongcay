import { render } from "@testing-library/react-native";
import { TextInput } from "react-native";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("keeps its label visible and exposes validation errors", () => {
    const screen = render(
      <FormField error="Hãy đặt tên cho cây" label="Tên cây" supportingText="Tên dùng để nhận biết cây.">
        <TextInput accessibilityLabel="Tên cây" />
      </FormField>,
    );

    expect(screen.getByText("Tên cây")).toBeTruthy();
    expect(screen.getByText("Tên dùng để nhận biết cây.")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveTextContent("Hãy đặt tên cho cây");
  });
});
