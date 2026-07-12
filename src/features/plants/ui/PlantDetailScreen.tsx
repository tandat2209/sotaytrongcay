import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { CARE_ACTIVITY_ICONS, CARE_ACTIVITY_LABELS, type CareActivity, type CareActivityType } from "@/features/journal";
import { WeatherCard } from "@/shared/weather/WeatherCard";
import type { WeatherState } from "@/shared/weather/weather-state";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { PlantDetailProjection } from "../models/plant-detail-projection";

type Props = Readonly<{
  onBack?: () => void;
  onOpenActivity: (id: string) => void;
  onRecordCare: (type: CareActivityType) => void;
  projection: PlantDetailProjection;
  weather: WeatherState;
}>;

const CARE_TYPES: readonly CareActivityType[] = ["watering", "fertilizing", "spraying"];

export function PlantDetailScreen({ onBack, onOpenActivity, onRecordCare, projection, weather }: Props) {
  return <Screen introduction={null} title="">
    {onBack ? <TopBar backAccessibilityLabel="Quay lại Cây trồng" onBack={onBack} title={projection.plant.name} /> : null}
    <SurfaceCard style={styles.stageCard}><View style={styles.stageEyebrow}><Ionicons color={colors.secondary} name="leaf-outline" size={18} /><Typography color="secondary" variant="label">GIAI ĐOẠN HIỆN TẠI</Typography></View><Typography variant="headlineMedium">{projection.stageTitle}</Typography><Typography color="textSecondary" variant="bodyMedium">Theo dõi chăm sóc quan trọng và ghi lại khi bạn đã thực hiện.</Typography></SurfaceCard>
    <View style={styles.section}><Typography variant="headlineSmall">Chăm sóc gần đây</Typography>{CARE_TYPES.map((type) => <CareSummary activity={projection.latestCare[type]} key={type} onOpenActivity={onOpenActivity} onRecord={() => onRecordCare(type)} type={type} />)}</View>
    <View style={styles.section}><Typography variant="headlineSmall">Mẹo cho giai đoạn này</Typography><Typography color="textSecondary" variant="bodyMedium">Nội dung hướng dẫn cho giai đoạn này đang chờ duyệt nên chưa được hiển thị như hướng dẫn chăm sóc.</Typography></View>
    <WeatherCard weather={weather} />
    <View style={styles.section}><Typography variant="headlineSmall">Hoạt động chăm sóc gần đây</Typography>{projection.recentCare.length === 0 ? <SurfaceCard><Typography color="textSecondary" variant="bodyMedium">Chưa có hoạt động chăm sóc nào được lưu.</Typography></SurfaceCard> : projection.recentCare.map((activity) => <RecentCare activity={activity} key={activity.id} onOpen={() => onOpenActivity(activity.id)} />)}</View>
  </Screen>;
}

function CareSummary({ activity, onOpenActivity, onRecord, type }: Readonly<{ activity: CareActivity | null; onOpenActivity: (id: string) => void; onRecord: () => void; type: CareActivityType }>) {
  return <View style={styles.summary}><Pressable accessibilityLabel={activity ? `Xem lần ${CARE_ACTIVITY_LABELS[type].toLowerCase()} gần nhất` : undefined} accessibilityRole={activity ? "button" : undefined} disabled={!activity} onPress={() => activity && onOpenActivity(activity.id)}><SurfaceCard style={styles.careCard}><View style={styles.careIcon}><Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[type]} size={21} /></View><View style={styles.careCopy}><Typography variant="bodyLarge">{CARE_ACTIVITY_LABELS[type]}</Typography><Typography color="textSecondary" variant="bodyMedium">{activity ? formatActivity(activity) : "Chưa có dữ liệu"}</Typography></View>{activity ? <Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /> : null}</SurfaceCard></Pressable><PrimaryButton label={`Ghi ${CARE_ACTIVITY_LABELS[type].toLowerCase()}`} onPress={onRecord} /></View>;
}

function RecentCare({ activity, onOpen }: { activity: CareActivity; onOpen: () => void }) { return <Pressable accessibilityLabel={`Mở ${CARE_ACTIVITY_LABELS[activity.type]}`} accessibilityRole="button" onPress={onOpen}><SurfaceCard style={styles.careCard}><Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[activity.type]} size={20} /><View style={styles.careCopy}><Typography variant="bodyLarge">{CARE_ACTIVITY_LABELS[activity.type]}</Typography><Typography color="textSecondary" variant="bodyMedium">{new Date(activity.occurredAt).toLocaleString("vi-VN")}</Typography></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /></SurfaceCard></Pressable>; }

function formatActivity(activity: CareActivity): string { const date = new Date(activity.occurredAt).toLocaleString("vi-VN"); return activity.type === "watering" && activity.amount ? `${date} · ${activity.amount.value.toLocaleString("vi-VN")} lít` : date; }

const styles = StyleSheet.create({ careCard: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 76 }, careCopy: { flex: 1, gap: spacing.xs }, careIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 22, height: 44, justifyContent: "center", width: 44 }, section: { gap: spacing.md }, stageCard: { backgroundColor: colors.surfaceSubtle, borderColor: colors.primary, gap: spacing.sm }, stageEyebrow: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, summary: { gap: spacing.sm } });
