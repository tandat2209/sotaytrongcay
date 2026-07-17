import { ListFilter, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type {
  FertilizerGroup,
  UserFertilizer,
} from "../models/user-fertilizer";
import { filterUserFertilizers } from "../models/filter-user-fertilizers";
import type { FertilizerUsage } from "../models/fertilizer-usage";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import {
  FERTILIZER_GROUP_ICONS,
  FERTILIZER_GROUPS,
} from "./fertilizer-group-visual";
import { FertilizerUsageLabel } from "./FertilizerUsageLabel";

type Props = Readonly<{
  fertilizers: readonly UserFertilizer[];
  onAdd: () => void;
  onBack: () => void;
  onOpen: (fertilizer: UserFertilizer) => void;
  onRetryUsage: () => void;
  usageLoadFailed: boolean;
  usages: Readonly<Record<string, FertilizerUsage>>;
}>;

export function FertilizerManagementScreen({
  fertilizers,
  onAdd,
  onBack,
  onOpen,
  onRetryUsage,
  usageLoadFailed,
  usages,
}: Props) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<FertilizerGroup | null>(null);
  const filtered = useMemo(
    () => filterUserFertilizers(fertilizers, search, group),
    [fertilizers, group, search],
  );
  return (
    <Screen title="">
      <TopBar onBack={onBack} title={t("fertilizers.management.title")} />
      <View style={styles.search}>
        <Search color={colors.textSecondary} size={20} />
        <TextInput
          accessibilityLabel={t("fertilizers.management.search")}
          onChangeText={setSearch}
          placeholder={t("fertilizers.management.search")}
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
          value={search}
        />
      </View>
      <View accessibilityRole="radiogroup" style={styles.filters}>
        <SelectableChip
          accessibilityLabel={t("fertilizers.management.filterAll")}
          icon={ListFilter}
          label={t("fertilizers.management.filterAll")}
          onPress={() => setGroup(null)}
          role="radio"
          selected={group === null}
        />
        {FERTILIZER_GROUPS.map((item) => (
          <SelectableChip
            accessibilityLabel={t("fertilizers.management.filterGroup", {
              group: t(`fertilizers.group.${item}`),
            })}
            icon={FERTILIZER_GROUP_ICONS[item]}
            key={item}
            label={t(`fertilizers.group.${item}`)}
            onPress={() => setGroup(item)}
            role="radio"
            selected={group === item}
          />
        ))}
      </View>
      {usageLoadFailed ? (
        <View style={styles.usageError}>
          <Typography color="textSecondary" variant="bodyMedium">
            {t("fertilizers.error.usageLoad")}
          </Typography>
          <PrimaryButton
            label={t("common.actions.retry")}
            onPress={onRetryUsage}
          />
        </View>
      ) : null}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Typography variant="headlineSmall">
            {search.trim() || group
              ? t("fertilizers.management.noMatch")
              : t("fertilizers.management.empty")}
          </Typography>
          <Typography color="textSecondary" variant="bodyLarge">
            {t("fertilizers.management.emptyDescription")}
          </Typography>
        </View>
      ) : (
        <View style={styles.list}>
          {filtered.map((fertilizer) => {
            const usage = usages[fertilizer.id];
            const GroupIcon = fertilizer.group
              ? FERTILIZER_GROUP_ICONS[fertilizer.group]
              : null;
            return (
              <Pressable
                accessibilityLabel={t("fertilizers.management.open", {
                  name: fertilizer.name,
                })}
                accessibilityRole="button"
                key={fertilizer.id}
                onPress={() => onOpen(fertilizer)}
              >
                <SurfaceCard style={styles.card}>
                  <Typography variant="bodyLarge">{fertilizer.name}</Typography>
                  {fertilizer.group && GroupIcon ? (
                    <View style={styles.group}>
                      <GroupIcon color={colors.textSecondary} size={16} />
                      <Typography color="textSecondary" variant="label">
                        {t(`fertilizers.group.${fertilizer.group}`)}
                      </Typography>
                    </View>
                  ) : null}
                  {usage ? <FertilizerUsageLabel usage={usage} /> : null}
                </SurfaceCard>
              </Pressable>
            );
          })}
        </View>
      )}
      <PrimaryButton label={t("fertilizers.management.add")} onPress={onAdd} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs, minHeight: 64 },
  empty: { gap: spacing.sm, paddingVertical: spacing.xl },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  group: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  list: { gap: spacing.sm },
  search: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: colors.text, flex: 1, fontSize: 16 },
  usageError: { gap: spacing.sm },
});
