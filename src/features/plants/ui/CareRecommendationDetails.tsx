import { Info } from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareDetails } from "../models/plant-detail-projection";
import { FertilizerGroupGuidanceList } from "./FertilizerGroupGuidanceList";
import { FertilizerRoleRecommendations } from "./FertilizerRoleRecommendations";

export function CareRecommendationDetails({
  details,
}: {
  details: PlantDetailCareDetails;
}) {
  return (
    <View style={styles.content}>
      <DetailSection label={t("plants.guide.objective")}>
        <Typography variant="bodyLarge">{details.goal}</Typography>
      </DetailSection>
      <DetailSection label={t("plants.guide.frequency")}>
        <Typography variant="bodyLarge">
          {details.frequencyDisplay ?? t("plants.care.frequencyMissing")}
        </Typography>
      </DetailSection>
      {details.recommendedInputs.length ? (
        <DetailSection label={t("plants.guide.recommendedInputs")}>
          <FertilizerRoleRecommendations
            recommendations={details.recommendedInputs}
          />
        </DetailSection>
      ) : null}
      {details.fertilizerGroupGuidance.length ? (
        <DetailSection label={t("plants.guide.fertilizerGroupGuidance")}>
          <Typography color="textSecondary" variant="bodyMedium">
            {t("plants.guide.fertilizerGroupGuidanceDisclaimer")}
          </Typography>
          <FertilizerGroupGuidanceList
            guidance={details.fertilizerGroupGuidance}
            toneColor={colors.activityFertilizing}
          />
        </DetailSection>
      ) : null}
      {details.notes.length ? (
        <DetailSection label={t("plants.guide.notes")}>
          {details.notes.map((note) => (
            <View key={note} style={styles.note}>
              <Info color={colors.primary} size={18} />
              <Typography
                color="textSecondary"
                style={styles.noteCopy}
                variant="bodyMedium"
              >
                {note}
              </Typography>
            </View>
          ))}
        </DetailSection>
      ) : null}
    </View>
  );
}

function DetailSection({
  children,
  label,
}: PropsWithChildren<{ label: string }>) {
  return (
    <View style={styles.section}>
      <Typography color="primary" variant="label">
        {label}
      </Typography>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.base },
  note: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  noteCopy: { flex: 1 },
  section: { gap: spacing.sm },
});
