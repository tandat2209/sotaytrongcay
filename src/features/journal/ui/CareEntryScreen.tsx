import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { getCareActivityLabel } from "./care-activity-copy";
import type { WateringIntensity } from "@/features/journal/models/care-activity";
import { PlantIdentity } from "@/features/plants/ui/PlantIdentity";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { CareEntryContextFields } from "./CareEntryContextFields";
import { CareEntryDetailsSection } from "./CareEntryDetailsSection";
import { CareEntrySheetTitle } from "./CareEntrySheetTitle";
import { FertilizingApplicationsSection } from "./FertilizingApplicationsSection";
import { WateringIntensityPicker } from "./WateringIntensityPicker";
import { SprayTargetPicker } from "./SprayTargetPicker";
import {
  mergeInitialSprayTarget,
  type CareEntryDetails,
  type CareEntryScreenProps,
} from "./care-entry-types";

export function CareEntryScreen(props: CareEntryScreenProps) {
  const [amount, setAmount] = useState(
    () => props.initialDetails?.estimatedAmountLiters?.toString() ?? "",
  );
  const [intensity, setIntensity] = useState<WateringIntensity | null>(
    () => props.initialDetails?.intensity ?? null,
  );
  const [fertilizerApplications, setFertilizerApplications] = useState<
    CareEntryDetails["fertilizerApplications"]
  >(() => props.initialDetails?.fertilizerApplications ?? []);
  const [notes, setNotes] = useState(() => props.initialDetails?.notes ?? "");
  const [occurredAt, setOccurredAt] = useState(
    () => new Date(props.initialDetails?.occurredAt ?? Date.now()),
  );
  const [sprayTargetId, setSprayTargetId] = useState(
    () => props.initialDetails?.sprayTargetId ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const sprayTargets = mergeInitialSprayTarget(props);

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
      const sprayTarget =
        props.type === "spraying"
          ? sprayTargets.find((target) => target.id === sprayTargetId)
          : undefined;
      await props.onSave({
        estimatedAmountLiters: parsedAmount,
        fertilizerApplications,
        intensity: props.type === "watering" ? intensity : null,
        notes: notes.trim() || null,
        occurredAt: occurredAt.toISOString(),
        sprayTargetId: sprayTarget?.id ?? null,
        sprayTargetNameSnapshot: sprayTarget?.title ?? null,
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
          label={props.saveLabel ?? t("journal.careEntry.save")}
          loading={saving}
          onPress={submit}
        />
      }
      onDismiss={props.onDismiss}
      title={
        <CareEntrySheetTitle
          label={getCareActivityLabel(props.type)}
          type={props.type}
        />
      }
      visible={props.visible}
    >
      {props.contextKind === "custom" ? (
        props.context
      ) : (
        <View style={styles.plantContext}>
          <PlantIdentity
            imageUri={props.imageUri ?? null}
            name={props.plantName}
            size="list"
            speciesTitle={props.speciesTitle}
            stageId={props.stageId}
            stageTitle={props.stageTitle}
          />
        </View>
      )}
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
      {props.type === "spraying" ? (
        <SprayTargetPicker
          onChange={setSprayTargetId}
          targets={sprayTargets}
          value={sprayTargetId}
        />
      ) : null}
      <CareEntryDetailsSection
        {...(props.amountAccessibilityLabel
          ? { amountAccessibilityLabel: props.amountAccessibilityLabel }
          : {})}
        amount={amount}
        amountError={
          error === t("journal.validation.waterAmount") ? error : null
        }
        notes={notes}
        {...(props.amountLabel ? { amountLabel: props.amountLabel } : {})}
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
  plantContext: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.medium,
    padding: spacing.md,
  },
});
