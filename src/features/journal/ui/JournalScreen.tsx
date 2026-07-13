import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { PlantIdentity as PlantIdentityData } from "@/features/plants";
import { PlantIdentity } from "@/features/plants";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import {
  CARE_ACTIVITY_LABELS,
  CARE_ACTIVITY_ORIGIN_LABELS,
  CareActivity,
} from "../models/care-activity";

type Props = { activities?: CareActivity[]; onOpenActivity?: (id: string) => void; plants?: Readonly<Record<string, PlantIdentityData & Readonly<{ name: string; stageId: string }>>> };

export function JournalScreen({ activities = [], onOpenActivity = () => undefined, plants = {} }: Props) {
  return (
    <Screen introduction="Lịch sử hoạt động do bạn đã lưu." title="Nhật ký">
      {activities.length === 0 ? <EmptyState description="Hoạt động tưới nước, bón phân và phun thuốc đã lưu sẽ xuất hiện ở đây." title="Nhật ký của bạn chưa có nội dung" /> : (
        <View style={styles.list}>{activities.map((activity) => {
          const plant = plants[activity.plantId];
          const plantName = plant?.name ?? "Cây trồng";
          const label = CARE_ACTIVITY_LABELS[activity.type];
          const visual = CARE_ACTIVITY_VISUALS[activity.type];
          return <Pressable accessibilityLabel={`${label} · ${plantName}`} accessibilityRole="button" key={activity.id} onPress={() => onOpenActivity(activity.id)}>
            <SurfaceCard style={styles.card}>
              <View style={[styles.icon, { backgroundColor: visual.backgroundColor }]}><Ionicons color={visual.color} name={visual.icon} size={20} /></View>
              <View style={styles.copy}>
                {plant ? <PlantIdentity name={plant.name} size="list" speciesTitle={plant.speciesTitle} stageId={plant.stageId} stageTitle={plant.stageTitle} /> : <Typography variant="bodyLarge">{plantName}</Typography>}
                <Typography variant="bodyMedium">{label}</Typography>
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
