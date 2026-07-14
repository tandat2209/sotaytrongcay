import { createId } from "./identifiers";

jest.mock("expo-crypto", () => ({
  randomUUID: () => "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
}));

describe("createId", () => {
  it("uses Expo's native UUID generator instead of the browser crypto global", () => {
    expect(createId()).toBe("a775a7ec-fb44-4660-88ed-0f3b1933e7f1");
  });
});
