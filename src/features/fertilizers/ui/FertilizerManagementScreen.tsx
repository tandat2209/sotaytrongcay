import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { FocusedFertilizerSuggestion } from "@/features/knowledge";
import type {
  FertilizerGroup,
  FertilizerSuggestionIdentity,
  UserFertilizer,
} from "../models/user-fertilizer";
import {
  filterAvailableFertilizerSuggestions,
  filterUserFertilizers,
} from "../models/filter-user-fertilizers";
import type { FertilizerUsage } from "../models/fertilizer-usage";
import { t } from "@/shared/i18n";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";
import { KnowledgeFertilizerSuggestions } from "./KnowledgeFertilizerSuggestions";
import { FertilizerManagementTopBar } from "./FertilizerManagementTopBar";
import { UserFertilizerCatalogSection } from "./UserFertilizerCatalogSection";

type Props = Readonly<{
  addSuggestionFailed: boolean;
  addingSuggestionId: string | null;
  fertilizers: readonly UserFertilizer[];
  fertilizerSuggestions: readonly FocusedFertilizerSuggestion[];
  onAdd: () => void;
  onAddSuggestion: (suggestion: FertilizerSuggestionIdentity) => void;
  onBack: () => void;
  onOpen: (fertilizer: UserFertilizer) => void;
  onRetryUsage: () => void;
  usageLoadFailed: boolean;
  usages: Readonly<Record<string, FertilizerUsage>>;
}>;

export function FertilizerManagementScreen({
  addSuggestionFailed,
  addingSuggestionId,
  fertilizers,
  fertilizerSuggestions,
  onAdd,
  onAddSuggestion,
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
  const availableSuggestions = useMemo(
    () =>
      filterAvailableFertilizerSuggestions(
        fertilizerSuggestions,
        fertilizers,
        search,
        group,
      ),
    [fertilizerSuggestions, fertilizers, group, search],
  );
  return (
    <Screen title="">
      <FertilizerManagementTopBar
        group={group}
        onBack={onBack}
        onGroupChange={setGroup}
        onSearchChange={setSearch}
        search={search}
      />
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
      <UserFertilizerCatalogSection
        filtered={Boolean(search.trim() || group)}
        fertilizers={filtered}
        onAdd={onAdd}
        onOpen={onOpen}
        usages={usages}
      />
      <KnowledgeFertilizerSuggestions
        addingId={addingSuggestionId}
        addFailed={addSuggestionFailed}
        onAdd={onAddSuggestion}
        suggestions={availableSuggestions}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  usageError: { gap: spacing.sm },
});
