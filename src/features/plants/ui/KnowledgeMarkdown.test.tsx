import { render } from "@testing-library/react-native";
import { KnowledgeMarkdown } from "@/features/knowledge";

describe("KnowledgeMarkdown", () => {
  it("joins soft-wrapped paragraph lines", () => {
    const { getByText } = render(
      <KnowledgeMarkdown
        markdown={
          "Dòng đầu của đoạn văn được ngắt mềm\nnhưng vẫn phải hiển thị cùng một đoạn."
        }
      />,
    );

    expect(
      getByText(
        "Dòng đầu của đoạn văn được ngắt mềm nhưng vẫn phải hiển thị cùng một đoạn.",
      ),
    ).toBeTruthy();
  });
});
