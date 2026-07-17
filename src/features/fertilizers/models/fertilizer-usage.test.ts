import { getFertilizerUsageElapsedDays } from "./fertilizer-usage";

describe("getFertilizerUsageElapsedDays", () => {
  it("reports elapsed whole days for a saved fertilizer usage", () => {
    expect(
      getFertilizerUsageElapsedDays(
        "2026-07-14T08:00:00.000Z",
        new Date("2026-07-16T10:00:00.000Z"),
      ),
    ).toBe(2);
  });
});
