import { CalendarDays, Sprout } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { spacing } from "@/shared/ui/theme";
import { WeatherCard, type WeatherState } from "@/features/weather";
import type {
  TodayCareCard,
  TodayProjection,
} from "../models/today-projection";
import { PlantRail } from "./PlantRail";
import { RecentCareHistoryCard } from "./RecentCareHistoryCard";
import { TodayPriorityList } from "./TodayPriorityList";
import { TodayWeatherContext } from "./TodayWeatherContext";

export { WeatherCard } from "@/features/weather";

type Props = Readonly<{
  onAddPlant: () => void;
  onOpenActivity: (id: string) => void;
  onOpenJournal: () => void;
  onOpenPlant: (id: string) => void;
  onRecordCare: (card: TodayCareCard) => void;
  projection: TodayProjection;
  weather: WeatherState;
  weatherUpdating: boolean;
  onRefreshWeather: () => void;
  onUseWeatherLocation: () => void;
}>;

export function TodayOverview({
  onAddPlant,
  onOpenActivity,
  onOpenJournal,
  onOpenPlant,
  onRecordCare,
  projection,
  weather,
  weatherUpdating,
  onRefreshWeather,
  onUseWeatherLocation,
}: Props) {
  return (
    <View style={styles.content}>
      <WeatherCard
        disabled={weatherUpdating}
        header={<TodayWeatherContext />}
        onRetry={onRefreshWeather}
        onUseLocation={onUseWeatherLocation}
        weather={weather}
      />
      {projection.plants.length === 0 ? (
        <View style={styles.emptyState}>
          <EmptyState
            description={t("today.overview.emptyDescription")}
            icon={Sprout}
            title={t("today.overview.emptyTitle")}
          />
          <PrimaryButton
            label={t("today.overview.addPlant")}
            onPress={onAddPlant}
          />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <SectionHeader
              icon={CalendarDays}
              title={t("today.overview.tasks")}
            />
            <TodayPriorityList
              cards={projection.careCards}
              onOpenPlant={onOpenPlant}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.section },
  emptyState: { gap: spacing.base },
  section: { gap: spacing.base },
});
