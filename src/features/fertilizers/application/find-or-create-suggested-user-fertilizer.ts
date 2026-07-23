import { createId } from "@/shared/lib/identifiers";
import {
  getUserFertilizerByKnowledgeId,
  saveUserFertilizer,
} from "../data/user-fertilizer-repository";
import type {
  FertilizerSuggestionIdentity,
  UserFertilizer,
} from "../models/user-fertilizer";

export async function findOrCreateSuggestedUserFertilizer(
  suggestion: FertilizerSuggestionIdentity,
): Promise<UserFertilizer> {
  const existing = await getUserFertilizerByKnowledgeId(suggestion.id);
  if (existing) return existing;

  const now = new Date().toISOString();
  const fertilizer: UserFertilizer = {
    id: createId(),
    mutationId: createId(),
    name: suggestion.name,
    group: suggestion.group,
    knowledgeId: suggestion.id,
    createdAt: now,
    updatedAt: now,
  };
  await saveUserFertilizer(fertilizer);
  return fertilizer;
}
