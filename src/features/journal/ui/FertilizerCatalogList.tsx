import { Search, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  filterUserFertilizers,
  type UserFertilizer,
} from "@/features/fertilizers";
import type { UserFertilizerUsage } from "../models/suggested-fertilizer-application";
import { selectRecentUserFertilizers } from "../models/fertilizer-selection";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  failed: boolean;
  fertilizers: readonly UserFertilizer[];
  loading: boolean;
  onAdd: () => void;
  onRetry: () => void;
  onSelect: (fertilizer: UserFertilizer) => void;
  selectedIds: readonly string[];
  usages: Readonly<Record<string, UserFertilizerUsage>>;
}>;

export function FertilizerCatalogList({
  failed,
  fertilizers,
  loading,
  onAdd,
  onRetry,
  onSelect,
  selectedIds,
  usages,
}: Props) {
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const available = fertilizers.filter(
    (fertilizer) => !selectedIds.includes(fertilizer.id),
  );
  const visible = searching
    ? filterUserFertilizers(available, search, null)
    : selectRecentUserFertilizers(available, usages);

  return (
    <View style={styles.catalog}>
      <View style={styles.heading}>
        <Typography color="textSecondary" variant="label">
          {t(
            searching
              ? "journal.fertilizing.searchCatalog"
              : "journal.fertilizing.recent",
          )}
        </Typography>
        <IconButton
          accessibilityLabel={t(
            searching
              ? "journal.fertilizing.closeSearch"
              : "journal.fertilizing.openSearch",
          )}
          icon={searching ? X : Search}
          onPress={() => setSearching((value) => !value)}
        />
      </View>
      {searching ? (
        <View style={styles.search}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            accessibilityLabel={t("fertilizers.management.search")}
            autoFocus
            onChangeText={setSearch}
            placeholder={t("fertilizers.management.search")}
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            value={search}
          />
        </View>
      ) : null}
      <View style={styles.chips}>
        {visible.map((fertilizer) => {
          const label = fertilizer.group
            ? `${t(`fertilizers.group.${fertilizer.group}`)} · ${fertilizer.name}`
            : fertilizer.name;
          return (
            <SelectableChip
              accessibilityLabel={t(
                "journal.fertilizing.suggestion.unselected",
                { name: label },
              )}
              key={fertilizer.id}
              label={label}
              onPress={() => onSelect(fertilizer)}
              selected={false}
              unselectedPrefix="+ "
            />
          );
        })}
        <SelectableChip
          accent
          accessibilityLabel={t("fertilizers.management.add")}
          label={t("fertilizers.management.add")}
          onPress={onAdd}
          selected={false}
          unselectedPrefix="+ "
        />
      </View>
      {loading ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("common.state.loadingDeviceData")}
        </Typography>
      ) : failed ? (
        <View style={styles.error}>
          <Typography
            accessibilityRole="alert"
            color="error"
            variant="bodyMedium"
          >
            {t("fertilizers.error.load")}
          </Typography>
          <Pressable accessibilityRole="button" onPress={onRetry}>
            <Typography color="primary" variant="bodyMedium">
              {t("common.actions.retry")}
            </Typography>
          </Pressable>
        </View>
      ) : visible.length === 0 ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t(
            searching
              ? "fertilizers.management.noMatch"
              : "journal.fertilizing.noRecent",
          )}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  catalog: { gap: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  error: { gap: spacing.sm },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  search: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: colors.text, flex: 1, fontSize: 16 },
});
