import { StyleSheet, View } from "react-native";
import type { FertilizerApplication } from "../models/fertilizer-application";
import { formatNumber, t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

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
        <SurfaceCard key={application.id} style={styles.card}>
          <Typography variant="bodyLarge">
            {application.nameSnapshot}
          </Typography>
          {application.npkSnapshot ? (
            <Typography color="textSecondary" variant="bodyMedium">
              {application.npkSnapshot}
            </Typography>
          ) : null}
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
        </SurfaceCard>
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
      <Typography variant="bodyMedium">{value}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  detail: { gap: spacing.xs },
  section: { gap: spacing.sm },
});
