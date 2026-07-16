import { BookOpen, ChevronRight, Flag } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { StageIcon } from "@/features/knowledge/stage-icons";
import type {
  CareGuide,
  CarePlan,
  StageThreat,
  StagePlaybook,
} from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { StageCarePlanSection } from "./StageCarePlanSection";
import { StageInformationalGuideSection } from "./StageInformationalGuideSection";
import { StagePlaybookHero } from "./StagePlaybookHero";
import { StageThreatSection } from "./StageThreatSection";

type Props = Readonly<{
  carePlans: readonly CarePlan[];
  carePlansEmptyMessage?: ReactNode;
  informationalGuides: readonly CareGuide[];
  nextStage: StagePlaybook | null;
  onBack: () => void;
  onOpenNextStage?: () => void;
  playbook: StagePlaybook;
  renderCarePlanSchedule?: (plan: CarePlan) => ReactNode;
  screenTitle?: string;
  threats?: readonly StageThreat[];
}>;

export function StagePlaybookScreen({
  carePlans,
  carePlansEmptyMessage,
  informationalGuides,
  nextStage,
  onBack,
  onOpenNextStage,
  playbook,
  renderCarePlanSchedule,
  screenTitle,
  threats = [],
}: Props) {
  return (
    <Screen introduction={null} title="">
      <TopBar
        backAccessibilityLabel={t("plants.guide.back")}
        onBack={onBack}
        title={screenTitle ?? t("plants.guide.details")}
        titleIcon={BookOpen}
      />

      <StagePlaybookHero playbook={playbook} />

      <StageCarePlanSection
        carePlans={carePlans}
        emptyMessage={carePlansEmptyMessage}
        {...(renderCarePlanSchedule
          ? { renderSchedule: renderCarePlanSchedule }
          : {})}
      />

      <StageInformationalGuideSection guides={informationalGuides} />

      <StageThreatSection threats={threats} />

      {playbook.exitCriteria.length > 0 ? (
        <View style={styles.section}>
          <SurfaceCard style={styles.exitCard}>
            <View style={styles.exitHeading}>
              <Flag color={colors.primary} size={18} />
              <Typography color="secondary" variant="label">
                {t("plants.guide.completionCriteria")}
              </Typography>
            </View>
            {playbook.exitCriteria.map((criterion) => (
              <View key={criterion} style={styles.bulletRow}>
                <Typography color="textSecondary" variant="bodyMedium">
                  ·
                </Typography>
                <Typography variant="bodyMedium">{criterion}</Typography>
              </View>
            ))}
          </SurfaceCard>
        </View>
      ) : null}

      {nextStage && onOpenNextStage ? (
        <Pressable
          accessibilityLabel={t("plants.guide.nextAccessibility", {
            stage: nextStage.title,
          })}
          accessibilityRole="button"
          onPress={onOpenNextStage}
        >
          <SurfaceCard style={styles.nextStageCard}>
            <View style={styles.nextStageIcon}>
              <StageIcon
                color={colors.secondary}
                size={22}
                stageId={nextStage.id}
              />
            </View>
            <View style={styles.actionCopy}>
              <Typography color="textSecondary" variant="label">
                {t("plants.guide.next")}
              </Typography>
              <Typography variant="headlineSmall">
                {t("plants.guide.nextStage", { stage: nextStage.title })}
              </Typography>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </SurfaceCard>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionCopy: { flex: 1, gap: spacing.xs },
  bulletRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  exitCard: {
    borderColor: colors.primary,
    borderLeftColor: colors.primary,
    gap: spacing.sm,
  },
  exitHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
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
  section: { gap: spacing.md },
});
