import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Ellipsis,
  ListTree,
  PackageOpen,
  Sprout,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

const destinations = [
  {
    icon: PackageOpen,
    label: t("more.row.fertilizers"),
    path: "/more/fertilizers" as const,
  },
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

export function MoreScreen() {
  return (
    <Screen
      introduction={t("more.introduction")}
      title={t("navigation.tabs.more")}
      titleIcon={Ellipsis}
    >
      <View style={styles.list}>
        {destinations.map(({ icon: Icon, label, path }) => (
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
