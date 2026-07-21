import { ChevronRight, Sprout } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { t } from "@/shared/i18n";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { colors, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";
import { PlantIdentity } from "./PlantIdentity";

type Props = {
  onOpenPlant?: (id: string) => void;
  photoUris?: Readonly<Record<string, string>>;
  plants?: readonly Plant[];
};

export function PlantsScreen({
  onOpenPlant = () => undefined,
  photoUris = {},
  plants = [],
}: Props) {
  return (
    <Screen
      introduction={t("plants.list.introduction")}
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
            return (
              <Pressable
                accessibilityLabel={t("plants.list.openAccessibility", {
                  plant: plant.name,
                })}
                accessibilityRole="button"
                key={plant.id}
                onPress={() => onOpenPlant(plant.id)}
              >
                <SurfaceCard style={styles.card}>
                  <PlantIdentity
                    imageUri={photoUris[plant.id] ?? null}
                    name={plant.name}
                    size="list"
                    speciesTitle={identity.speciesTitle}
                    stageId={plant.stageId}
                    stageTitle={identity.stageTitle}
                  />
                  <ChevronRight color={colors.textSecondary} size={20} />
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
  list: { gap: spacing.base },
});
