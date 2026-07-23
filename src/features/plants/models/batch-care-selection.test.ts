import {
  parseBatchCarePlantIds,
  serializeBatchCarePlantIds,
  toggleBatchCarePlant,
} from "./batch-care-selection";

const firstId = "a775a7ec-fb44-4660-88ed-0f3b1933e7f1";
const secondId = "b775a7ec-fb44-4660-88ed-0f3b1933e7f2";

describe("batch care plant selection", () => {
  it("adds and removes one Plant without mutating the current selection", () => {
    const current = [firstId] as const;

    const added = toggleBatchCarePlant(current, secondId);

    expect(added).toEqual([firstId, secondId]);
    expect(toggleBatchCarePlant(added, firstId)).toEqual([secondId]);
    expect(current).toEqual([firstId]);
  });

  it("round-trips a valid selection through the route parameter", () => {
    const serialized = serializeBatchCarePlantIds([firstId, secondId]);

    expect(parseBatchCarePlantIds(serialized)).toEqual([firstId, secondId]);
  });

  it("rejects fewer than two unique Plants at the route boundary", () => {
    expect(() => parseBatchCarePlantIds(firstId)).toThrow();
    expect(() => parseBatchCarePlantIds(`${firstId},${firstId}`)).toThrow();
  });
});
