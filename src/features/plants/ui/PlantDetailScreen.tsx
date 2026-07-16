import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Info,
  Leaf,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { formatCareEvaluationReason } from "@/features/guidance";
import {
  CareEntryScreen,
  type CareActivityType,
  type CareEntryDetails,
} from "@/features/journal";
import { StageIcon } from "@/features/knowledge/stage-icons";
import type { StagePlaybook } from "@/features/knowledge/preview-knowledge";
import { WeatherCard } from "@/shared/weather/WeatherCard";
import type { WeatherState } from "@/shared/weather/weather-state";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type {
  PlantDetailCareCard as CareCardModel,
  PlantDetailProjection,
} from "../models/plant-detail-projection";
import { CareRecommendationDetails } from "./CareRecommendationDetails";
import { PlantActionMenu } from "./PlantActionMenu";
import { PlantDetailCareCard } from "./PlantDetailCareCard";
import { PlantDetailHero } from "./PlantDetailHero";
import { PlantDetailRecentJournal } from "./PlantDetailRecentJournal";

type Props = Readonly<{
  onBack?: () => void;
  onAddJournal: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook?: () => void;
  onOpenSchedule: () => void;
  onOpenUpdate: (id: string) => void;
  onRecordCare: (
    type: CareActivityType,
    details: CareEntryDetails,
  ) => Promise<void>;
  projection: PlantDetailProjection;
  weather: WeatherState;
}>;

export function PlantDetailScreen({
  onAddJournal,
  onBack,
  onOpenActivity,
  onOpenPlaybook,
  onOpenSchedule,
  onOpenUpdate,
  onRecordCare,
  projection,
  weather,
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
    .flatMap((input) => input.suggestions)
    .map(({ name }) => name)
    .join(" · ");
  const fertilizerSuggestions =
    entryCard?.details?.recommendedInputs.flatMap(
      (input) => input.suggestions,
    ) ?? [];
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
        introduction={null}
        title=""
      >
        {onBack ? (
          <TopBar
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
        <GrowthJourney projection={projection} />
        <CurrentStage
          {...(onOpenPlaybook ? { onOpenPlaybook } : {})}
          onOpenSchedule={onOpenSchedule}
          projection={projection}
        />
        <View style={styles.section}>
          <Typography variant="headlineSmall">
            {t("plants.screen.careToday")}
          </Typography>
          {projection.careCards.map((card) => (
            <PlantDetailCareCard
              card={card}
              key={card.activityType}
              onOpenActivity={onOpenActivity}
              onOpenDetails={setSelectedCareCard}
            />
          ))}
        </View>
        <StageTips playbook={projection.stagePlaybook} />
        <WeatherCard weather={weather} />
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
            <Typography variant="headlineSmall">
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
          stageId={projection.plant.stageId}
          stageTitle={projection.stageTitle}
          type={careEntryType}
          visible
        />
      ) : null}
    </>
  );
}

function GrowthJourney({ projection }: { projection: PlantDetailProjection }) {
  const currentIndex = projection.lifecycleStages.findIndex(
    (stage) => stage.isCurrent,
  );

  return (
    <View style={styles.compactSection}>
      <View style={styles.journeyHeading}>
        <Typography variant="headlineSmall">
          {t("plants.screen.lifecycle")}
        </Typography>
        {currentIndex >= 0 ? (
          <Typography color="textSecondary" variant="label">
            {currentIndex + 1}/{projection.lifecycleStages.length}
          </Typography>
        ) : null}
      </View>
      {projection.lifecycleStages.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.journey}>
            {projection.lifecycleStages.map((stage, index) => {
              return (
                <View
                  accessibilityLabel={
                    stage.isCurrent
                      ? t("plants.screen.currentStageAccessibility", {
                          stage: stage.title,
                        })
                      : stage.title
                  }
                  key={stage.id}
                  style={styles.journeyStep}
                >
                  {index ? <View style={styles.connector} /> : null}
                  <View
                    style={[
                      styles.stageNode,
                      stage.isCurrent && styles.currentNode,
                    ]}
                  >
                    <StageIcon
                      color={
                        stage.isCurrent ? colors.surface : colors.textSecondary
                      }
                      size={16}
                      stageId={stage.id}
                    />
                  </View>
                  <Typography
                    color={stage.isCurrent ? "primary" : "textSecondary"}
                    style={styles.journeyLabel}
                    variant="label"
                  >
                    {stage.title}
                  </Typography>
                </View>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("plants.screen.journeyEmpty")}
        </Typography>
      )}
    </View>
  );
}

function CurrentStage({
  onOpenPlaybook,
  onOpenSchedule,
  projection,
}: {
  onOpenPlaybook?: () => void;
  onOpenSchedule: () => void;
  projection: PlantDetailProjection;
}) {
  return (
    <SurfaceCard style={styles.stageCard}>
      <Typography color="secondary" variant="label">
        {t("plants.guide.objective")}
      </Typography>
      <Typography color="textSecondary" variant="bodyLarge">
        {projection.stagePlaybook?.primaryObjective ||
          t("plants.guide.missing")}
      </Typography>
      {projection.stagePlaybook ? (
        <View style={styles.reviewBadge}>
          <Typography color="secondary" variant="label">
            {t("plants.guide.reviewBadge")}
          </Typography>
        </View>
      ) : null}
      <Pressable
        accessibilityLabel={t("plants.screen.customizeAccessibility")}
        accessibilityRole="button"
        onPress={onOpenSchedule}
        style={({ pressed }) => [
          styles.playbookAction,
          pressed && styles.playbookActionPressed,
        ]}
      >
        <Leaf color={colors.primary} size={20} />
        <Typography color="primary" style={styles.flex} variant="bodyLarge">
          {t("plants.screen.customize")}
        </Typography>
        <ChevronRight color={colors.primary} size={18} />
      </Pressable>
      {onOpenPlaybook && projection.stagePlaybook ? (
        <Pressable
          accessibilityLabel={t("plants.screen.guideAccessibility", {
            stage: projection.stageTitle,
          })}
          accessibilityRole="button"
          onPress={onOpenPlaybook}
          style={({ pressed }) => [
            styles.playbookAction,
            pressed && styles.playbookActionPressed,
          ]}
        >
          <BookOpen color={colors.primary} size={20} />
          <Typography color="primary" style={styles.flex} variant="bodyLarge">
            {t("plants.screen.viewGuide")}
          </Typography>
          <ChevronRight color={colors.primary} size={18} />
        </Pressable>
      ) : null}
    </SurfaceCard>
  );
}

function StageTips({ playbook }: { playbook: StagePlaybook | null }) {
  if (
    !playbook?.recommendedKnowledgeTopics.length &&
    !playbook?.exitCriteria.length
  )
    return null;
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">
        {t("plants.screen.nextStep")}
      </Typography>
      <SurfaceCard style={styles.tipsCard}>
        {[...playbook.recommendedKnowledgeTopics, ...playbook.exitCriteria].map(
          (item) => (
            <View key={item} style={styles.bullet}>
              <CheckCircle color={colors.primary} size={18} />
              <Typography color="textSecondary" variant="bodyMedium">
                {item}
              </Typography>
            </View>
          ),
        )}
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  bullet: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  compactSection: { gap: spacing.sm },
  connector: {
    backgroundColor: colors.border,
    height: 1,
    left: -14,
    position: "absolute",
    top: 16,
    width: 20,
  },
  currentNode: { backgroundColor: colors.primary, borderColor: colors.primary },
  flex: { flex: 1 },
  journey: { flexDirection: "row", gap: spacing.sm },
  journeyHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  journeyLabel: { textAlign: "center" },
  journeyStep: { alignItems: "center", gap: spacing.xs, width: 68 },
  reviewBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  playbookAction: {
    alignItems: "center",
    borderRadius: radius.control,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  playbookActionPressed: { backgroundColor: colors.primarySoft },
  section: { gap: spacing.md },
  sheetTitle: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  stageCard: {
    backgroundColor: colors.surfaceSubtle,
    borderLeftColor: colors.primary,
    borderLeftWidth: 3,
    gap: spacing.sm,
    padding: spacing.md,
  },
  stageNode: {
    alignItems: "center",
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderRadius: radius.round,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  tipsCard: { gap: spacing.sm },
});
