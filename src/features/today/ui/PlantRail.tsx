import { Plus, Sprout } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  PlantIdentity,
  resolvePlantIdentity,
  type Plant,
} from "@/features/plants";
import { t } from "@/shared/i18n";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = {
  onAddPlant: () => void;
  onOpenPlant: (id: string) => void;
  photoUris: Readonly<Record<string, string>>;
  plants: readonly Plant[];
};

export function PlantRail({
  onAddPlant,
  onOpenPlant,
  photoUris,
  plants,
}: Props) {
  return (
    <View style={styles.section}>
      <SectionHeader
        action={
          <Pressable
            accessibilityLabel={t("today.overview.addPlant")}
            accessibilityRole="button"
            onPress={onAddPlant}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
          >
            <Plus color={colors.primary} size={18} />
            <Typography color="primary" variant="label">
              {t("today.overview.addPlant")}
            </Typography>
          </Pressable>
        }
        icon={Sprout}
        title={t("today.overview.myGarden")}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
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
              style={({ pressed }) => pressed && styles.pressed}
            >
              <PlantIdentity
                imageUri={photoUris[plant.id] ?? null}
                name={plant.name}
                size="rail"
                speciesTitle={identity.speciesTitle}
                stageId={plant.stageId}
                stageTitle={identity.stageTitle}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    borderRadius: radius.control,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  content: { gap: spacing.base, paddingBottom: 1, paddingRight: spacing.base },
  pressed: { opacity: 0.7 },
  section: { gap: spacing.base },
});
