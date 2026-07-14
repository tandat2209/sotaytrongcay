import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
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

export function PlantsScreen({ onOpenPlant = () => undefined, photoUris = {}, plants = [] }: Props) {
  return <Screen introduction="Quản lý cây trồng và xem lịch sử chăm sóc của từng cây." title="Cây trồng">
    {plants.length === 0 ? <EmptyState description="Cây bạn thêm sẽ được hiển thị tại đây cùng giai đoạn sinh trưởng." title="Chưa có cây trồng" /> : <View style={styles.list}>
      {plants.map((plant) => {
        const identity = resolvePlantIdentity(plant);
        return <Pressable accessibilityLabel={`Mở cây ${plant.name}`} accessibilityRole="button" key={plant.id} onPress={() => onOpenPlant(plant.id)}>
          <SurfaceCard style={styles.card}>
            <PlantIdentity imageUri={photoUris[plant.id] ?? null} name={plant.name} size="list" speciesTitle={identity.speciesTitle} stageId={plant.stageId} stageTitle={identity.stageTitle} />
            <Ionicons color={colors.textSecondary} name="chevron-forward" size={20} />
          </SurfaceCard>
        </Pressable>;
      })}
    </View>}
  </Screen>;
}

const styles = StyleSheet.create({
  card: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 76 },
  list: { gap: spacing.md },
});
