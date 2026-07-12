import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { stageIcon } from "@/features/knowledge/stage-icons";
import type { CareGuide, CareRecommendation, StagePlaybook } from "@/features/knowledge/preview-knowledge";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";

type Props = Readonly<{
  careGuide: CareGuide | null;
  careRecommendations: readonly CareRecommendation[];
  nextStage: StagePlaybook | null;
  onBack: () => void;
  onOpenNextStage?: () => void;
  plant: Plant;
  playbook: StagePlaybook;
}>;

export function StagePlaybookScreen({
  careGuide,
  careRecommendations,
  nextStage,
  onBack,
  onOpenNextStage,
  plant,
  playbook,
}: Props) {
  return (
    <Screen introduction={null} title="">
      <TopBar backAccessibilityLabel="Quay lại chi tiết cây" onBack={onBack} title="Hướng dẫn chi tiết" />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroEyebrow}>
          <Ionicons color={colors.primarySoft} name="leaf-outline" size={16} />
          <Typography style={styles.heroEyebrowText} variant="label">
            CÂY TRỒNG CỦA TÔI
          </Typography>
        </View>
        <Typography style={styles.heroPlantName} variant="headlineLarge">
          {plant.name}
        </Typography>
        <View style={styles.heroBadge}>
          <Ionicons color="#FFFFFF" name={stageIcon(plant.stageId)} size={14} />
          <Typography style={styles.heroBadgeText} variant="label">
            Giai đoạn: {playbook.title}
          </Typography>
        </View>
        <View style={styles.heroReviewBadge}>
          <Typography color="secondary" variant="label">
            NỘI DUNG CHỜ DUYỆT
          </Typography>
        </View>
      </View>

      {/* Mục tiêu */}
      <View style={styles.section}>
        <SurfaceCard style={styles.objectiveCard}>
          <Typography color="textSecondary" variant="label">
            MỤC TIÊU GIAI ĐOẠN
          </Typography>
          <Typography variant="bodyLarge">{playbook.primaryObjective}</Typography>
          {playbook.estimatedDuration ? (
            <View style={styles.durationRow}>
              <Ionicons color={colors.textSecondary} name="time-outline" size={14} />
              <Typography color="textSecondary" variant="bodyMedium">
                {playbook.estimatedDuration}
              </Typography>
            </View>
          ) : null}
        </SurfaceCard>
      </View>

      {/* Thao tác quan trọng */}
      {careGuide ? (
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Ionicons color={colors.primary} name="checkmark-circle-outline" size={20} />
            <Typography variant="headlineSmall">Thao tác quan trọng</Typography>
          </View>
          <SurfaceCard style={styles.doCard}>
            <View style={styles.actionIcon}>
              <Ionicons color={colors.primary} name="checkmark-done-outline" size={20} />
            </View>
            <View style={styles.actionCopy}>
              <Typography style={styles.doLabel} variant="bodyLarge">
                Nên làm
              </Typography>
              <Typography color="textSecondary" variant="bodyMedium">
                {careGuide.title}
              </Typography>
            </View>
          </SurfaceCard>
        </View>
      ) : null}

      {/* Lưu ý chăm sóc */}
      {careRecommendations.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Ionicons color={colors.primary} name="information-circle-outline" size={20} />
            <Typography variant="headlineSmall">Lưu ý chăm sóc</Typography>
          </View>
          {careRecommendations.map((rec) => (
            <SurfaceCard key={rec.id} style={styles.recCard}>
              <Ionicons color={colors.primary} name="bulb-outline" size={18} />
              <View style={styles.actionCopy}>
                <Typography variant="bodyLarge">{rec.title}</Typography>
              </View>
            </SurfaceCard>
          ))}
        </View>
      ) : null}

      {/* Nên tìm hiểu */}
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

      {/* Tiêu chí hoàn thành */}
      {playbook.exitCriteria.length > 0 ? (
        <View style={styles.section}>
          <SurfaceCard style={styles.exitCard}>
            <View style={styles.exitHeading}>
              <Ionicons color={colors.primary} name="flag-outline" size={18} />
              <Typography color="secondary" variant="label">
                TIÊU CHÍ HOÀN THÀNH GIAI ĐOẠN
              </Typography>
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

      {/* Sắp tới */}
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
              <Typography color="textSecondary" variant="label">
                SẮP TỚI
              </Typography>
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
  actionIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  bulletRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  doCard: {
    alignItems: "flex-start",
    borderLeftColor: colors.primary,
    borderLeftWidth: 3,
    flexDirection: "row",
    gap: spacing.md,
  },
  doLabel: { color: colors.primary },
  durationRow: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  exitCard: { borderColor: colors.primary, borderLeftColor: colors.primary, gap: spacing.sm },
  exitHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  heroBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  heroBadgeText: { color: "#FFFFFF" },
  heroEyebrow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  heroEyebrowText: { color: colors.secondarySoft },
  heroPlantName: { color: "#FFFFFF" },
  heroReviewBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 4,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
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
  recCard: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  section: { gap: spacing.md },
  sectionHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
