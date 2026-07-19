import { Box, Earth, Info, type LucideIcon } from "lucide-react-native";
import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { CarePlan } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export function StageCarePlanDetails({
  plan,
  schedule,
  toneColor,
}: Readonly<{
  plan: CarePlan;
  schedule?: ReactNode;
  toneColor: string;
}>) {
  return (
    <View style={styles.details}>
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

      {schedule}

      {plan.recommendedInputs?.length ? (
        <PlanDetail label={t("plants.guide.inputs")}>
          {plan.recommendedInputs.map((input) => (
            <View key={input.id} style={styles.detailItem}>
              <Typography variant="bodyLarge">{input.name}</Typography>
              <Typography color="textSecondary" variant="bodyMedium">
                {t(`fertilizers.group.${input.group}`)}
              </Typography>
            </View>
          ))}
        </PlanDetail>
      ) : null}

      {plan.notes?.length ? (
        <PlanDetail label={t("plants.guide.notes")}>
          {plan.notes.map((note) => (
            <View key={note} style={styles.noteRow}>
              <Info color={toneColor} size={18} />
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
    </View>
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
      <View style={styles.frequencyCopy}>
        <Typography variant="bodyLarge">{label}</Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {value}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: { gap: spacing.sm },
  detailItem: { gap: spacing.xs },
  details: { gap: spacing.lg },
  frequencyCopy: { flex: 1, gap: spacing.xs },
  frequencyRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
  noteCopy: { flex: 1 },
  noteRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
});
