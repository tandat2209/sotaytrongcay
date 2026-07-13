import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { stageIcon } from "@/features/knowledge/stage-icons";
import type { CareGuide, CarePlan, StagePlaybook } from "@/features/knowledge/preview-knowledge";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { StageCarePlanSection } from "./StageCarePlanSection";
import { StageInformationalGuideSection } from "./StageInformationalGuideSection";

type Props = Readonly<{
  carePlans: readonly CarePlan[];
  informationalGuides: readonly CareGuide[];
  nextStage: StagePlaybook | null;
  onBack: () => void;
  onOpenNextStage?: () => void;
  playbook: StagePlaybook;
}>;

export function StagePlaybookScreen({
  carePlans,
  informationalGuides,
  nextStage,
  onBack,
  onOpenNextStage,
  playbook,
}: Props) {
  return (
    <Screen introduction={null} title="">
      <TopBar backAccessibilityLabel="Quay lại chi tiết cây" onBack={onBack} title="Hướng dẫn chi tiết" />

      <View style={styles.hero}>
        <View style={styles.heroStageRow}>
          <Ionicons color="#FFFFFF" name={stageIcon(playbook.id)} size={20} />
          <Typography style={styles.heroTitle} variant="headlineMedium">{playbook.title}</Typography>
        </View>
        {playbook.estimatedDuration ? (
          <View style={styles.heroDuration}>
            <Ionicons color={colors.secondarySoft} name="time-outline" size={14} />
            <Typography style={styles.heroDurationText} variant="bodyMedium">{playbook.estimatedDuration}</Typography>
          </View>
        ) : null}
        <View style={styles.heroReviewBadge}>
          <Typography style={styles.heroReviewText} variant="label">NỘI DUNG CHỜ DUYỆT</Typography>
        </View>
      </View>

      <View style={styles.section}>
        <SurfaceCard style={styles.objectiveCard}>
          <Typography color="textSecondary" variant="label">MỤC TIÊU GIAI ĐOẠN</Typography>
          <Typography variant="bodyLarge">{playbook.primaryObjective}</Typography>
        </SurfaceCard>
      </View>

      <StageCarePlanSection carePlans={carePlans} />

      <StageInformationalGuideSection guides={informationalGuides} />

      {playbook.recommendedKnowledgeTopics.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Ionicons color={colors.primary} name="bulb-outline" size={20} />
            <Typography variant="headlineSmall">Nên tìm hiểu</Typography>
          </View>
          <SurfaceCard style={styles.listCard}>
            {playbook.recommendedKnowledgeTopics.map((topic) => (
              <View key={topic} style={styles.bulletRow}>
                <Typography color="textSecondary" variant="bodyMedium">·</Typography>
                <Typography color="textSecondary" variant="bodyMedium">{topic}</Typography>
              </View>
            ))}
          </SurfaceCard>
        </View>
      ) : null}

      {playbook.exitCriteria.length > 0 ? (
        <View style={styles.section}>
          <SurfaceCard style={styles.exitCard}>
            <View style={styles.exitHeading}>
              <Ionicons color={colors.primary} name="flag-outline" size={18} />
              <Typography color="secondary" variant="label">TIÊU CHÍ HOÀN THÀNH GIAI ĐOẠN</Typography>
            </View>
            {playbook.exitCriteria.map((criterion) => (
              <View key={criterion} style={styles.bulletRow}>
                <Typography color="textSecondary" variant="bodyMedium">·</Typography>
                <Typography variant="bodyMedium">{criterion}</Typography>
              </View>
            ))}
          </SurfaceCard>
        </View>
      ) : null}

      {nextStage && onOpenNextStage ? (
        <Pressable
          accessibilityLabel={`Xem giai đoạn tiếp theo: ${nextStage.title}`}
          accessibilityRole="button"
          onPress={onOpenNextStage}
        >
          <SurfaceCard style={styles.nextStageCard}>
            <View style={styles.nextStageIcon}>
              <Ionicons color={colors.secondary} name={stageIcon(nextStage.id)} size={22} />
            </View>
            <View style={styles.actionCopy}>
              <Typography color="textSecondary" variant="label">SẮP TỚI</Typography>
              <Typography variant="headlineSmall">Giai đoạn: {nextStage.title}</Typography>
            </View>
            <Ionicons color={colors.textSecondary} name="chevron-forward" size={20} />
          </SurfaceCard>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionCopy: { flex: 1, gap: spacing.xs },
  bulletRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  durationRow: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  exitCard: { borderColor: colors.primary, borderLeftColor: colors.primary, gap: spacing.sm },
  exitHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  heroDuration: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  heroDurationText: { color: colors.secondarySoft },
  heroReviewBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  heroReviewText: { color: "#FFFFFF" },
  heroStageRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  heroTitle: { color: "#FFFFFF", flex: 1 },
  listCard: { gap: spacing.sm },
  nextStageCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 72,
  },
  nextStageIcon: {
    alignItems: "center",
    backgroundColor: colors.secondarySoft,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  objectiveCard: { gap: spacing.sm },
  section: { gap: spacing.md },
  sectionHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
