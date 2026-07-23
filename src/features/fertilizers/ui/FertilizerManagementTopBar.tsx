import { ListFilter, Search, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { t } from "@/shared/i18n";
import { TopBar } from "@/shared/ui/TopBar";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { FertilizerGroup } from "../models/user-fertilizer";
import { FertilizerGroupFilterSheet } from "./FertilizerGroupFilterSheet";

type Props = Readonly<{
  group: FertilizerGroup | null;
  onBack: () => void;
  onGroupChange: (group: FertilizerGroup | null) => void;
  onSearchChange: (search: string) => void;
  search: string;
}>;

export function FertilizerManagementTopBar({
  group,
  onBack,
  onGroupChange,
  onSearchChange,
  search,
}: Props) {
  const [searching, setSearching] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const closeSearch = () => {
    onSearchChange("");
    setSearching(false);
  };
  const filterAccessibilityLabel = group
    ? t("fertilizers.management.openSelectedFilter", {
        group: t(`fertilizers.group.${group}`),
      })
    : t("fertilizers.management.openFilter");

  return (
    <>
      <TopBar
        action={
          <View style={styles.actions}>
            {!searching ? (
              <HeaderIconButton
                accessibilityLabel={t("fertilizers.management.openSearch")}
                icon={Search}
                onPress={() => setSearching(true)}
              />
            ) : null}
            <HeaderIconButton
              accessibilityLabel={filterAccessibilityLabel}
              icon={ListFilter}
              onPress={() => setFilterVisible(true)}
              selected={group !== null}
            />
          </View>
        }
        backAccessibilityLabel={
          searching
            ? t("fertilizers.management.closeSearch")
            : t("common.actions.back")
        }
        onBack={searching ? closeSearch : onBack}
        title={
          searching ? (
            <View style={styles.search}>
              <Search color={colors.textSecondary} size={18} />
              <TextInput
                accessibilityLabel={t("fertilizers.management.search")}
                autoFocus
                onChangeText={onSearchChange}
                placeholder={t("fertilizers.management.search")}
                placeholderTextColor={colors.textSecondary}
                style={styles.searchInput}
                value={search}
              />
            </View>
          ) : (
            t("fertilizers.management.title")
          )
        }
      />
      <FertilizerGroupFilterSheet
        onChange={onGroupChange}
        onDismiss={() => setFilterVisible(false)}
        value={group}
        visible={filterVisible}
      />
    </>
  );
}

function HeaderIconButton({
  accessibilityLabel,
  icon: Icon,
  onPress,
  selected = false,
}: Readonly<{
  accessibilityLabel: string;
  icon: LucideIcon;
  onPress: () => void;
  selected?: boolean;
}>) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        selected && styles.selectedIconButton,
        pressed && styles.pressed,
      ]}
    >
      <Icon color={selected ? colors.primary : colors.text} size={22} />
      {selected ? <View style={styles.activeDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: "center", flexDirection: "row" },
  activeDot: {
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 9,
    position: "absolute",
    right: 7,
    top: 7,
    width: 9,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: radius.round,
    height: control.iconTarget,
    justifyContent: "center",
    width: control.iconTarget,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
  search: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: control.iconTarget,
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: colors.text, flex: 1, fontSize: 16, minWidth: 0 },
  selectedIconButton: { backgroundColor: colors.primarySoft },
});
