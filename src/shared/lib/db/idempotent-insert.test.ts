import { resolveIdempotentInsertOutcome } from "./idempotent-insert";

describe("idempotent insert outcome", () => {
  it("reports a newly inserted row", () => {
    expect(
      resolveIdempotentInsertOutcome({
        changes: 1,
        expectedId: "activity-1",
        savedId: null,
      }),
    ).toBe("inserted");
  });

  it("accepts a retry only when the mutation belongs to the same row", () => {
    expect(
      resolveIdempotentInsertOutcome({
        changes: 0,
        expectedId: "activity-1",
        savedId: "activity-1",
      }),
    ).toBe("duplicate");
  });

  it.each([null, "activity-2"])(
    "rejects a no-op when the saved row is %s",
    (savedId) => {
      expect(() =>
        resolveIdempotentInsertOutcome({
          changes: 0,
          expectedId: "activity-1",
          savedId,
        }),
      ).toThrow("Idempotent insert conflict");
    },
  );

  it("rejects an unexpected affected-row count", () => {
    expect(() =>
      resolveIdempotentInsertOutcome({
        changes: 2,
        expectedId: "activity-1",
        savedId: null,
      }),
    ).toThrow("Unexpected insert change count");
  });
});
