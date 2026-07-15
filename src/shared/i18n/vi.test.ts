import { appLocale, formatNumber, t } from "./index";
import { vi } from "./vi";

describe("Vietnamese translations", () => {
  it("contains only non-empty messages with declared parameters", () => {
    for (const [message, parameters] of Object.values(vi)) {
      expect(message.trim()).not.toBe("");
      expect(
        [...message.matchAll(/\{([a-zA-Z]+)\}/g)].map((match) => match[1]),
      ).toEqual(parameters);
    }
  });

  it("resolves static and parameterized messages", () => {
    expect(t("navigation.tabs.today")).toBe("Hôm nay");
    expect(
      t("plants.list.openAccessibility", { plant: "Nho sân thượng" }),
    ).toBe("Mở cây Nho sân thượng");
  });

  it("uses the fixed Vietnamese locale", () => {
    expect(appLocale).toBe("vi-VN");
    expect(formatNumber(1234)).toBe("1.234");
  });
});
