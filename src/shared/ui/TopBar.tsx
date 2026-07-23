import { t } from "@/shared/i18n";
import { ChevronLeft, type LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "./IconButton";
import { Typography } from "./Typography";
import { colors, spacing } from "./theme";

type TopBarProps = {
  action?: ReactNode;
  backAccessibilityLabel?: string;
  onBack: () => void;
  title: ReactNode;
  titleIcon?: LucideIcon;
};

export function TopBar({
  action,
  backAccessibilityLabel = t("common.actions.back"),
  onBack,
  title,
  titleIcon: TitleIcon,
}: TopBarProps) {
  return (
    <View style={styles.bar}>
      <IconButton
        accessibilityLabel={backAccessibilityLabel}
        icon={ChevronLeft}
        onPress={onBack}
      />
      <View style={styles.titleWrap}>
        {TitleIcon ? <TitleIcon color={colors.primary} size={20} /> : null}
        {typeof title === "string" ? (
          <Typography style={styles.title} variant="cardTitle">
            {title}
          </Typography>
        ) : (
          title
        )}
      </View>
      <View style={styles.action}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { alignItems: "flex-end", minWidth: 44 },
  bar: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 56,
  },
  title: { flex: 1 },
  titleWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
  },
});
