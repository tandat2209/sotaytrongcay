import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { getCareActivityLabel } from "@/features/journal";
import type {
  CareActivityType,
  WateringIntensity,
} from "@/features/journal/models/care-activity";
import { CARE_ACTIVITY_VISUALS } from "@/features/journal/models/care-activity-icon";
import { PlantIdentity } from "@/features/plants/ui/PlantIdentity";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";
import { CareEntryContextFields } from "./CareEntryContextFields";
import { CareEntryDetailsSection } from "./CareEntryDetailsSection";
import {
  FertilizingApplicationsSection,
  type FertilizerApplicationDetails,
} from "./FertilizingApplicationsSection";
import { WateringIntensityPicker } from "./WateringIntensityPicker";
import type { FertilizerSuggestion } from "../models/suggested-fertilizer-application";

export type CareEntryDetails = Readonly<{
  estimatedAmountLiters: number | null;
  fertilizerApplications: readonly FertilizerApplicationDetails[];
  intensity: WateringIntensity | null;
  notes: string | null;
  occurredAt: string;
}>;

type Props = Readonly<{
  imageUri?: string | null;
  fertilizerSuggestions?: readonly FertilizerSuggestion[];
  initialDetails?: CareEntryDetails;
  onDismiss: () => void;
  onSave: (details: CareEntryDetails) => Promise<void>;
  reason?: string;
  plantName: string;
  speciesTitle: string;
  suggestion?: string;
  stageId: string;
  stageTitle: string;
  type: CareActivityType;
  visible: boolean;
}>;

export function CareEntryScreen(props: Props) {
  const [amount, setAmount] = useState(() =>
    props.initialDetails?.estimatedAmountLiters?.toString() ?? "",
  );
  const [intensity, setIntensity] = useState<WateringIntensity | null>(
    () => props.initialDetails?.intensity ?? null,
  );
  const [fertilizerApplications, setFertilizerApplications] = useState<
    readonly FertilizerApplicationDetails[]
  >(() => props.initialDetails?.fertilizerApplications ?? []);
  const [notes, setNotes] = useState(() => props.initialDetails?.notes ?? "");
  const [occurredAt, setOccurredAt] = useState(
    () => new Date(props.initialDetails?.occurredAt ?? Date.now()),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const visual = CARE_ACTIVITY_VISUALS[props.type];
  const ActivityIcon = visual.icon;

  async function submit() {
    const parsedAmount =
      props.type === "watering" && amount.trim()
        ? Number(amount.replace(",", "."))
        : null;
    if (props.type === "watering" && intensity === null) {
      setError(t("journal.validation.wateringIntensity"));
      return;
    }
    if (
      parsedAmount !== null &&
      (!Number.isFinite(parsedAmount) || parsedAmount <= 0)
    ) {
      setError(t("journal.validation.waterAmount"));
      return;
    }
    if (occurredAt.getTime() > Date.now()) {
      setError(t("journal.validation.futureActivity"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await props.onSave({
        estimatedAmountLiters: parsedAmount,
        fertilizerApplications,
        intensity: props.type === "watering" ? intensity : null,
        notes: notes.trim() || null,
        occurredAt: occurredAt.toISOString(),
      });
    } catch {
      setError(t("journal.error.saveActivity"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet
      footer={
        <PrimaryButton
          backgroundColor={visual.backgroundColor}
          label={t("journal.careEntry.save")}
          loading={saving}
          onPress={submit}
          textColor={visual.color}
        />
      }
      onDismiss={props.onDismiss}
      title={
        <View style={styles.title}>
          <ActivityIcon color={visual.color} size={22} />
          <Typography variant="headlineSmall">
            {getCareActivityLabel(props.type)}
          </Typography>
        </View>
      }
      visible={props.visible}
    >
      <PlantIdentity
        imageUri={props.imageUri ?? null}
        name={props.plantName}
        size="list"
        speciesTitle={props.speciesTitle}
        stageId={props.stageId}
        stageTitle={props.stageTitle}
      />
      <CareEntryContextFields
        dateError={
          error === t("journal.validation.futureActivity") ? error : null
        }
        occurredAt={occurredAt}
        onOccurredAtChange={setOccurredAt}
        {...(props.reason ? { reason: props.reason } : {})}
        {...(props.suggestion ? { suggestion: props.suggestion } : {})}
      />
      {props.type === "watering" ? (
        <WateringIntensityPicker
          error={
            error === t("journal.validation.wateringIntensity") ? error : null
          }
          onChange={setIntensity}
          value={intensity}
        />
      ) : null}
      {props.type === "fertilizing" ? (
        <FertilizingApplicationsSection
          onChange={setFertilizerApplications}
          suggestions={props.fertilizerSuggestions ?? []}
          value={fertilizerApplications}
        />
      ) : null}
      <CareEntryDetailsSection
        amount={amount}
        amountError={
          error === t("journal.validation.waterAmount") ? error : null
        }
        notes={notes}
        onAmountChange={setAmount}
        onNotesChange={setNotes}
        type={props.type}
      />
      {error === t("journal.error.saveActivity") ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {error}
        </Typography>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
