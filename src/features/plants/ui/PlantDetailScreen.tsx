import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CARE_ACTIVITY_LABELS, CARE_ACTIVITY_VISUALS, CareEntryScreen, type CareActivity, type CareActivityType, type CareEntryDetails } from "@/features/journal";
import { stageIcon } from "@/features/knowledge/stage-icons";
import type { StagePlaybook } from "@/features/knowledge/preview-knowledge";
import { WeatherCard } from "@/shared/weather/WeatherCard";
import type { WeatherState } from "@/shared/weather/weather-state";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { IconButton } from "@/shared/ui/IconButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareCard as CareCardModel, PlantDetailProjection } from "../models/plant-detail-projection";
import { CareRecommendationDetails } from "./CareRecommendationDetails";
import { PlantActionMenu } from "./PlantActionMenu";
import { PlantIdentity } from "./PlantIdentity";
import { PlantDetailCareCard } from "./PlantDetailCareCard";

type Props = Readonly<{
  onBack?: () => void;
  onAddJournal: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook?: () => void;
  onRecordCare: (type: CareActivityType, details: CareEntryDetails) => Promise<void>;
  projection: PlantDetailProjection;
  weather: WeatherState;
}>;

export function PlantDetailScreen({ onAddJournal, onBack, onOpenActivity, onOpenPlaybook, onRecordCare, projection, weather }: Props) {
  const [careEntryType, setCareEntryType] = useState<CareActivityType | null>(null);
  const [selectedCareCard, setSelectedCareCard] = useState<CareCardModel | null>(null);
  const entryCard = careEntryType ? projection.careCards.find((card) => card.activityType === careEntryType) : null;
  const entryReason = entryCard?.evaluation?.explanation || projection.stagePlaybook?.primaryObjective;
  const entrySuggestion = entryCard?.details?.recommendedInputs.map((input) => input.examples).join(" · ");
  const recordQuickCare = (type: CareActivityType) => {
    setCareEntryType(type);
  };

  return (
    <>
      <Screen
        floatingAction={<PlantActionMenu onAddJournal={onAddJournal} onRecordCare={recordQuickCare} />}
        introduction={null}
        title=""
      >
        {onBack ? <TopBar backAccessibilityLabel="Quay lại Cây trồng" onBack={onBack} title="Chi tiết cây" /> : null}
        <PlantIdentity {...(projection.latestPhotoUri ? { imageUri: projection.latestPhotoUri } : {})} name={projection.plant.name} size="detail" speciesTitle={projection.speciesTitle} stageId={projection.plant.stageId} stageTitle={projection.stageTitle} />
        <GrowthJourney projection={projection} />
        <CurrentStage {...(onOpenPlaybook ? { onOpenPlaybook } : {})} projection={projection} />
        <View style={styles.section}>
          <Typography variant="headlineSmall">Chăm sóc hôm nay</Typography>
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
        <RecentActivity activities={projection.recentCare} onOpenActivity={onOpenActivity} />
      </Screen>
      <BottomSheet onDismiss={() => setSelectedCareCard(null)} title={selectedCareCard?.title ?? "Khuyến nghị chăm sóc"} visible={selectedCareCard !== null}>
        {selectedCareCard?.details ? <CareRecommendationDetails details={selectedCareCard.details} /> : null}
      </BottomSheet>
      {careEntryType ? <CareEntryScreen {...(entryReason ? { reason: entryReason } : {})} {...(entrySuggestion ? { suggestion: entrySuggestion } : {})} onDismiss={() => setCareEntryType(null)} onSave={async (details) => {
        await onRecordCare(careEntryType, details);
        setCareEntryType(null);
      }} plantName={projection.plant.name} speciesTitle={projection.speciesTitle} stageId={projection.plant.stageId} stageTitle={projection.stageTitle} type={careEntryType} visible /> : null}
    </>
  );
}

function GrowthJourney({ projection }: { projection: PlantDetailProjection }) {
  const currentIndex = projection.lifecycleStages.findIndex((stage) => stage.isCurrent);

  return <View style={styles.compactSection}>
    <View style={styles.journeyHeading}>
      <Typography variant="headlineSmall">Hành trình sinh trưởng</Typography>
      {currentIndex >= 0 ? <Typography color="textSecondary" variant="label">{currentIndex + 1}/{projection.lifecycleStages.length}</Typography> : null}
    </View>
    {projection.lifecycleStages.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.journey}>
        {projection.lifecycleStages.map((stage, index) => <View accessibilityLabel={stage.isCurrent ? `${stage.title}, hiện tại` : stage.title} key={stage.id} style={styles.journeyStep}>
          {index ? <View style={styles.connector} /> : null}
          <View style={[styles.stageNode, stage.isCurrent && styles.currentNode]}><Ionicons color={stage.isCurrent ? colors.surface : colors.textSecondary} name={stageIcon(stage.id)} size={16} /></View>
          <Typography color={stage.isCurrent ? "primary" : "textSecondary"} style={styles.journeyLabel} variant="label">{stage.title}</Typography>
        </View>)}
      </View>
    </ScrollView> : <Typography color="textSecondary" variant="bodyMedium">Chưa có hành trình cho cây này.</Typography>}
  </View>;
}

function CurrentStage({ onOpenPlaybook, projection }: { onOpenPlaybook?: () => void; projection: PlantDetailProjection }) {
  return <SurfaceCard style={styles.stageCard}>
    <View style={styles.row}>
      <View style={styles.flex}><Typography color="secondary" variant="label">GIAI ĐOẠN HIỆN TẠI</Typography><Typography variant="headlineMedium">{projection.stageTitle}</Typography></View>
      {onOpenPlaybook && projection.stagePlaybook ? <IconButton accessibilityLabel="Mở hướng dẫn giai đoạn" icon="book-outline" onPress={onOpenPlaybook} /> : null}
    </View>
    <Typography color="textSecondary" variant="bodyLarge">{projection.stagePlaybook?.primaryObjective || "Chưa có hướng dẫn cho giai đoạn này."}</Typography>
    {projection.stagePlaybook ? <View style={styles.reviewBadge}><Typography color="secondary" variant="label">NỘI DUNG CHỜ DUYỆT</Typography></View> : null}
  </SurfaceCard>;
}

function StageTips({ playbook }: { playbook: StagePlaybook | null }) {
  if (!playbook?.recommendedKnowledgeTopics.length && !playbook?.exitCriteria.length) return null;
  return <View style={styles.section}><Typography variant="headlineSmall">Chuẩn bị cho bước tiếp theo</Typography><SurfaceCard style={styles.tipsCard}>
    {[...playbook.recommendedKnowledgeTopics, ...playbook.exitCriteria].map((item) => <View key={item} style={styles.bullet}><Ionicons color={colors.primary} name="checkmark-circle-outline" size={18} /><Typography color="textSecondary" variant="bodyMedium">{item}</Typography></View>)}
  </SurfaceCard></View>;
}

function RecentActivity({ activities, onOpenActivity }: { activities: readonly CareActivity[]; onOpenActivity: (id: string) => void }) {
  return <View style={styles.section}><Typography variant="headlineSmall">Hoạt động gần đây</Typography>{activities.length ? <SurfaceCard style={styles.activityList}>{activities.map((activity) => {
    const visual = CARE_ACTIVITY_VISUALS[activity.type];
    return <Pressable accessibilityLabel={`Mở ${CARE_ACTIVITY_LABELS[activity.type].toLowerCase()}`} accessibilityRole="button" key={activity.id} onPress={() => onOpenActivity(activity.id)} style={styles.activityRow}><Ionicons color={visual.color} name={visual.icon} size={20} /><View style={styles.flex}><Typography variant="bodyLarge">{CARE_ACTIVITY_LABELS[activity.type]}</Typography><Typography color="textSecondary" variant="bodyMedium">{new Date(activity.occurredAt).toLocaleString("vi-VN")}</Typography></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={18} /></Pressable>;
  })}</SurfaceCard> : <Typography color="textSecondary" variant="bodyMedium">Chưa có hoạt động chăm sóc nào được lưu.</Typography>}</View>;
}

const styles = StyleSheet.create({
  activityList: { paddingVertical: 0 }, activityRow: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 64, paddingVertical: spacing.sm },
  bullet: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm }, compactSection: { gap: spacing.sm }, connector: { backgroundColor: colors.border, height: 1, left: -14, position: "absolute", top: 16, width: 20 },
  currentNode: { backgroundColor: colors.primary, borderColor: colors.primary },
  flex: { flex: 1 }, journey: { flexDirection: "row", gap: spacing.sm }, journeyHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, journeyLabel: { textAlign: "center" }, journeyStep: { alignItems: "center", gap: spacing.xs, width: 68 },
  plantIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.card, height: 72, justifyContent: "center", width: 72 }, reviewBadge: { alignSelf: "flex-start", backgroundColor: colors.secondarySoft, borderRadius: radius.chip, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.md }, section: { gap: spacing.md },
  stageBadge: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.chip, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, stageCard: { backgroundColor: colors.surfaceSubtle, borderLeftColor: colors.primary, borderLeftWidth: 3, gap: spacing.sm, padding: spacing.md },
  stageNode: { alignItems: "center", backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderRadius: radius.round, borderWidth: 1, height: 32, justifyContent: "center", width: 32 }, tipsCard: { gap: spacing.sm },
});
