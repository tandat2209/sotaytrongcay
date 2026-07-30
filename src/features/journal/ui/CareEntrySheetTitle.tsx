import { StyleSheet, View } from "react-native";
import type { CareActivityType } from "../models/care-activity";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { Typography } from "@/shared/ui/Typography";
import { radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{ label: string; type: CareActivityType }>;

export function CareEntrySheetTitle({ label, type }: Props) {
  const visual = CARE_ACTIVITY_VISUALS[type];
  const ActivityIcon = visual.icon;
  return (
    <View style={styles.title}>
      <View
        accessibilityElementsHidden
        style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
      >
        <ActivityIcon color={visual.color} size={20} />
      </View>
      <Typography variant="cardTitle">{label}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: "center",
    borderRadius: radius.small,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  title: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
