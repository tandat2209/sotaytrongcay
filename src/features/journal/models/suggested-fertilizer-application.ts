import type { FertilizerGroup } from "@/features/fertilizers";
import type { FertilizerApplicationDetails } from "../ui/FertilizingApplicationsSection";

export type FertilizerSuggestion = Readonly<{
  id: string;
  name: string;
  group: FertilizerGroup;
}>;

export type FertilizerSuggestionUsage = Readonly<{
  knowledgeId: string;
  occurredAt: string;
  plantName: string;
}>;

export type UserFertilizerUsage = Readonly<{
  fertilizerId: string;
  occurredAt: string;
  plantName: string;
}>;

export function toggleSuggestedFertilizerApplication(
  applications: readonly FertilizerApplicationDetails[],
  suggestion: FertilizerSuggestion,
  userFertilizerId: string | null,
): readonly FertilizerApplicationDetails[] {
  const selectedIndex = applications.findIndex(
    (application) => application.knowledgeIdSnapshot === suggestion.id,
  );
  if (selectedIndex >= 0) {
    return applications.filter((_, index) => index !== selectedIndex);
  }
  if (!userFertilizerId) {
    throw new Error("A catalog fertilizer is required to select a suggestion.");
  }
  return [
    ...applications,
    {
      userFertilizerId,
      nameSnapshot: suggestion.name,
      groupSnapshot: suggestion.group,
      knowledgeIdSnapshot: suggestion.id,
      amountValue: null,
      amountUnit: null,
      applicationMethod: null,
      notes: null,
    },
  ];
}

export function selectLatestFertilizerSuggestionUsages(
  rows: readonly FertilizerSuggestionUsage[],
): Readonly<Record<string, FertilizerSuggestionUsage>> {
  const latest: Record<string, FertilizerSuggestionUsage> = {};
  for (const usage of rows) {
    const current = latest[usage.knowledgeId];
    if (!current || usage.occurredAt > current.occurredAt) {
      latest[usage.knowledgeId] = usage;
    }
  }
  return latest;
}

export function selectLatestUserFertilizerUsages(
  rows: readonly UserFertilizerUsage[],
): Readonly<Record<string, UserFertilizerUsage>> {
  const latest: Record<string, UserFertilizerUsage> = {};
  for (const usage of rows) {
    const current = latest[usage.fertilizerId];
    if (!current || usage.occurredAt > current.occurredAt) {
      latest[usage.fertilizerId] = usage;
    }
  }
  return latest;
}

export function getFertilizerUsageElapsedDays(
  occurredAt: string,
  now: Date = new Date(),
): number {
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(occurredAt).getTime()) / 86_400_000),
  );
}
