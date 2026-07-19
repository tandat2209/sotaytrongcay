import { fireEvent, render } from "@testing-library/react-native";
import { FertilizerSuggestionChips } from "./FertilizerSuggestionChips";

describe("FertilizerSuggestionChips", () => {
  it("renders wrapping buttons and reports the tapped fertilizer", () => {
    const onToggle = jest.fn();
    const onAdd = jest.fn();
    const suggestions = [
      {
        id: "fertilizer.potassium-sulfate",
        name: "Kali sunfat",
        group: "nitrogen-rich" as const,
      },
      {
        id: "fertilizer.compost",
        name: "Phân compost",
        group: "organic" as const,
      },
    ];
    const screen = render(
      <FertilizerSuggestionChips
        customNames={[]}
        onAdd={onAdd}
        onToggle={onToggle}
        onToggleCustom={jest.fn()}
        savingSuggestionId={null}
        selectedKnowledgeIds={["fertilizer.potassium-sulfate"]}
        suggestions={suggestions}
        usages={{}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Kali sunfat, đã chọn" }),
    ).toBeTruthy();
    fireEvent.press(
      screen.getByRole("button", { name: "Phân compost, chưa chọn" }),
    );
    expect(onToggle).toHaveBeenCalledWith(suggestions[1]);
    fireEvent.press(screen.getByRole("button", { name: "Thêm loại phân" }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("renders a user-created fertilizer as a selected chip", () => {
    const screen = render(
      <FertilizerSuggestionChips
        customNames={["Phân hữu cơ tự ủ"]}
        onAdd={jest.fn()}
        onToggle={jest.fn()}
        onToggleCustom={jest.fn()}
        savingSuggestionId={null}
        selectedKnowledgeIds={[]}
        suggestions={[]}
        usages={{}}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Phân hữu cơ tự ủ, đã chọn",
      }),
    ).toBeTruthy();
  });
});
