import type { SprayTarget } from "@/features/knowledge";
import type { ReactNode } from "react";
import type {
  CareActivityType,
  WateringIntensity,
} from "../models/care-activity";
import type { FertilizerApplicationDetails } from "../models/fertilizer-application";
import type { FertilizerSuggestion } from "../models/suggested-fertilizer-application";

export type CareEntryDetails = Readonly<{
  estimatedAmountLiters: number | null;
  fertilizerApplications: readonly FertilizerApplicationDetails[];
  intensity: WateringIntensity | null;
  notes: string | null;
  occurredAt: string;
  sprayTargetId: string | null;
  sprayTargetNameSnapshot: string | null;
}>;

type CareEntryBaseProps = Readonly<{
  amountAccessibilityLabel?: string;
  amountLabel?: string;
  fertilizerSuggestions?: readonly FertilizerSuggestion[];
  initialDetails?: CareEntryDetails;
  onDismiss: () => void;
  onSave: (details: CareEntryDetails) => Promise<void>;
  reason?: string;
  saveLabel?: string;
  sprayTargets?: readonly SprayTarget[];
  suggestion?: string;
  type: CareActivityType;
  visible: boolean;
}>;

type SinglePlantCareEntryProps = Readonly<{
  context?: never;
  contextKind?: "single";
  imageUri?: string | null;
  plantName: string;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
}>;

type CustomCareEntryProps = Readonly<{
  context: ReactNode;
  contextKind: "custom";
  imageUri?: never;
  plantName?: never;
  speciesTitle?: never;
  stageId?: never;
  stageTitle?: never;
}>;

export type CareEntryScreenProps = CareEntryBaseProps &
  (SinglePlantCareEntryProps | CustomCareEntryProps);

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
