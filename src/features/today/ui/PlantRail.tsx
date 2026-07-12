import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { Plant } from "@/features/plants";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = {
  onAddPlant: () => void;
  onOpenPlant: (id: string) => void;
  plants: readonly Plant[];
};

export function PlantRail({ onAddPlant, onOpenPlant, plants }: Props) {
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">Cây của bạn</Typography>
      <ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
        {plants.map((plant) => (
          <Pressable accessibilityLabel={`Mở cây ${plant.name}`} accessibilityRole="button" key={plant.id} onPress={() => onOpenPlant(plant.id)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <View style={styles.plantCircle}><Ionicons color={colors.primary} name="leaf-outline" size={28} /></View>
            <Typography style={styles.label} variant="label">{plant.name}</Typography>
          </Pressable>
        ))}
        <Pressable accessibilityLabel="Thêm cây" accessibilityRole="button" onPress={onAddPlant} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
          <View style={styles.addCircle}><Ionicons color={colors.primary} name="add" size={30} /></View>
          <Typography color="primary" style={styles.label} variant="label">Thêm cây</Typography>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addCircle: { alignItems: "center", borderColor: colors.primary, borderRadius: radius.round, borderStyle: "dashed", borderWidth: 1.5, height: 64, justifyContent: "center", width: 64 },
  content: { gap: spacing.md, paddingRight: spacing.md },
  item: { alignItems: "center", gap: spacing.sm, minWidth: 72, width: 80 },
  label: { textAlign: "center" },
  plantCircle: { alignItems: "center", backgroundColor: colors.primarySoft, borderColor: colors.primary, borderRadius: radius.round, borderWidth: 2, height: 64, justifyContent: "center", width: 64 },
  pressed: { opacity: 0.7 },
  section: { gap: spacing.md },
});
