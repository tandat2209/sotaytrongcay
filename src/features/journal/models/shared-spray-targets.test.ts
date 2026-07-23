import { intersectSharedSprayTargets } from "./shared-spray-targets";

const thrips = {
  id: "pest.grape.thrips",
  kind: "pest" as const,
  title: "Bọ trĩ hại nho",
};
const mildew = {
  id: "disease.grape.powdery-mildew",
  kind: "disease" as const,
  title: "Bệnh phấn trắng",
};

describe("intersectSharedSprayTargets", () => {
  it("keeps only targets available to every selected Plant species", () => {
    expect(intersectSharedSprayTargets([[thrips, mildew], [mildew]])).toEqual([
      mildew,
    ]);
  });

  it("returns no target when any selected species has no catalog", () => {
    expect(intersectSharedSprayTargets([[thrips], []])).toEqual([]);
  });
});
