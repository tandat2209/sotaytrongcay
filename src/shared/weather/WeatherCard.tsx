import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { WeatherMetrics, WeatherState } from "./weather-state";

export function WeatherCard({ weather }: { weather: WeatherState }) {
  if (weather.status === "available" || weather.status === "stale") {
    return <SurfaceCard style={styles.card}><Icon name={weather.status === "stale" ? "time-outline" : "partly-sunny-outline"} /><View style={styles.copy}><Typography variant="headlineSmall">Thời tiết hôm nay</Typography><Typography variant="bodyLarge">{weather.summary}</Typography>{formatMetrics(weather.metrics) ? <Typography color="textSecondary" variant="bodyMedium">{formatMetrics(weather.metrics)}</Typography> : null}<Typography color="textSecondary" variant="bodyMedium">{weather.locationLabel} · {new Date(weather.observedAt).toLocaleString("vi-VN")}</Typography><Typography color="textSecondary" variant="label">{weather.source} · {weather.freshnessLabel}</Typography></View></SurfaceCard>;
  }
  const content = weather.status === "loading" ? { detail: "Đang tải dữ liệu thời tiết…", label: "Đang tải" } : weather.status === "offline" ? { detail: "Bạn đang ngoại tuyến. Chưa có dữ liệu thời tiết đã lưu.", label: "Ngoại tuyến" } : weather.status === "error" ? { detail: "Chưa thể tải dữ liệu thời tiết. Các phần khác vẫn dùng được.", label: "Không thể tải thời tiết" } : weather.status === "unavailable" && weather.reason === "permission-denied" ? { detail: "Chưa được phép dùng vị trí để tải thời tiết.", label: "Thời tiết hiện chưa khả dụng" } : { detail: "Chưa có dữ liệu thời tiết để hiển thị.", label: "Thời tiết hiện chưa khả dụng" };
  return <SurfaceCard style={styles.card}><Icon name={weather.status === "error" ? "alert-circle-outline" : "cloud-offline-outline"} /><View style={styles.copy}><Typography variant="headlineSmall">Thời tiết hôm nay</Typography><Typography color="textSecondary" variant="bodyMedium">{content.detail}</Typography><Typography color="textSecondary" variant="label">{content.label}</Typography></View></SurfaceCard>;
}

function formatMetrics(metrics: WeatherMetrics | undefined): string | null {
  if (!metrics) return null;
  const values = [metrics.temperatureCelsius === undefined ? null : `${metrics.temperatureCelsius}°C`, metrics.humidityPercent === undefined ? null : `Độ ẩm ${metrics.humidityPercent}%`, metrics.rainChancePercent === undefined ? null : `Khả năng mưa ${metrics.rainChancePercent}%`].filter((value): value is string => value !== null);
  return values.length > 0 ? values.join(" · ") : null;
}

function Icon({ name }: { name: "alert-circle-outline" | "cloud-offline-outline" | "partly-sunny-outline" | "time-outline" }) { return <View accessibilityElementsHidden style={styles.icon}><Ionicons color={colors.primary} name={name} size={24} /></View>; }

const styles = StyleSheet.create({ card: { alignItems: "center", backgroundColor: colors.surfaceSubtle, borderColor: colors.primarySoft, flexDirection: "row", gap: spacing.md }, copy: { flex: 1, gap: spacing.xs }, icon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 24, height: 48, justifyContent: "center", width: 48 } });
