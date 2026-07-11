import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
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
          return <Pressable accessibilityLabel={`${label} · ${plantName}`} accessibilityRole="button" key={activity.id} onPress={() => onOpenActivity(activity.id)}>
            <SurfaceCard style={styles.card}>
              <View style={styles.icon}><Ionicons color={colors.primary} name="water-outline" size={20} /></View>
              <View style={styles.copy}>
                <Typography variant="bodyLarge">{label}</Typography>
                <Typography variant="bodyMedium">{plantName}</Typography>
                <Typography color="textSecondary" variant="label">{CARE_ACTIVITY_ORIGIN_LABELS[activity.origin]} · {new Date(activity.occurredAt).toLocaleString("vi-VN")}</Typography>
              </View>
              <Ionicons color={colors.textSecondary} name="chevron-forward" size={20} />
            </SurfaceCard>
          </Pressable>;
        })}</View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 84 },
  copy: { flex: 1, gap: spacing.xs },
  icon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  list: { gap: spacing.md },
});
