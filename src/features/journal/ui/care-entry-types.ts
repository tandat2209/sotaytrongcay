import type { SprayTarget } from "@/features/knowledge";
import type {
  CareActivityType,
  WateringIntensity,
} from "../models/care-activity";
import type { FertilizerSuggestion } from "../models/suggested-fertilizer-application";
import type { FertilizerApplicationDetails } from "./FertilizingApplicationsSection";

export type CareEntryDetails = Readonly<{
  estimatedAmountLiters: number | null;
  fertilizerApplications: readonly FertilizerApplicationDetails[];
  intensity: WateringIntensity | null;
  notes: string | null;
  occurredAt: string;
  sprayTargetId: string | null;
  sprayTargetNameSnapshot: string | null;
}>;

export type CareEntryScreenProps = Readonly<{
  imageUri?: string | null;
  fertilizerSuggestions?: readonly FertilizerSuggestion[];
  initialDetails?: CareEntryDetails;
  onDismiss: () => void;
  onSave: (details: CareEntryDetails) => Promise<void>;
  reason?: string;
  plantName: string;
  speciesTitle: string;
  sprayTargets?: readonly SprayTarget[];
  suggestion?: string;
  stageId: string;
  stageTitle: string;
  type: CareActivityType;
  visible: boolean;
}>;

export function mergeInitialSprayTarget(
  props: CareEntryScreenProps,
): readonly SprayTarget[] {
  const targets = props.sprayTargets ?? [];
  const id = props.initialDetails?.sprayTargetId;
  const title = props.initialDetails?.sprayTargetNameSnapshot;
  if (!id || !title) return targets;

  return [
    { id, kind: id.startsWith("disease.") ? "disease" : "pest", title },
    ...targets.filter((target) => target.id !== id),
  ];
}
