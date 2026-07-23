import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Sprout,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { toggleBatchCarePlant } from "@/features/plants/models/batch-care-selection";
import { t } from "@/shared/i18n";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";
import { PlantIdentity } from "./PlantIdentity";

type Props = {
  onOpenPlant?: (id: string) => void;
  onStartBatchCare?: (plantIds: readonly string[]) => void;
  photoUris?: Readonly<Record<string, string>>;
  plants?: readonly Plant[];
};

export function PlantsScreen({
  onOpenPlant = () => undefined,
  onStartBatchCare = () => undefined,
  photoUris = {},
  plants = [],
}: Props) {
  const [selecting, setSelecting] = useState(false);
  const [selectedPlantIds, setSelectedPlantIds] = useState<readonly string[]>(
    [],
  );

  function cancelSelection() {
    setSelectedPlantIds([]);
    setSelecting(false);
  }

  function continueBatchCare() {
    if (selectedPlantIds.length < 2) return;
    const plantIds = selectedPlantIds;
    cancelSelection();
    onStartBatchCare(plantIds);
  }

  return (
    <Screen
      footer={
        selecting ? (
          <View style={styles.footer}>
            {selectedPlantIds.length < 2 ? (
              <Typography color="textSecondary" variant="bodyMedium">
                {t("plants.batch.minimum")}
              </Typography>
            ) : null}
            <PrimaryButton
              disabled={selectedPlantIds.length < 2}
              label={t("plants.batch.continue", {
                count: selectedPlantIds.length,
              })}
              onPress={continueBatchCare}
            />
          </View>
        ) : undefined
      }
      headerAction={
        plants.length >= 2 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => (selecting ? cancelSelection() : setSelecting(true))}
            style={styles.headerAction}
          >
            <Typography color="primary" variant="bodyLarge">
              {t(selecting ? "plants.batch.cancel" : "plants.batch.action")}
            </Typography>
          </Pressable>
        ) : null
      }
      introduction={t(
        selecting ? "plants.batch.introduction" : "plants.list.introduction",
      )}
      title={t("navigation.tabs.plants")}
      titleIcon={Sprout}
    >
      {plants.length === 0 ? (
        <EmptyState
          description={t("plants.list.emptyDescription")}
          icon={Sprout}
          title={t("plants.list.emptyTitle")}
        />
      ) : (
        <View style={styles.list}>
          {plants.map((plant) => {
            const identity = resolvePlantIdentity(plant);
            const selected = selectedPlantIds.includes(plant.id);
            return (
              <Pressable
                accessibilityLabel={t(
                  selecting
                    ? selected
                      ? "plants.batch.unselectAccessibility"
                      : "plants.batch.selectAccessibility"
                    : "plants.list.openAccessibility",
                  { plant: plant.name },
                )}
                accessibilityRole={selecting ? "checkbox" : "button"}
                {...(selecting
                  ? { accessibilityState: { checked: selected } }
                  : {})}
                key={plant.id}
                onPress={() =>
                  selecting
                    ? setSelectedPlantIds((current) =>
                        toggleBatchCarePlant(current, plant.id),
                      )
                    : onOpenPlant(plant.id)
                }
              >
                <SurfaceCard
                  style={[styles.card, selected && styles.selectedCard]}
                >
                  <PlantIdentity
                    imageUri={photoUris[plant.id] ?? null}
                    name={plant.name}
                    size="list"
                    speciesTitle={identity.speciesTitle}
                    stageId={plant.stageId}
                    stageTitle={identity.stageTitle}
                  />
                  {selecting ? (
                    selected ? (
                      <CheckCircle2 color={colors.primary} size={24} />
                    ) : (
                      <Circle color={colors.textSecondary} size={24} />
                    )
                  ) : (
                    <ChevronRight color={colors.textSecondary} size={20} />
                  )}
                </SurfaceCard>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 76,
  },
  footer: { gap: spacing.sm },
  headerAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  list: { gap: spacing.base },
  selectedCard: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
});
