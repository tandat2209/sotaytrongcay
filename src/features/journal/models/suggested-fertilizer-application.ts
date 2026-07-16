import type { FertilizerGroup } from "@/features/fertilizers";
import type { FertilizerApplicationDetails } from "../ui/FertilizingApplicationsSection";

export type FertilizerSuggestion = Readonly<{
  id: string;
  name: string;
  group: FertilizerGroup;
}>;

export function toggleSuggestedFertilizerApplication(
  applications: readonly FertilizerApplicationDetails[],
  suggestion: FertilizerSuggestion,
): readonly FertilizerApplicationDetails[] {
  const selectedIndex = applications.findIndex(
    (application) =>
      application.userFertilizerId === null &&
      application.nameSnapshot === suggestion.name,
  );
  if (selectedIndex >= 0) {
    return applications.filter((_, index) => index !== selectedIndex);
  }
  return [
    ...applications,
    {
      userFertilizerId: null,
      nameSnapshot: suggestion.name,
      groupSnapshot: suggestion.group,
      npkSnapshot: null,
      amountValue: null,
      amountUnit: null,
      applicationMethod: null,
      notes: null,
    },
  ];
}
