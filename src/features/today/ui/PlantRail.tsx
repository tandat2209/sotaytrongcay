import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { PlantIdentity, resolvePlantIdentity, type Plant } from "@/features/plants";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = { onAddPlant: () => void; onOpenPlant: (id: string) => void; plants: readonly Plant[] };

export function PlantRail({ onAddPlant, onOpenPlant, plants }: Props) {
  return <View style={styles.section}>
    <Typography variant="headlineSmall">Cây của bạn</Typography>
    <ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
      {plants.map((plant) => {
        const identity = resolvePlantIdentity(plant);
        return <Pressable accessibilityLabel={`Mở cây ${plant.name}`} accessibilityRole="button" key={plant.id} onPress={() => onOpenPlant(plant.id)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}><PlantIdentity name={plant.name} size="rail" speciesTitle={identity.speciesTitle} stageId={plant.stageId} stageTitle={identity.stageTitle} /></Pressable>;
      })}
      <Pressable accessibilityLabel="Thêm cây" accessibilityRole="button" onPress={onAddPlant} style={({ pressed }) => [styles.addItem, pressed && styles.pressed]}><View style={styles.addCircle}><Ionicons color={colors.primary} name="add" size={30} /></View><Typography color="primary" style={styles.label} variant="label">Thêm cây</Typography></Pressable>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  addCircle: { alignItems: "center", borderColor: colors.primary, borderRadius: radius.round, borderStyle: "dashed", borderWidth: 1.5, height: 64, justifyContent: "center", width: 64 },
  addItem: { alignItems: "center", gap: spacing.sm, width: 116 }, content: { gap: spacing.md, paddingRight: spacing.md }, item: { width: 116 }, label: { textAlign: "center" }, pressed: { opacity: 0.7 }, section: { gap: spacing.md },
});
