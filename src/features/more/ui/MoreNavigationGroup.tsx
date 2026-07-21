import { ChevronRight, type LucideIcon } from "lucide-react-native";
import type { Href } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

export type MoreDestination = Readonly<{
  description: string;
  icon: LucideIcon;
  label: string;
  path: Href;
}>;

type Props = Readonly<{
  destinations: readonly MoreDestination[];
  onOpen: (path: Href) => void;
  title: string;
}>;

export function MoreNavigationGroup({ destinations, onOpen, title }: Props) {
  return (
    <View style={styles.section}>
      <Typography variant="sectionTitle">{title}</Typography>
      <View style={styles.group}>
        {destinations.map(({ description, icon: Icon, label, path }, index) => (
          <Pressable
            accessibilityHint={description}
            accessibilityLabel={label}
            accessibilityRole="button"
            key={label}
            onPress={() => onOpen(path)}
            style={({ pressed }) => [
              styles.row,
              index < destinations.length - 1 ? styles.divider : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <View accessibilityElementsHidden style={styles.icon}>
              <Icon color={colors.primary} size={21} />
            </View>
            <View style={styles.copy}>
              <Typography variant="cardTitle">{label}</Typography>
              <Typography color="textSecondary" variant="secondary">
                {description}
              </Typography>
            </View>
            <ChevronRight color={colors.textMuted} size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: { flex: 1, gap: spacing.xs, minWidth: 0 },
  divider: {
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: "hidden",
    paddingHorizontal: spacing.base,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.small,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 84,
    paddingVertical: spacing.md,
  },
  section: { gap: spacing.md },
});
