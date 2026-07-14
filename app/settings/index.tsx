import { Bell, ChevronRight, Settings } from "lucide-react-native";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export default function SettingsRoute() {
  return (
    <Screen title="">
      <TopBar onBack={() => router.back()} title="Cài đặt" titleIcon={Settings} />
      <View style={styles.list}>
        <SettingRow label="Thông báo" onPress={() => router.push("/reminders")} />
        <SettingRow label="Lời nhắc" onPress={() => router.push("/reminders")} />
        <SettingRow
          label="Tùy chọn kế hoạch chăm sóc"
          onPress={() => router.push("/reminders")}
        />
      </View>
    </Screen>
  );
}

function SettingRow({ label, onPress }: Readonly<{ label: string; onPress: () => void }>) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <SurfaceCard style={styles.row}>
        <Bell color={colors.primary} size={20} />
        <Typography style={styles.fill} variant="bodyLarge">{label}</Typography>
        <ChevronRight color={colors.textSecondary} size={20} />
      </SurfaceCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  list: { gap: spacing.sm },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.sm, minHeight: 56 },
});
