import { Box, Earth, Info, Leaf, type LucideIcon } from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
} from "@/features/journal";
import type { CarePlan } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

const activityPresentation = {
  fertilizing: {
    color: colors.activityFertilizing,
    icon: CARE_ACTIVITY_VISUALS.fertilizing.icon,
    label: getCareActivityLabel("fertilizing"),
    softColor: colors.activityFertilizingSoft,
  },
  spraying: {
    color: colors.primary,
    icon: CARE_ACTIVITY_VISUALS.spraying.icon,
    label: getCareActivityLabel("spraying"),
    softColor: colors.primarySoft,
  },
  watering: {
    color: colors.activityWater,
    icon: CARE_ACTIVITY_VISUALS.watering.icon,
    label: getCareActivityLabel("watering"),
    softColor: colors.activityWaterSoft,
  },
} satisfies Record<
  CarePlan["activityType"],
  Readonly<{
    color: string;
    icon: LucideIcon;
    label: string;
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
}: {
  carePlans: readonly CarePlan[];
}) {
  if (carePlans.length === 0) return null;

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
          <CarePlanCard key={plan.id} plan={plan} />
        ))}
    </View>
  );
}

function CarePlanCard({ plan }: { plan: CarePlan }) {
  const presentation = activityPresentation[plan.activityType];
  const ActivityIcon = presentation.icon;

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.planHeading}>
        <View
          style={[
            styles.activityIcon,
            { backgroundColor: presentation.softColor },
          ]}
        >
          <ActivityIcon color={presentation.color} size={20} />
        </View>
        <View style={styles.headingCopy}>
          <Typography color="textSecondary" variant="label">
            {presentation.label.toUpperCase()}
          </Typography>
          <Typography variant="headlineSmall">{plan.title}</Typography>
        </View>
      </View>

      <PlanDetail label={t("plants.guide.objective")}>
        <Typography variant="bodyLarge">{plan.goal}</Typography>
      </PlanDetail>

      {plan.frequency ? (
        <PlanDetail label={t("plants.guide.frequency")}>
          <FrequencyRow
            icon={Earth}
            label={t("plants.guide.ground")}
            value={plan.frequency.ground.display}
          />
          <FrequencyRow
            icon={Box}
            label={t("plants.guide.container")}
            value={plan.frequency.container.display}
          />
        </PlanDetail>
      ) : null}

      {plan.recommendedInputs?.length ? (
        <PlanDetail label={t("plants.guide.inputs")}>
          {plan.recommendedInputs.map((input) => (
            <View key={input.group} style={styles.detailItem}>
              <Typography variant="bodyLarge">{input.group}</Typography>
              <Typography color="textSecondary" variant="bodyMedium">
                {input.examples}
              </Typography>
            </View>
          ))}
        </PlanDetail>
      ) : null}

      {plan.notes?.length ? (
        <PlanDetail label={t("plants.guide.notes")}>
          {plan.notes.map((note) => (
            <View key={note} style={styles.noteRow}>
              <Info color={presentation.color} size={18} />
              <Typography
                color="textSecondary"
                style={styles.noteCopy}
                variant="bodyMedium"
              >
                {note}
              </Typography>
            </View>
          ))}
        </PlanDetail>
      ) : null}
    </SurfaceCard>
  );
}

function PlanDetail({ children, label }: PropsWithChildren<{ label: string }>) {
  return (
    <View style={styles.detail}>
      <Typography color="primary" variant="label">
        {label}
      </Typography>
      {children}
    </View>
  );
}

function FrequencyRow({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: LucideIcon;
  label: string;
  value: string;
}>) {
  return (
    <View style={styles.frequencyRow}>
      <Icon color={colors.textSecondary} size={18} />
      <View style={styles.headingCopy}>
        <Typography variant="bodyLarge">{label}</Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {value}
        </Typography>
      </View>
    </View>
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
  card: { gap: spacing.lg },
  detail: { gap: spacing.sm },
  detailItem: { gap: spacing.xs },
  frequencyRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  headingCopy: { flex: 1, gap: spacing.xs },
  noteCopy: { flex: 1 },
  noteRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  planHeading: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  section: { gap: spacing.md },
});
