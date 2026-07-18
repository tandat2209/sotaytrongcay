import type { UserFertilizer } from "@/features/fertilizers";
import type { FertilizerApplicationDetails } from "./fertilizer-application";
import type { UserFertilizerUsage } from "./suggested-fertilizer-application";

export function selectRecentUserFertilizers(
  fertilizers: readonly UserFertilizer[],
  usages: Readonly<Record<string, UserFertilizerUsage>>,
  limit = 5,
): readonly UserFertilizer[] {
  return fertilizers
    .filter((fertilizer) => usages[fertilizer.id] !== undefined)
    .sort((left, right) =>
      (usages[right.id]?.occurredAt ?? "").localeCompare(
        usages[left.id]?.occurredAt ?? "",
      ),
    )
    .slice(0, limit);
}

export function toggleUserFertilizerApplication(
  applications: readonly FertilizerApplicationDetails[],
  fertilizer: UserFertilizer,
): readonly FertilizerApplicationDetails[] {
  if (
    applications.some(
      (application) => application.userFertilizerId === fertilizer.id,
    )
  ) {
    return applications.filter(
      (application) => application.userFertilizerId !== fertilizer.id,
    );
  }
  return [
    ...applications,
    {
      userFertilizerId: fertilizer.id,
      nameSnapshot: fertilizer.name,
      groupSnapshot: fertilizer.group,
      knowledgeIdSnapshot: fertilizer.knowledgeId,
      amountValue: null,
      amountUnit: null,
      applicationMethod: null,
      notes: null,
    },
  ];
}
