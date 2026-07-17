import { mergeLocalDateAndTime } from "./occurred-at";

describe("mergeLocalDateAndTime", () => {
  it("uses the selected local date and selected local time", () => {
    const selectedDate = new Date(2026, 6, 15, 8, 10, 20, 300);
    const selectedTime = new Date(2024, 1, 2, 21, 45, 35, 700);

    const result = mergeLocalDateAndTime(selectedDate, selectedTime);

    expect(result).toEqual(new Date(2026, 6, 15, 21, 45, 35, 700));
    expect(selectedDate).toEqual(new Date(2026, 6, 15, 8, 10, 20, 300));
    expect(selectedTime).toEqual(new Date(2024, 1, 2, 21, 45, 35, 700));
  });
});
