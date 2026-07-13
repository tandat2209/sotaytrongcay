import Ionicons from "@expo/vector-icons/Ionicons";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareDetails } from "../models/plant-detail-projection";

export function CareRecommendationDetails({ details }: { details: PlantDetailCareDetails }) {
  return (
    <View style={styles.content}>
      <DetailSection label="MỤC TIÊU"><Typography variant="bodyLarge">{details.goal}</Typography></DetailSection>
      <DetailSection label="TẦN SUẤT THEO CÁCH TRỒNG">
        <Typography variant="bodyLarge">{details.frequencyDisplay ?? "Chưa có tần suất đã duyệt"}</Typography>
      </DetailSection>
      {details.recommendedInputs.length ? <DetailSection label="ĐẦU VÀO GỢI Ý">
        {details.recommendedInputs.map((input) => <View key={input.group} style={styles.item}>
          <Typography variant="bodyLarge">{input.group}</Typography>
          <Typography color="textSecondary" variant="bodyMedium">{input.examples}</Typography>
        </View>)}
      </DetailSection> : null}
      {details.notes.length ? <DetailSection label="LƯU Ý">
        {details.notes.map((note) => <View key={note} style={styles.note}>
          <Ionicons color={colors.primary} name="information-circle-outline" size={18} />
          <Typography color="textSecondary" style={styles.noteCopy} variant="bodyMedium">{note}</Typography>
        </View>)}
      </DetailSection> : null}
    </View>
  );
}

function DetailSection({ children, label }: PropsWithChildren<{ label: string }>) {
  return <View style={styles.section}><Typography color="primary" variant="label">{label}</Typography>{children}</View>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingBottom: spacing.md },
  item: { gap: spacing.xs },
  note: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  noteCopy: { flex: 1 },
  section: { gap: spacing.sm },
});
