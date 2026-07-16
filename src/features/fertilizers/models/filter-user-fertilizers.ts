import type { FertilizerGroup, UserFertilizer } from "./user-fertilizer";

export function filterUserFertilizers(
  fertilizers: readonly UserFertilizer[],
  search: string,
  group: FertilizerGroup | null,
): readonly UserFertilizer[] {
  const query = search.trim().toLocaleLowerCase("vi-VN");
  return fertilizers.filter(
    (fertilizer) =>
      (!group || fertilizer.group === group) &&
      (!query || fertilizer.name.toLocaleLowerCase("vi-VN").includes(query)),
  );
}
