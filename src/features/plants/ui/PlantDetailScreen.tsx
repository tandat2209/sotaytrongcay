import { HandHeart, Info, Leaf } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { formatCareEvaluationReason } from "@/features/guidance";
import {
  CareEntryScreen,
  type CareActivityType,
  type CareEntryDetails,
} from "@/features/journal";
import { listSprayTargets } from "@/features/knowledge";
import { WeatherCard, type WeatherState } from "@/features/weather";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Screen } from "@/shared/ui/Screen";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type {
  PlantDetailCareCard as CareCardModel,
  PlantDetailProjection,
} from "../models/plant-detail-projection";
import { CareRecommendationDetails } from "./CareRecommendationDetails";
import { PlantActionMenu } from "./PlantActionMenu";
import { PlantDetailCareCard } from "./PlantDetailCareCard";
import { PlantCurrentStage } from "./PlantCurrentStage";
import { PlantGrowthJourney } from "./PlantGrowthJourney";
import { PlantDetailHero } from "./PlantDetailHero";
import { PlantDetailMenu } from "./PlantDetailMenu";
import { PlantDetailRecentJournal } from "./PlantDetailRecentJournal";

type Props = Readonly<{
  onBack?: () => void;
  onAddJournal: () => void;
  onArchive: () => void;
  onEdit: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook?: () => void;
  onOpenUpdate: (id: string) => void;
  onRefreshWeather: () => void;
  onRecordCare: (
    type: CareActivityType,
    details: CareEntryDetails,
  ) => Promise<void>;
  projection: PlantDetailProjection;
  onUseWeatherLocation: () => void;
  weather: WeatherState;
  weatherUpdating: boolean;
}>;

export function PlantDetailScreen({
  onAddJournal,
  onArchive,
  onBack,
  onEdit,
  onOpenActivity,
  onOpenPlaybook,
  onOpenUpdate,
  onRefreshWeather,
  onRecordCare,
  onUseWeatherLocation,
  projection,
  weather,
  weatherUpdating,
}: Props) {
  const [careEntryType, setCareEntryType] = useState<CareActivityType | null>(
    null,
  );
  const [selectedCareCard, setSelectedCareCard] =
    useState<CareCardModel | null>(null);
  const entryCard = careEntryType
    ? projection.careCards.find((card) => card.activityType === careEntryType)
    : null;
  const entryReason = entryCard?.evaluation
    ? formatCareEvaluationReason(entryCard.evaluation.reason)
    : projection.stagePlaybook?.primaryObjective;
  const entrySuggestion = entryCard?.details?.recommendedInputs
    .map(({ name }) => name)
    .join(" · ");
  const fertilizerSuggestions =
    entryCard?.details?.recommendedInputs.map((input) => ({
      id: input.catalogId,
      name: input.name,
      group: input.group,
    })) ?? [];
  const recordQuickCare = (type: CareActivityType) => {
    setCareEntryType(type);
  };

  return (
    <>
      <Screen
        floatingAction={
          <PlantActionMenu
            onAddJournal={onAddJournal}
            onRecordCare={recordQuickCare}
          />
        }
        floatingActionAlignment="center"
        introduction={null}
        title=""
      >
        {onBack ? (
          <TopBar
            action={<PlantDetailMenu onArchive={onArchive} onEdit={onEdit} />}
            backAccessibilityLabel={t("common.actions.backToPlants")}
            onBack={onBack}
            title={t("plants.screen.details")}
            titleIcon={Leaf}
          />
        ) : null}
        <PlantDetailHero
          ageLabels={projection.ageLabels}
          imageUri={projection.latestPhotoUri}
          name={projection.plant.name}
          speciesTitle={projection.speciesTitle}
        />
        <PlantGrowthJourney projection={projection} />
        <PlantCurrentStage
          {...(onOpenPlaybook ? { onOpenPlaybook } : {})}
          projection={projection}
        />
        <View style={styles.section}>
          <SectionHeader
            icon={HandHeart}
            title={t("plants.screen.careToday")}
          />
          {projection.careCards.map((card) => (
            <PlantDetailCareCard
              card={card}
              key={card.activityType}
              onOpenActivity={onOpenActivity}
              onOpenDetails={setSelectedCareCard}
              onStartCare={() => recordQuickCare(card.activityType)}
            />
          ))}
        </View>
        <WeatherCard
          disabled={weatherUpdating}
          onRetry={onRefreshWeather}
          onUseLocation={onUseWeatherLocation}
          weather={weather}
        />
        <PlantDetailRecentJournal
          items={projection.recentJournalItems}
          onOpenActivity={onOpenActivity}
          onOpenUpdate={onOpenUpdate}
        />
      </Screen>
      <BottomSheet
        onDismiss={() => setSelectedCareCard(null)}
        title={
          <View style={styles.sheetTitle}>
            <Info color={colors.primary} size={20} />
            <Typography variant="cardTitle">
              {selectedCareCard?.title ?? t("plants.screen.recommendation")}
            </Typography>
          </View>
        }
        visible={selectedCareCard !== null}
      >
        {selectedCareCard?.details ? (
          <CareRecommendationDetails details={selectedCareCard.details} />
        ) : null}
      </BottomSheet>
      {careEntryType ? (
        <CareEntryScreen
          fertilizerSuggestions={fertilizerSuggestions}
          {...(entryReason ? { reason: entryReason } : {})}
          {...(entrySuggestion && careEntryType !== "fertilizing"
            ? { suggestion: entrySuggestion }
            : {})}
          onDismiss={() => setCareEntryType(null)}
          onSave={async (details) => {
            await onRecordCare(careEntryType, details);
            setCareEntryType(null);
          }}
          imageUri={projection.latestPhotoUri}
          plantName={projection.plant.name}
          speciesTitle={projection.speciesTitle}
          sprayTargets={listSprayTargets(projection.plant.speciesId)}
          stageId={projection.plant.stageId}
          stageTitle={projection.stageTitle}
          type={careEntryType}
          visible
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.lg },
  sheetTitle: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
