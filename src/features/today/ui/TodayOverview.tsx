import { CalendarDays, Sprout } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { EmptyState } from "@/shared/ui/EmptyState";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import { WeatherCard } from "@/shared/weather/WeatherCard";
import type {
  TodayCareCard,
  TodayProjection,
} from "../models/today-projection";
import { PlantRail } from "./PlantRail";
import { RecentCareHistoryCard } from "./RecentCareHistoryCard";
import { TodayPriorityList } from "./TodayPriorityList";

export { WeatherCard } from "@/shared/weather/WeatherCard";

type Props = Readonly<{
  onAddPlant: () => void;
  onOpenActivity: (id: string) => void;
  onOpenJournal: () => void;
  onOpenPlant: (id: string) => void;
  onRecordCare: (card: TodayCareCard) => void;
  projection: TodayProjection;
}>;

export function TodayOverview({
  onAddPlant,
  onOpenActivity,
  onOpenJournal,
  onOpenPlant,
  onRecordCare,
  projection,
}: Props) {
  if (projection.plants.length === 0)
    return (
      <View style={styles.emptyState}>
        <EmptyState
          description="Thêm cây đầu tiên để theo dõi lịch sử chăm sóc và xem việc cần chú ý."
          icon={Sprout}
          title="Bắt đầu với cây đầu tiên của bạn"
        />
        <Pressable
          accessibilityLabel="Thêm cây"
          accessibilityRole="button"
          onPress={onAddPlant}
          style={styles.addPlantButton}
        >
          <Typography style={styles.addPlantLabel} variant="bodyLarge">
            Thêm cây
          </Typography>
        </Pressable>
      </View>
    );

  return (
    <View style={styles.content}>
      <WeatherCard weather={projection.weather} />
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <CalendarDays color={colors.primary} size={20} />
          <Typography variant="headlineSmall">Việc cần làm hôm nay</Typography>
        </View>
        <TodayPriorityList
          cards={projection.careCards}
          onRecordCare={onRecordCare}
        />
      </View>
      <RecentCareHistoryCard
        activities={projection.recentActivities}
        onOpenActivity={onOpenActivity}
        onOpenJournal={onOpenJournal}
      />
      <PlantRail
        onAddPlant={onAddPlant}
        onOpenPlant={onOpenPlant}
        photoUris={projection.plantPhotoUris}
        plants={projection.plants}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addPlantButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.control,
    justifyContent: "center",
    minHeight: control.primaryHeight,
    paddingHorizontal: spacing.md,
  },
  addPlantLabel: { color: colors.surface, fontWeight: "600" },
  content: { gap: spacing.lg },
  emptyState: { gap: spacing.md },
  section: { gap: spacing.md },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
