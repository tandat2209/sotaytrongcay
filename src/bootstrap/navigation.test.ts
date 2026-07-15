import { tabDestinations } from "./navigation";

describe("tab navigation contract", () => {
  it("contains only the four approved Vietnamese destinations", () => {
    expect(tabDestinations.map(({ label, name }) => ({ label, name }))).toEqual(
      [
        { name: "today", label: "Hôm nay" },
        { name: "plants", label: "Cây trồng" },
        { name: "journal", label: "Nhật ký" },
        { name: "settings", label: "Cài đặt" },
      ],
    );
  });

  it("does not expose an action destination", () => {
    const destinationNames: readonly string[] = tabDestinations.map(
      ({ name }) => name,
    );

    expect(tabDestinations).toHaveLength(4);
    expect(destinationNames).not.toContain("add");
  });
});
