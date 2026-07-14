import { ChevronRight, Settings, UserRound } from "lucide-react-native";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export function MeScreen() {
  return (
    <Screen
      introduction="Quản lý tùy chọn ứng dụng và dữ liệu của bạn."
      title="Tôi"
      titleIcon={UserRound}
    >
      <Pressable
        accessibilityLabel="Mở Cài đặt"
        accessibilityRole="button"
        onPress={() => router.push("/settings")}
      >
        <SurfaceCard style={styles.row}>
          <Settings color={colors.primary} size={22} />
          <Typography style={styles.fill} variant="bodyLarge">
            Cài đặt
          </Typography>
          <ChevronRight color={colors.textSecondary} size={20} />
        </SurfaceCard>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 56,
  },
});
