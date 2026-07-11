import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/shared/ui/Screen";
import { colors, radius, spacing } from "@/shared/ui/theme";
import {
  CARE_ACTIVITY_LABELS,
  CARE_ACTIVITY_ORIGIN_LABELS,
  CARE_ACTIVITY_UNIT_LABELS,
  CareActivity,
} from "../models/care-activity";

export function ActivityDetailScreen({ activity, plantName }: { activity: CareActivity; plantName: string }) {
  return (
    <Screen introduction={plantName} title={`Chi tiết ${CARE_ACTIVITY_LABELS[activity.type].toLowerCase()}`}>
      <View style={styles.card}>
        <Detail label="Thời gian" value={new Date(activity.occurredAt).toLocaleString("vi-VN")} />
        <Detail label="Nguồn" value={CARE_ACTIVITY_ORIGIN_LABELS[activity.origin]} />
        <Detail label="Lượng nước" value={activity.amount ? `${activity.amount.value.toLocaleString("vi-VN")} ${CARE_ACTIVITY_UNIT_LABELS[activity.amount.unit]}` : "Không ghi"} />
        {activity.notes ? <Detail label="Ghi chú" value={activity.notes} /> : null}
      </View>
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, gap: spacing.md, padding: spacing.md },
  row: { gap: spacing.xs }, label: { color: colors.textSecondary, fontSize: 12 }, value: { color: colors.text, fontSize: 16, lineHeight: 24 },
});
