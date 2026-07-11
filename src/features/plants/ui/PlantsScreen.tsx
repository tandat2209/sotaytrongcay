import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { Plant } from "../models/plant";

type Props = {
  onOpenPlant?: (id: string) => void;
  plants?: readonly Plant[];
};

export function PlantsScreen({ onOpenPlant = () => undefined, plants = [] }: Props) {
  return (
    <Screen
      introduction="Quản lý cây trồng và xem lịch sử chăm sóc của từng cây."
      title="Cây trồng"
    >
      {plants.length === 0 ? (
        <EmptyState
          description="Cây bạn thêm sẽ được hiển thị tại đây cùng giai đoạn sinh trưởng."
          title="Chưa có cây trồng"
        />
      ) : (
        <View style={styles.list}>
          {plants.map((plant) => (
            <Pressable
              accessibilityLabel={`Mở cây ${plant.name}`}
              accessibilityRole="button"
              key={plant.id}
              onPress={() => onOpenPlant(plant.id)}
            >
              <SurfaceCard style={styles.card}>
                <View style={styles.plantIcon}><Ionicons color={colors.primary} name="leaf-outline" size={22} /></View>
                <View style={styles.copy}>
                  <Typography variant="bodyLarge">{plant.name}</Typography>
                  <Typography color="textSecondary" variant="bodyMedium">Nho · Giai đoạn đã chọn</Typography>
                </View>
                <Ionicons color={colors.textSecondary} name="chevron-forward" size={20} />
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 76 },
  copy: { flex: 1, gap: spacing.xs },
  list: { gap: spacing.md },
  plantIcon: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
});
