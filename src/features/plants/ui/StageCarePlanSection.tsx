import {
  ChevronDown,
  ChevronUp,
  Leaf,
  type LucideIcon,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CARE_ACTIVITY_VISUALS } from "@/features/journal";
import type { CarePlan } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { StageCarePlanDetails } from "./StageCarePlanDetails";

const activityPresentation = {
  fertilizing: {
    color: colors.activityFertilizing,
    icon: CARE_ACTIVITY_VISUALS.fertilizing.icon,
    softColor: colors.activityFertilizingSoft,
  },
  spraying: {
    color: colors.primary,
    icon: CARE_ACTIVITY_VISUALS.spraying.icon,
    softColor: colors.primarySoft,
  },
  watering: {
    color: colors.activityWater,
    icon: CARE_ACTIVITY_VISUALS.watering.icon,
    softColor: colors.activityWaterSoft,
  },
} satisfies Record<
  CarePlan["activityType"],
  Readonly<{
    color: string;
    icon: LucideIcon;
    softColor: string;
  }>
>;

const activityOrder: Record<CarePlan["activityType"], number> = {
  watering: 0,
  fertilizing: 1,
  spraying: 2,
};

export function StageCarePlanSection({
  carePlans,
  emptyMessage,
  renderSchedule,
}: {
  carePlans: readonly CarePlan[];
  emptyMessage?: ReactNode;
  renderSchedule?: (plan: CarePlan) => ReactNode;
}) {
  if (carePlans.length === 0) {
    return emptyMessage ? (
      <View style={styles.section}>{emptyMessage}</View>
    ) : null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Leaf color={colors.primary} size={20} />
        <Typography variant="headlineSmall">
          {t("plants.guide.careTitle")}
        </Typography>
      </View>
      <Typography color="textSecondary" variant="bodyMedium">
        {t("plants.guide.careDisclaimer")}
      </Typography>
      {[...carePlans]
        .sort(
          (left, right) =>
            activityOrder[left.activityType] -
            activityOrder[right.activityType],
        )
        .map((plan) => (
          <CarePlanCard
            key={plan.id}
            plan={plan}
            schedule={renderSchedule?.(plan)}
          />
        ))}
    </View>
  );
}

function CarePlanCard({
  plan,
  schedule,
}: Readonly<{ plan: CarePlan; schedule?: ReactNode }>) {
  const [expanded, setExpanded] = useState(false);
  const presentation = activityPresentation[plan.activityType];
  const ActivityIcon = presentation.icon;
  const ToggleIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <SurfaceCard style={styles.card}>
      <Pressable
        accessibilityLabel={t("plants.guide.careToggleAccessibility", {
          title: plan.title,
        })}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [styles.planHeading, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.activityIcon,
            { backgroundColor: presentation.softColor },
          ]}
        >
          <ActivityIcon color={presentation.color} size={20} />
        </View>
        <View style={styles.headingCopy}>
          <Typography variant="headlineSmall">{plan.title}</Typography>
        </View>
        <ToggleIcon color={colors.textSecondary} size={20} />
      </Pressable>

      {expanded ? (
        <StageCarePlanDetails
          plan={plan}
          schedule={schedule}
          toneColor={presentation.color}
        />
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  activityIcon: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  card: { gap: spacing.md },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  headingCopy: { flex: 1, gap: spacing.xs },
  planHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 44,
  },
  pressed: { opacity: 0.72 },
  section: { gap: spacing.md },
});
