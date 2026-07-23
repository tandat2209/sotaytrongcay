import { ListFilter, Search } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
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
              <IconButton
                accessibilityLabel={t("fertilizers.management.openSearch")}
                icon={Search}
                onPress={() => setSearching(true)}
              />
            ) : null}
            <IconButton
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

const styles = StyleSheet.create({
  actions: { alignItems: "center", flexDirection: "row" },
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
});
