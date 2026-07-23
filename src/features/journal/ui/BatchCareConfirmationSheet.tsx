import { Pressable, StyleSheet, View } from "react-native";
import type { Plant } from "@/features/plants";
import { formatDateTime, formatNumber, t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { CareActivityType } from "../models/care-activity";
import {
  getCareActivityLabel,
  getWateringIntensityLabel,
} from "./care-activity-copy";
import type { CareEntryDetails } from "./care-entry-types";

type Props = Readonly<{
  details: CareEntryDetails;
  error: string | null;
  onConfirm: () => void;
  onEdit: () => void;
  plants: readonly Plant[];
  saving: boolean;
  type: CareActivityType;
  visible: boolean;
}>;

export function BatchCareConfirmationSheet(props: Props) {
  const rows = [
    {
      label: t("journal.batch.plantsLabel"),
      value: props.plants.map((plant) => plant.name).join("\n"),
    },
    {
      label: t("journal.batch.activityLabel"),
      value: getCareActivityLabel(props.type),
    },
    {
      label: t("journal.batch.timeLabel"),
      value: formatDateTime(new Date(props.details.occurredAt)),
    },
    ...(props.details.intensity
      ? [
          {
            label: t("journal.batch.wateringLabel"),
            value: getWateringIntensityLabel(props.details.intensity),
          },
        ]
      : []),
    ...(props.details.estimatedAmountLiters !== null
      ? [
          {
            label: t("journal.batch.amountLabel"),
            value: `${formatNumber(props.details.estimatedAmountLiters)} ${t("journal.activityUnit.liter")}`,
          },
        ]
      : []),
    ...(props.details.fertilizerApplications.length > 0
      ? [
          {
            label: t("journal.batch.fertilizersLabel"),
            value: props.details.fertilizerApplications
              .map((application) => application.nameSnapshot)
              .join(" · "),
          },
        ]
      : []),
    ...(props.details.sprayTargetNameSnapshot
      ? [
          {
            label: t("journal.batch.sprayTargetLabel"),
            value: props.details.sprayTargetNameSnapshot,
          },
        ]
      : []),
    ...(props.details.notes
      ? [
          {
            label: t("journal.batch.notesLabel"),
            value: props.details.notes,
          },
        ]
      : []),
  ];

  return (
    <BottomSheet
      footer={
        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={props.saving}
            onPress={props.onEdit}
            style={styles.edit}
          >
            <Typography color="primary" variant="bodyLarge">
              {t("journal.batch.edit")}
            </Typography>
          </Pressable>
          <PrimaryButton
            label={t("journal.batch.save", { count: props.plants.length })}
            loading={props.saving}
            onPress={props.onConfirm}
          />
        </View>
      }
      onDismiss={props.onEdit}
      title={t("journal.batch.confirmTitle")}
      visible={props.visible}
    >
      <View style={styles.rows}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Typography color="textSecondary" variant="bodyMedium">
              {row.label}
            </Typography>
            <Typography variant="bodyLarge">{row.value}</Typography>
          </View>
        ))}
      </View>
      {props.error ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {props.error}
        </Typography>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  edit: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  footer: { gap: spacing.sm },
  row: {
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  rows: { gap: spacing.xs },
});
