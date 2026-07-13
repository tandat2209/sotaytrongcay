import Ionicons from "@expo/vector-icons/Ionicons";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import type { CarePlan } from "@/features/knowledge/preview-knowledge";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

const activityPresentation = {
  fertilizing: {
    color: colors.activityFertilizing,
    icon: "nutrition-outline" as const,
    label: "Bón phân",
    softColor: colors.activityFertilizingSoft,
  },
  spraying: {
    color: colors.primary,
    icon: "shield-checkmark-outline" as const,
    label: "Phun thuốc",
    softColor: colors.primarySoft,
  },
  watering: {
    color: colors.activityWater,
    icon: "water-outline" as const,
    label: "Tưới nước",
    softColor: colors.activityWaterSoft,
  },
} satisfies Record<CarePlan["activityType"], Readonly<{
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  softColor: string;
}>>;

const activityOrder: Record<CarePlan["activityType"], number> = {
  watering: 0,
  fertilizing: 1,
  spraying: 2,
};

export function StageCarePlanSection({ carePlans }: { carePlans: readonly CarePlan[] }) {
  if (carePlans.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Ionicons color={colors.primary} name="leaf-outline" size={20} />
        <Typography variant="headlineSmall">Chăm sóc cần theo dõi</Typography>
      </View>
      <Typography color="textSecondary" variant="bodyMedium">
        Nội dung chung theo giai đoạn, chưa thay thế đánh giá đất, thời tiết và tình trạng thực tế của cây.
      </Typography>
      {[...carePlans]
        .sort((left, right) => activityOrder[left.activityType] - activityOrder[right.activityType])
        .map((plan) => <CarePlanCard key={plan.id} plan={plan} />)}
    </View>
  );
}

function CarePlanCard({ plan }: { plan: CarePlan }) {
  const presentation = activityPresentation[plan.activityType];

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.planHeading}>
        <View style={[styles.activityIcon, { backgroundColor: presentation.softColor }]}>
          <Ionicons color={presentation.color} name={presentation.icon} size={20} />
        </View>
        <View style={styles.headingCopy}>
          <Typography color="textSecondary" variant="label">{presentation.label.toUpperCase()}</Typography>
          <Typography variant="headlineSmall">{plan.title}</Typography>
        </View>
      </View>

      <PlanDetail label="MỤC TIÊU">
        <Typography variant="bodyLarge">{plan.goal}</Typography>
      </PlanDetail>

      {plan.frequency ? (
        <PlanDetail label="TẦN SUẤT THAM KHẢO">
          <FrequencyRow icon="earth-outline" label="Trồng đất" value={plan.frequency.ground.display} />
          <FrequencyRow icon="cube-outline" label="Trồng chậu" value={plan.frequency.container.display} />
        </PlanDetail>
      ) : null}

      {plan.recommendedInputs?.length ? (
        <PlanDetail label="ĐẦU VÀO THAM KHẢO">
          {plan.recommendedInputs.map((input) => (
            <View key={input.group} style={styles.detailItem}>
              <Typography variant="bodyLarge">{input.group}</Typography>
              <Typography color="textSecondary" variant="bodyMedium">{input.examples}</Typography>
            </View>
          ))}
        </PlanDetail>
      ) : null}

      {plan.notes?.length ? (
        <PlanDetail label="LƯU Ý QUAN TRỌNG">
          {plan.notes.map((note) => (
            <View key={note} style={styles.noteRow}>
              <Ionicons color={presentation.color} name="information-circle-outline" size={18} />
              <Typography color="textSecondary" style={styles.noteCopy} variant="bodyMedium">{note}</Typography>
            </View>
          ))}
        </PlanDetail>
      ) : null}
    </SurfaceCard>
  );
}

function PlanDetail({ children, label }: PropsWithChildren<{ label: string }>) {
  return <View style={styles.detail}><Typography color="primary" variant="label">{label}</Typography>{children}</View>;
}

function FrequencyRow({ icon, label, value }: Readonly<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}>) {
  return (
    <View style={styles.frequencyRow}>
      <Ionicons color={colors.textSecondary} name={icon} size={18} />
      <View style={styles.headingCopy}>
        <Typography variant="bodyLarge">{label}</Typography>
        <Typography color="textSecondary" variant="bodyMedium">{value}</Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityIcon: { alignItems: "center", borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  card: { gap: spacing.lg },
  detail: { gap: spacing.sm },
  detailItem: { gap: spacing.xs },
  frequencyRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  headingCopy: { flex: 1, gap: spacing.xs },
  noteCopy: { flex: 1 },
  noteRow: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  planHeading: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  section: { gap: spacing.md },
});
