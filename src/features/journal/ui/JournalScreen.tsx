import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import type { PlantIdentityData } from "@/features/plants";
import { PlantIdentity } from "@/features/plants";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { CARE_ACTIVITY_LABELS, CARE_ACTIVITY_ORIGIN_LABELS, type CareActivity } from "../models/care-activity";
import { createJournalItems } from "../models/journal-item";
import type { PlantUpdate } from "../models/plant-update";

type PlantSummary = PlantIdentityData & Readonly<{ name: string; speciesId: string; stageId: string }>;
type Props = Readonly<{
  activities?: readonly CareActivity[];
  onOpenActivity?: (id: string) => void;
  onOpenUpdate?: (id: string) => void;
  plants?: Readonly<Record<string, PlantSummary>>;
  updates?: readonly PlantUpdate[];
}>;

export function JournalScreen({ activities = [], onOpenActivity = () => undefined, onOpenUpdate = () => undefined, plants = {}, updates = [] }: Props) {
  const items = createJournalItems(activities, updates);
  return <Screen introduction="Lịch sử hoạt động và cập nhật cây do bạn đã lưu." title="Nhật ký">
    {items.length === 0 ? <EmptyState description="Hoạt động chăm sóc, ảnh và ghi chú đã lưu sẽ xuất hiện ở đây." title="Nhật ký của bạn chưa có nội dung" /> : <View style={styles.list}>
      {items.map((item) => {
        const plant = plants[item.record.plantId];
        return item.kind === "care"
          ? <CareCard {...(plant ? { plant } : {})} activity={item.record} key={item.id} onPress={() => onOpenActivity(item.id)} />
          : <UpdateCard {...(plant ? { plant } : {})} key={item.id} onPress={() => onOpenUpdate(item.id)} update={item.record} />;
      })}
    </View>}
  </Screen>;
}

function CareCard({ activity, onPress, plant }: Readonly<{ activity: CareActivity; onPress: () => void; plant?: PlantSummary }>) {
  const plantName = plant?.name ?? "Cây trồng";
  const label = CARE_ACTIVITY_LABELS[activity.type];
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  return <Pressable accessibilityLabel={`${label} · ${plantName}`} accessibilityRole="button" onPress={onPress}>
    <SurfaceCard style={styles.card}>
      <View style={[styles.icon, { backgroundColor: visual.backgroundColor }]}><Ionicons color={visual.color} name={visual.icon} size={20} /></View>
      <View style={styles.copy}>
        {plant ? <PlantIdentity name={plant.name} size="list" speciesTitle={plant.speciesTitle} stageId={plant.stageId} stageTitle={plant.stageTitle} /> : <Typography variant="bodyLarge">{plantName}</Typography>}
        <Typography variant="bodyMedium">{label}</Typography>
        <Typography color="textSecondary" variant="label">{CARE_ACTIVITY_ORIGIN_LABELS[activity.origin]} · {new Date(activity.occurredAt).toLocaleString("vi-VN")}</Typography>
      </View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} />
    </SurfaceCard>
  </Pressable>;
}

function UpdateCard({ onPress, plant, update }: Readonly<{ onPress: () => void; plant?: PlantSummary; update: PlantUpdate }>) {
  const photoUri = update.photos.slice().sort((left, right) => left.position - right.position)[0]?.localUri;
  const plantName = plant?.name ?? "Cây trồng";
  const stageTitle = plant ? getPreviewPlantKnowledge(plant.speciesId)?.stages.find((stage) => stage.id === update.stageId)?.title ?? "Chưa xác định" : "Chưa xác định";
  const metaLabel = update.photos.length ? `${update.photos.length} ảnh` : "Ghi chú";
  return <Pressable accessibilityLabel={`Cập nhật cây · ${plantName}`} accessibilityRole="button" onPress={onPress}>
    <SurfaceCard style={styles.updateCard}>
      {plant ? <PlantIdentity {...(photoUri ? { imageUri: photoUri } : {})} name={plant.name} size="list" speciesTitle={plant.speciesTitle} stageId={update.stageId} stageTitle={stageTitle} /> : <Typography variant="bodyLarge">{plantName}</Typography>}
      <Typography variant="bodyMedium">Cập nhật cây</Typography>
      {update.notes ? <Typography color="textSecondary" numberOfLines={2} variant="bodyMedium">{update.notes}</Typography> : null}
      <View style={styles.meta}><Ionicons color={colors.textSecondary} name={update.photos.length ? "camera-outline" : "document-text-outline"} size={16} /><Typography color="textSecondary" style={styles.flex} variant="label">{metaLabel} · {new Date(update.occurredAt).toLocaleString("vi-VN")}</Typography><Ionicons color={colors.textSecondary} name="chevron-forward" size={18} /></View>
    </SurfaceCard>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 84 }, copy: { flex: 1, gap: spacing.xs, minWidth: 0 },
  flex: { flex: 1 }, icon: { alignItems: "center", borderRadius: 20, height: 40, justifyContent: "center", width: 40 }, list: { gap: spacing.md },
  meta: { alignItems: "center", flexDirection: "row", gap: spacing.xs }, updateCard: { gap: spacing.sm },
});
