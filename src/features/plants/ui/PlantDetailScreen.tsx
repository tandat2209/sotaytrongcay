import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CARE_ACTIVITY_ICONS, CARE_ACTIVITY_LABELS, type CareActivity, type CareActivityType } from "@/features/journal";
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
import type { PlantDetailProjection } from "../models/plant-detail-projection";
import { PlantDetailCareCard } from "./PlantDetailCareCard";

type Props = Readonly<{
  onBack?: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook?: () => void;
  onRecordCare: (type: CareActivityType) => void;
  projection: PlantDetailProjection;
  weather: WeatherState;
}>;

const QUICK_CARE_TYPES: readonly CareActivityType[] = ["watering", "fertilizing", "spraying"];

export function PlantDetailScreen({ onBack, onOpenActivity, onOpenPlaybook, onRecordCare, projection, weather }: Props) {
  const [quickCareOpen, setQuickCareOpen] = useState(false);
  const recordQuickCare = (type: CareActivityType) => {
    setQuickCareOpen(false);
    onRecordCare(type);
  };

  return (
    <>
      <Screen
        floatingAction={<QuickCareButton onPress={() => setQuickCareOpen(true)} />}
        introduction={null}
        title=""
      >
        {onBack ? <TopBar backAccessibilityLabel="Quay lại Cây trồng" onBack={onBack} title="Chi tiết cây" /> : null}
        <View style={styles.identity}>
          <View style={styles.plantIcon}><Ionicons color={colors.primary} name="leaf-outline" size={34} /></View>
          <View style={styles.flex}>
            <Typography variant="headlineLarge">{projection.plant.name}</Typography>
            <View style={styles.stageBadge}>
              <Ionicons color={colors.primary} name={stageIcon(projection.plant.stageId)} size={16} />
              <Typography color="primary" variant="label">{projection.stageTitle}</Typography>
            </View>
          </View>
        </View>
        <GrowthJourney projection={projection} />
        <CurrentStage {...(onOpenPlaybook ? { onOpenPlaybook } : {})} projection={projection} />
        <View style={styles.section}>
          <Typography variant="headlineSmall">Chăm sóc hôm nay</Typography>
          {projection.careCards.map((card) => (
            <PlantDetailCareCard
              card={card}
              key={card.activityType}
              onOpenActivity={onOpenActivity}
              {...(onOpenPlaybook ? { onOpenPlaybook } : {})}
            />
          ))}
        </View>
        <StageTips playbook={projection.stagePlaybook} />
        <WeatherCard weather={weather} />
        <RecentActivity activities={projection.recentCare} onOpenActivity={onOpenActivity} />
      </Screen>
      <BottomSheet onDismiss={() => setQuickCareOpen(false)} title="Chăm sóc nhanh" visible={quickCareOpen}>
        <Typography color="textSecondary" variant="bodyMedium">Chọn hoạt động muốn ghi</Typography>
        {QUICK_CARE_TYPES.map((type) => (
          <Pressable accessibilityLabel={`Ghi ${CARE_ACTIVITY_LABELS[type].toLowerCase()}`} accessibilityRole="button" key={type} onPress={() => recordQuickCare(type)} style={styles.sheetAction}>
            <Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[type]} size={22} />
            <Typography variant="bodyLarge">Ghi {CARE_ACTIVITY_LABELS[type].toLowerCase()}</Typography>
          </Pressable>
        ))}
      </BottomSheet>
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
  return <View style={styles.section}><Typography variant="headlineSmall">Hoạt động gần đây</Typography>{activities.length ? <SurfaceCard style={styles.activityList}>{activities.map((activity) => <Pressable accessibilityLabel={`Mở ${CARE_ACTIVITY_LABELS[activity.type].toLowerCase()}`} accessibilityRole="button" key={activity.id} onPress={() => onOpenActivity(activity.id)} style={styles.activityRow}><Ionicons color={colors.primary} name={CARE_ACTIVITY_ICONS[activity.type]} size={20} /><View style={styles.flex}><Typography variant="bodyLarge">{CARE_ACTIVITY_LABELS[activity.type]}</Typography><Typography color="textSecondary" variant="bodyMedium">{new Date(activity.occurredAt).toLocaleString("vi-VN")}</Typography></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={18} /></Pressable>)}</SurfaceCard> : <Typography color="textSecondary" variant="bodyMedium">Chưa có hoạt động chăm sóc nào được lưu.</Typography>}</View>;
}

function QuickCareButton({ onPress }: { onPress: () => void }) { return <Pressable accessibilityLabel="Chăm sóc nhanh" accessibilityRole="button" onPress={onPress} style={styles.fab}><Ionicons color={colors.surface} name="add" size={30} /></Pressable>; }

const styles = StyleSheet.create({
  activityList: { paddingVertical: 0 }, activityRow: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 64, paddingVertical: spacing.sm },
  bullet: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm }, compactSection: { gap: spacing.sm }, connector: { backgroundColor: colors.border, height: 1, left: -14, position: "absolute", top: 16, width: 20 },
  currentNode: { backgroundColor: colors.primary, borderColor: colors.primary }, fab: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.round, elevation: 5, height: 56, justifyContent: "center", shadowColor: colors.text, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.22, shadowRadius: 6, width: 56 },
  flex: { flex: 1 }, identity: { alignItems: "center", flexDirection: "row", gap: spacing.md }, journey: { flexDirection: "row", gap: spacing.sm }, journeyHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, journeyLabel: { textAlign: "center" }, journeyStep: { alignItems: "center", gap: spacing.xs, width: 68 },
  plantIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: radius.card, height: 72, justifyContent: "center", width: 72 }, reviewBadge: { alignSelf: "flex-start", backgroundColor: colors.secondarySoft, borderRadius: radius.chip, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.md }, section: { gap: spacing.md }, sheetAction: { alignItems: "center", backgroundColor: colors.surfaceSubtle, borderRadius: radius.control, flexDirection: "row", gap: spacing.md, minHeight: 52, paddingHorizontal: spacing.md },
  stageBadge: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.primarySoft, borderRadius: radius.chip, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, stageCard: { backgroundColor: colors.surfaceSubtle, borderLeftColor: colors.primary, borderLeftWidth: 3, gap: spacing.sm, padding: spacing.md },
  stageNode: { alignItems: "center", backgroundColor: colors.surfaceSubtle, borderColor: colors.border, borderRadius: radius.round, borderWidth: 1, height: 32, justifyContent: "center", width: 32 }, tipsCard: { gap: spacing.sm },
});
