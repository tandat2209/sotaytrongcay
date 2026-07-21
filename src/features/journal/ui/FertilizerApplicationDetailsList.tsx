import { StyleSheet, View } from "react-native";
import type { FertilizerApplication } from "../models/fertilizer-application";
import { formatNumber, t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

export function FertilizerApplicationDetailsList({
  applications,
}: Readonly<{ applications: readonly FertilizerApplication[] }>) {
  if (applications.length === 0) return null;
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">
        {t("journal.activityDetail.fertilizers")}
      </Typography>
      {applications.map((application) => (
        <View key={application.id} style={styles.card}>
          <Typography variant="cardTitle">
            {application.nameSnapshot}
          </Typography>
          {application.applicationMethod ? (
            <Detail
              label={t("journal.fertilizing.method")}
              value={t(
                `journal.fertilizing.method.${application.applicationMethod}`,
              )}
            />
          ) : null}
          {application.amountValue !== null && application.amountUnit ? (
            <Detail
              label={t("journal.fertilizing.amount")}
              value={`${formatNumber(application.amountValue)} ${t(
                `journal.fertilizing.unit.${application.amountUnit}`,
              )}`}
            />
          ) : null}
          {application.notes ? (
            <Detail
              label={t("journal.activityDetail.notes")}
              value={application.notes}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

function Detail({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.detail}>
      <Typography color="textSecondary" variant="label">
        {label}
      </Typography>
      <Typography variant="secondary">{value}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.activityFertilizingSoft,
    borderRadius: radius.card,
    gap: spacing.sm,
    padding: spacing.base,
  },
  detail: { gap: spacing.xs },
  section: { gap: spacing.md },
});
