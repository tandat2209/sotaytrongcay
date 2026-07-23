import { useState } from "react";
import type { SprayTarget } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import { t } from "@/shared/i18n";
import { createId } from "@/shared/lib/identifiers";
import {
  createCareActivityBatchCommands,
  type CareActivityBatchCommand,
} from "../application/save-care-activity-batch";
import type { CareActivityType } from "../models/care-activity";
import { BatchActivityTypeScreen } from "./BatchActivityTypeScreen";
import { BatchCareConfirmationSheet } from "./BatchCareConfirmationSheet";
import { BatchCarePlantSummary } from "./BatchCarePlantSummary";
import { CareEntryScreen } from "./CareEntryScreen";
import type { CareEntryDetails } from "./care-entry-types";

type Review = Readonly<{
  commands: readonly CareActivityBatchCommand[];
  details: CareEntryDetails;
}>;

type Props = Readonly<{
  onBack: () => void;
  onSave: (commands: readonly CareActivityBatchCommand[]) => Promise<void>;
  plants: readonly Plant[];
  sprayTargets: readonly SprayTarget[];
}>;

export function BatchCareFlowScreen(props: Props) {
  const [type, setType] = useState<CareActivityType | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!review) return;
    setError(null);
    setSaving(true);
    try {
      await props.onSave(review.commands);
    } catch {
      setError(t("journal.batch.saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <BatchActivityTypeScreen
        onBack={props.onBack}
        onChoose={setType}
        plants={props.plants}
      />
      {type ? (
        <CareEntryScreen
          amountAccessibilityLabel={t("journal.batch.amountAccessibility")}
          amountLabel={t("journal.batch.amountLabel")}
          context={<BatchCarePlantSummary plants={props.plants} />}
          contextKind="custom"
          fertilizerSuggestions={[]}
          onDismiss={() => setType(null)}
          onSave={async (details) => {
            setError(null);
            setReview({
              commands: createCareActivityBatchCommands({
                createId,
                createdAt: new Date().toISOString(),
                details,
                plantIds: props.plants.map((plant) => plant.id),
                type,
              }),
              details,
            });
          }}
          saveLabel={t("journal.batch.review")}
          sprayTargets={props.sprayTargets}
          type={type}
          visible={review === null}
        />
      ) : null}
      {type && review ? (
        <BatchCareConfirmationSheet
          details={review.details}
          error={error}
          onConfirm={() => void confirm()}
          onEdit={() => {
            setError(null);
            setReview(null);
          }}
          plants={props.plants}
          saving={saving}
          type={type}
          visible
        />
      ) : null}
    </>
  );
}
