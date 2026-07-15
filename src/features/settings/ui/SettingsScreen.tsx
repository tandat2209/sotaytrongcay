import { t } from "@/shared/i18n";
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
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

const settings = [
  {
    icon: Bell,
    label: t("settings.row.notifications"),
    path: "/settings/notifications" as const,
  },
  {
    icon: ListTree,
    label: t("settings.row.carePlans"),
    path: "/settings/care-plans" as const,
  },
  {
    icon: Sprout,
    label: t("settings.row.plants"),
    path: "/settings/plants" as const,
  },
];

export function SettingsScreen() {
  return (
    <Screen
      introduction={t("settings.introduction")}
      title={t("navigation.tabs.settings")}
      titleIcon={Settings}
    >
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
