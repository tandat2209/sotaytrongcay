import { Filter, Search, X } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { colors, control, radius, spacing } from "@/shared/ui/theme";

type ActionsProps = Readonly<{
  filtersActive: boolean;
  onFilterPress: () => void;
  onSearchPress: () => void;
  searching: boolean;
}>;

export function JournalHeaderActions({
  filtersActive,
  onFilterPress,
  onSearchPress,
  searching,
}: ActionsProps) {
  return (
    <View style={styles.actions}>
      {!searching ? (
        <IconButton
          accessibilityLabel={t("journal.list.search")}
          icon={Search}
          onPress={onSearchPress}
        />
      ) : null}
      <IconButton
        accessibilityLabel={t(
          filtersActive ? "journal.filter.openActive" : "journal.filter.open",
        )}
        icon={Filter}
        onPress={onFilterPress}
        selected={filtersActive}
      />
    </View>
  );
}

type SearchProps = Readonly<{
  onChange: (query: string) => void;
  onClose: () => void;
  query: string;
}>;

export function JournalSearchField({ onChange, onClose, query }: SearchProps) {
  return (
    <View style={styles.search}>
      <Search color={colors.textSecondary} size={18} />
      <TextInput
        accessibilityLabel={t("journal.list.search")}
        autoCorrect
        autoFocus
        onChangeText={onChange}
        placeholder={t("journal.list.search")}
        placeholderTextColor={colors.textSecondary}
        style={styles.searchInput}
        value={query}
      />
      <IconButton
        accessibilityLabel={t("common.actions.close")}
        icon={X}
        onPress={onClose}
      />
    </View>
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
    flexDirection: "row",
    minHeight: control.iconTarget,
    paddingLeft: spacing.md,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    minWidth: 0,
    paddingHorizontal: spacing.sm,
  },
});
