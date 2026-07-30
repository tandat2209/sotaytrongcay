import { ListChecks, X } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import type { CareActivityType } from "../models/care-activity";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import type { Plant } from "@/features/plants";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { radius, spacing } from "@/shared/ui/theme";
import { getCareActivityLabel } from "./care-activity-copy";
import { BatchCarePlantSummary } from "./BatchCarePlantSummary";

const activityTypes: readonly CareActivityType[] = [
  "watering",
  "fertilizing",
  "spraying",
];

type Props = Readonly<{
  onBack: () => void;
  onChoose: (type: CareActivityType) => void;
  plants: readonly Plant[];
}>;

export function BatchActivityTypeScreen({ onBack, onChoose, plants }: Props) {
  return (
    <Screen
      headerAction={
        <IconButton
          accessibilityLabel={t("common.actions.close")}
          icon={X}
          onPress={onBack}
        />
      }
      introduction={t("plants.batch.chooseActivity")}
      title={t("plants.batch.title")}
      titleIcon={ListChecks}
    >
      <BatchCarePlantSummary plants={plants} />
      <View style={styles.options}>
        {activityTypes.map((type) => {
          const visual = CARE_ACTIVITY_VISUALS[type];
          const Icon = visual.icon;
          const label = getCareActivityLabel(type);
          return (
            <Pressable
              accessibilityLabel={t("plants.batch.applyActivity", {
                activity: label,
                count: plants.length,
              })}
              accessibilityRole="button"
              key={type}
              onPress={() => onChoose(type)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <SurfaceCard style={styles.option}>
                <View
                  accessibilityElementsHidden
                  style={[
                    styles.activityIcon,
                    { backgroundColor: visual.backgroundColor },
                  ]}
                >
                  <Icon color={visual.color} size={24} />
                </View>
                <Typography style={styles.label} variant="cardTitle">
                  {label}
                </Typography>
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  activityIcon: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  label: { flex: 1 },
  option: { alignItems: "center", flexDirection: "row", gap: spacing.base },
  options: { gap: spacing.md },
  pressed: { opacity: 0.78 },
});
