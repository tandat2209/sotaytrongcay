import type {
  FertilizerGroup,
  FertilizerSuggestionIdentity,
  UserFertilizer,
} from "./user-fertilizer";

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

export function filterAvailableFertilizerSuggestions<
  Suggestion extends FertilizerSuggestionIdentity,
>(
  suggestions: readonly Suggestion[],
  fertilizers: readonly UserFertilizer[],
  search: string,
  group: FertilizerGroup | null,
): readonly Suggestion[] {
  const savedKnowledgeIds = new Set(
    fertilizers.flatMap(({ knowledgeId }) =>
      knowledgeId ? [knowledgeId] : [],
    ),
  );
  const query = search.trim().toLocaleLowerCase("vi-VN");
  return suggestions.filter(
    (suggestion) =>
      !savedKnowledgeIds.has(suggestion.id) &&
      (!group || suggestion.group === group) &&
      (!query || suggestion.name.toLocaleLowerCase("vi-VN").includes(query)),
  );
}
