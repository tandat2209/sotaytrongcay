import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Screen } from "@/shared/ui/Screen";
import { colors, radius, spacing } from "@/shared/ui/theme";
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
              style={styles.card}
            >
              <Text style={styles.name}>{plant.name}</Text>
              <Text style={styles.meta}>Nho · Giai đoạn đã chọn</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    minHeight: 72,
    padding: spacing.md,
  },
  name: { color: colors.text, fontSize: 16, fontWeight: "600" },
  meta: { color: colors.textSecondary, fontSize: 14 },
});
