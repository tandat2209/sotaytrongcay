import {
  getOccurrencePeriod,
  isOccurrencePeriodAvailable,
  resolveOccurrenceAt,
  setOccurrencePeriod,
} from "./occurred-at";

describe("coarse occurrence periods", () => {
  it.each([
    [new Date(2026, 6, 15, 0, 0), "morning"],
    [new Date(2026, 6, 15, 11, 59), "morning"],
    [new Date(2026, 6, 15, 12, 0), "afternoon"],
    [new Date(2026, 6, 15, 20, 59), "afternoon"],
    [new Date(2026, 6, 15, 21, 0), "evening"],
    [new Date(2026, 6, 15, 23, 59), "evening"],
  ] as const)("maps %s to %s", (value, expected) => {
    expect(getOccurrencePeriod(value)).toBe(expected);
  });

  it.each([
    ["morning", 8],
    ["afternoon", 18],
    ["evening", 22],
  ] as const)("stores %s at its local ordering boundary", (period, hour) => {
    const value = new Date(2026, 6, 15, 9, 42, 18, 400);

    const result = setOccurrencePeriod(value, period);

    expect(result).toEqual(new Date(2026, 6, 15, hour, 0, 0, 0));
    expect(value).toEqual(new Date(2026, 6, 15, 9, 42, 18, 400));
  });

  it("allows only reached periods for today", () => {
    const today = new Date(2026, 6, 15, 15, 30);

    expect(isOccurrencePeriodAvailable(today, "morning", today)).toBe(true);
    expect(isOccurrencePeriodAvailable(today, "afternoon", today)).toBe(true);
    expect(isOccurrencePeriodAvailable(today, "evening", today)).toBe(false);
  });

  it("allows every period for a past date", () => {
    const selectedDate = new Date(2026, 6, 14);
    const now = new Date(2026, 6, 15, 9, 30);

    expect(isOccurrencePeriodAvailable(selectedDate, "morning", now)).toBe(
      true,
    );
    expect(isOccurrencePeriodAvailable(selectedDate, "afternoon", now)).toBe(
      true,
    );
    expect(isOccurrencePeriodAvailable(selectedDate, "evening", now)).toBe(
      true,
    );
  });

  it("uses now when today's period anchor has not arrived", () => {
    const now = new Date(2026, 6, 15, 15, 30, 20, 100);

    expect(resolveOccurrenceAt(now, "afternoon", now)).toEqual(now);
  });

  it("uses the representative time for a past date", () => {
    const selectedDate = new Date(2026, 6, 14);
    const now = new Date(2026, 6, 15, 15, 30);

    expect(resolveOccurrenceAt(selectedDate, "afternoon", now)).toEqual(
      new Date(2026, 6, 14, 18),
    );
  });
});
