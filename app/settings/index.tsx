import {
  Bell,
  ChevronRight,
  ListTree,
  Settings,
  Sprout,
} from "lucide-react-native";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

const settings = [
  { icon: Bell, label: "Thông báo", path: "/settings/notifications" as const },
  {
    icon: ListTree,
    label: "Kế hoạch chăm sóc theo giai đoạn",
    path: "/settings/care-plans" as const,
  },
  {
    icon: Sprout,
    label: "Tùy chỉnh theo cây",
    path: "/settings/plants" as const,
  },
];

export default function SettingsRoute() {
  return (
    <Screen title="">
      <TopBar
        onBack={() => router.back()}
        title="Cài đặt"
        titleIcon={Settings}
      />
      <View style={styles.list}>
        {settings.map(({ icon: Icon, label, path }) => (
          <Pressable
            accessibilityLabel={label}
            accessibilityRole="button"
            key={path}
            onPress={() => router.push(path)}
          >
            <SurfaceCard style={styles.row}>
              <Icon color={colors.primary} size={20} />
              <Typography style={styles.fill} variant="bodyLarge">
                {label}
              </Typography>
              <ChevronRight color={colors.textSecondary} size={20} />
            </SurfaceCard>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  list: { gap: spacing.sm },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 56,
  },
});
