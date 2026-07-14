import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { PlantIdentity } from "@/features/plants";
import type { PlantUpdate } from "../models/plant-update";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  imageUri?: string | null;
  onBack: () => void;
  plantName: string;
  speciesTitle: string;
  stageTitle: string;
  update: PlantUpdate;
}>;

export function PlantUpdateDetailScreen({ imageUri, onBack, plantName, speciesTitle, stageTitle, update }: Props) {
  return <Screen title="">
    <TopBar backAccessibilityLabel="Quay lại Nhật ký" onBack={onBack} title="Chi tiết cập nhật" />
    <PlantIdentity imageUri={imageUri ?? null} name={plantName} size="list" speciesTitle={speciesTitle} stageId={update.stageId} stageTitle={stageTitle} />
    {update.photos.length ? <ScrollView contentContainerStyle={styles.photos} horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {update.photos.slice().sort((left, right) => left.position - right.position).map((photo, index) => <Image accessibilityLabel={`Ảnh cây ${index + 1}`} key={photo.id} source={{ uri: photo.localUri }} style={styles.photo} />)}
    </ScrollView> : null}
    <SurfaceCard style={styles.card}>
      <Detail icon="calendar-outline" label="Thời gian" value={new Date(update.occurredAt).toLocaleString("vi-VN")} />
      <Detail icon="leaf-outline" label="Giai đoạn đã lưu" value={stageTitle} />
      {update.notes ? <Detail icon="document-text-outline" label="Ghi chú" value={update.notes} /> : null}
    </SurfaceCard>
  </Screen>;
}

function Detail({ icon, label, value }: Readonly<{ icon: "calendar-outline" | "document-text-outline" | "leaf-outline"; label: string; value: string }>) {
  return <View style={styles.detail}><Ionicons color={colors.primary} name={icon} size={20} /><View style={styles.copy}><Typography color="textSecondary" variant="label">{label}</Typography><Typography variant="bodyLarge">{value}</Typography></View></View>;
}

const styles = StyleSheet.create({
  card: { gap: spacing.md }, copy: { flex: 1, gap: spacing.xs }, detail: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md },
  photo: { borderRadius: radius.card, height: 280, width: 320 }, photos: { gap: spacing.md, paddingRight: spacing.md },
});
