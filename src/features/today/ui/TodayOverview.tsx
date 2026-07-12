import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_LABELS, type CareActivityType } from "@/features/journal";
import { EmptyState } from "@/shared/ui/EmptyState";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { TodayActivity, TodayProjection, TodayWeather } from "../models/today-projection";
import { PlantRail } from "./PlantRail";
import { TodayHeader } from "./TodayHeader";

type Props = {
  date?: Date;
  onAddPlant: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlant: (id: string) => void;
  projection: TodayProjection;
};

export function TodayOverview({ date, onAddPlant, onOpenActivity, onOpenPlant, projection }: Props) {
  if (projection.plants.length === 0) {
    return <View style={styles.emptyState}><EmptyState description="Thêm cây đầu tiên để theo dõi lịch sử chăm sóc và xem việc cần chú ý." title="Bắt đầu với cây đầu tiên của bạn" /><Pressable accessibilityLabel="Thêm cây" accessibilityRole="button" onPress={onAddPlant} style={styles.addPlantButton}><Typography style={styles.addPlantLabel} variant="bodyLarge">Thêm cây</Typography></Pressable></View>;
  }

  return <View style={styles.content}>{date ? <TodayHeader date={date} /> : <TodayHeader />}<WeatherCard weather={projection.weather} /><PlantRail onAddPlant={onAddPlant} onOpenPlant={onOpenPlant} plants={projection.plants} /><View style={styles.section}><Typography variant="headlineSmall">Việc cần làm hôm nay</Typography><SurfaceCard><Typography color="textSecondary" variant="bodyMedium">Hôm nay chưa có việc đến hạn.</Typography></SurfaceCard></View><RecentActivities activities={projection.recentActivities} onOpenActivity={onOpenActivity} /></View>;
}

export function WeatherCard({ weather }: { weather: TodayWeather }) {
  if (weather.status === "available" || weather.status === "stale") {
    const metrics = formatMetrics(weather.metrics);
    return <SurfaceCard style={styles.weatherCard}><WeatherIcon name={weather.status === "stale" ? "time-outline" : "partly-sunny-outline"} /><View style={styles.weatherCopy}><Typography variant="headlineSmall">Thời tiết hôm nay</Typography><Typography variant="bodyLarge">{weather.summary}</Typography>{metrics ? <Typography color="textSecondary" variant="bodyMedium">{metrics}</Typography> : null}<Typography color="textSecondary" variant="bodyMedium">{weather.locationLabel} · {formatObservedAt(weather.observedAt)}</Typography><Typography color="textSecondary" variant="label">{weather.source} · {weather.freshnessLabel}</Typography></View></SurfaceCard>;
  }

  const content = weather.status === "loading"
    ? { detail: "Đang tải dữ liệu thời tiết…", icon: "cloud-outline" as const, label: "Đang tải" }
    : weather.status === "offline"
      ? { detail: "Bạn đang ngoại tuyến. Chưa có dữ liệu thời tiết đã lưu.", icon: "cloud-offline-outline" as const, label: "Ngoại tuyến" }
      : weather.status === "error"
        ? { detail: "Chưa thể tải dữ liệu thời tiết. Các phần khác vẫn dùng được.", icon: "alert-circle-outline" as const, label: "Không thể tải thời tiết" }
        : weather.status === "unavailable"
          ? { detail: weather.reason === "permission-denied" ? "Chưa được phép dùng vị trí để tải thời tiết." : "Chưa có dữ liệu thời tiết để hiển thị.", icon: "cloud-offline-outline" as const, label: "Thời tiết hiện chưa khả dụng" }
          : { detail: "Chưa có dữ liệu thời tiết để hiển thị.", icon: "cloud-offline-outline" as const, label: "Thời tiết hiện chưa khả dụng" };
  return <SurfaceCard style={styles.weatherCard}><WeatherIcon name={content.icon} /><View style={styles.weatherCopy}><Typography variant="headlineSmall">Thời tiết hôm nay</Typography><Typography color="textSecondary" variant="bodyMedium">{content.detail}</Typography><Typography color="textSecondary" variant="label">{content.label}</Typography></View></SurfaceCard>;
}

function WeatherIcon({ name }: { name: "alert-circle-outline" | "cloud-offline-outline" | "cloud-outline" | "partly-sunny-outline" | "time-outline" }) {
  return <View accessibilityElementsHidden style={styles.weatherIcon}><Ionicons color={colors.primary} name={name} size={24} /></View>;
}

function RecentActivities({ activities, onOpenActivity }: { activities: readonly TodayActivity[]; onOpenActivity: (id: string) => void }) {
  return <View style={styles.section}><Typography variant="headlineSmall">Vừa ghi gần đây</Typography>{activities.length === 0 ? <SurfaceCard><Typography color="textSecondary" variant="bodyMedium">Chưa có hoạt động chăm sóc nào được lưu.</Typography></SurfaceCard> : activities.map((activity) => <ActivityRow activity={activity} key={activity.id} onPress={() => onOpenActivity(activity.id)} />)}</View>;
}

function ActivityRow({ activity, onPress }: { activity: TodayActivity; onPress: () => void }) {
  return <Pressable accessibilityLabel={`Mở ${CARE_ACTIVITY_LABELS[activity.type]} của ${activity.plantName}`} accessibilityRole="button" onPress={onPress}><SurfaceCard style={styles.activityCard}><Ionicons color={colors.primary} name={activityIcon(activity.type)} size={20} /><View style={styles.activityCopy}><Typography variant="bodyLarge">{CARE_ACTIVITY_LABELS[activity.type]}</Typography><Typography color="textSecondary" variant="bodyMedium">{activity.plantName} · {new Date(activity.occurredAt).toLocaleDateString("vi-VN")}</Typography></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /></SurfaceCard></Pressable>;
}

function formatMetrics(metrics: Extract<TodayWeather, { status: "available" | "stale" }>["metrics"]): string | null {
  if (!metrics) return null;
  const values = [metrics.temperatureCelsius === undefined ? null : `${metrics.temperatureCelsius}°C`, metrics.humidityPercent === undefined ? null : `Độ ẩm ${metrics.humidityPercent}%`, metrics.rainChancePercent === undefined ? null : `Khả năng mưa ${metrics.rainChancePercent}%`].filter((value): value is string => value !== null);
  return values.length > 0 ? values.join(" · ") : null;
}

function formatObservedAt(value: string): string { return new Date(value).toLocaleString("vi-VN"); }
function activityIcon(type: CareActivityType): "water-outline" | "leaf-outline" | "flask-outline" { return type === "watering" ? "water-outline" : type === "fertilizing" ? "leaf-outline" : "flask-outline"; }

const styles = StyleSheet.create({
  activityCard: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 68 }, activityCopy: { flex: 1, gap: spacing.xs },
  addPlantButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.control, justifyContent: "center", minHeight: control.primaryHeight, paddingHorizontal: spacing.md }, addPlantLabel: { color: colors.surface, fontWeight: "600" },
  content: { gap: spacing.lg }, emptyState: { gap: spacing.md }, section: { gap: spacing.md },
  weatherCard: { alignItems: "center", backgroundColor: colors.surfaceSubtle, borderColor: colors.primarySoft, flexDirection: "row", gap: spacing.md }, weatherCopy: { flex: 1, gap: spacing.xs }, weatherIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 24, height: 48, justifyContent: "center", width: 48 },
});
