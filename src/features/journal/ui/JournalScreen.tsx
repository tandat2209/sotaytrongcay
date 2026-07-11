import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { colors, radius, spacing } from "@/shared/ui/theme";
import {
  CARE_ACTIVITY_LABELS,
  CARE_ACTIVITY_ORIGIN_LABELS,
  CareActivity,
} from "../models/care-activity";

type Props = { activities?: CareActivity[]; onOpenActivity?: (id: string) => void; plantNames?: Readonly<Record<string, string>> };

export function JournalScreen({ activities = [], onOpenActivity = () => undefined, plantNames = {} }: Props) {
  return (
    <Screen introduction="Lịch sử hoạt động do bạn đã lưu." title="Nhật ký">
      {activities.length === 0 ? <EmptyState description="Hoạt động tưới nước, bón phân và phun thuốc đã lưu sẽ xuất hiện ở đây." title="Nhật ký của bạn chưa có nội dung" /> : (
        <View style={styles.list}>{activities.map((activity) => {
          const plantName = plantNames[activity.plantId] ?? "Cây trồng";
          const label = CARE_ACTIVITY_LABELS[activity.type];
          return <Pressable accessibilityLabel={`${label} · ${plantName}`} accessibilityRole="button" key={activity.id} onPress={() => onOpenActivity(activity.id)} style={styles.card}>
            <Text style={styles.title}>{label}</Text><Text style={styles.plant}>{plantName}</Text><Text style={styles.meta}>{CARE_ACTIVITY_ORIGIN_LABELS[activity.origin]} · {new Date(activity.occurredAt).toLocaleString("vi-VN")}</Text>
          </Pressable>;
        })}</View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, gap: spacing.xs, minHeight: 88, padding: spacing.md },
  title: { color: colors.text, fontSize: 16, fontWeight: "600" }, plant: { color: colors.text, fontSize: 14 }, meta: { color: colors.textSecondary, fontSize: 12 },
});
