import { Filter, NotebookPen, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { appLocale, formatDate, t } from "@/shared/i18n";
import { EmptyState } from "@/shared/ui/EmptyState";
import { IconButton } from "@/shared/ui/IconButton";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { type CareActivity } from "../models/care-activity";
import { createJournalItems, type JournalItem } from "../models/journal-item";
import {
  emptyJournalCriteria,
  type JournalCriteria,
} from "../models/journal-query";
import type { PlantUpdate } from "../models/plant-update";
import { JournalFilterSheet, type JournalFilters } from "./JournalFilterSheet";
import { JournalEntryRow, type JournalPlantSummary } from "./JournalEntryRow";
import type {
  PlantIdentityComponent,
  PlantIdentityViewProps,
} from "./plant-identity-types";

type PlantSummary = Omit<PlantIdentityViewProps, "size"> & JournalPlantSummary;
type Row =
  | Readonly<{ kind: "header"; label: string }>
  | Readonly<{ kind: "item"; item: JournalItem }>;
type Props = Readonly<{
  activities?: readonly CareActivity[];
  criteria?: JournalCriteria;
  fertilizerNamesByActivity?: Readonly<Record<string, readonly string[]>>;
  hasAnyEntries?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  loadMoreError?: boolean;
  onCriteriaChange?: (criteria: JournalCriteria) => void;
  onLoadMore?: () => void;
  onOpenActivity?: (id: string) => void;
  onOpenUpdate?: (id: string) => void;
  onRetryLoadMore?: () => void;
  plantIdentityComponent: PlantIdentityComponent;
  plantNames?: Readonly<Record<string, string>>;
  plants?: Readonly<Record<string, PlantSummary>>;
  updates?: readonly PlantUpdate[];
}>;

export function JournalScreen({
  activities = [],
  criteria = emptyJournalCriteria,
  fertilizerNamesByActivity = {},
  hasAnyEntries: hasAnyEntriesInput,
  hasMore = false,
  isLoadingMore = false,
  loadMoreError = false,
  onCriteriaChange = () => undefined,
  onLoadMore = () => undefined,
  onOpenActivity = () => undefined,
  onOpenUpdate = () => undefined,
  onRetryLoadMore = () => undefined,
  plantNames = {},
  plants = {},
  updates = [],
}: Props) {
  const hasAnyEntries =
    hasAnyEntriesInput ?? (activities.length > 0 || updates.length > 0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const rows = useMemo(
    () => createRows(createJournalItems(activities, updates)),
    [activities, updates],
  );
  const filters: JournalFilters = {
    dateRange: criteria.dateRange,
    plantId: criteria.plantId,
    recordFilter: criteria.recordFilter,
  };
  const hasFilters =
    filters.dateRange !== "all" ||
    filters.plantId !== null ||
    filters.recordFilter !== "all";
  const plantOptions = useMemo(
    () =>
      Object.entries(plants)
        .map(([id, plant]) => ({ id, name: plant.name }))
        .sort((left, right) => left.name.localeCompare(right.name, appLocale)),
    [plants],
  );

  return (
    <Screen
      contentGap={spacing.base}
      headerAction={
        <View style={styles.headerActions}>
          <IconButton
            accessibilityLabel={t("journal.list.search")}
            icon={Search}
            onPress={() => setSearchVisible((visible) => !visible)}
          />
          <IconButton
            accessibilityLabel={t("journal.filter.open")}
            icon={Filter}
            onPress={() => setShowFilters(true)}
          />
        </View>
      }
      scrollable={false}
      title={t("journal.list.title")}
      titleIcon={NotebookPen}
    >
      {searchVisible ? (
        <View style={styles.search}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            accessibilityLabel={t("journal.list.search")}
            autoCorrect
            autoFocus
            onChangeText={(query) => onCriteriaChange({ ...criteria, query })}
            placeholder={t("journal.list.search")}
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            value={criteria.query}
          />
          <IconButton
            accessibilityLabel={t("common.actions.close")}
            icon={X}
            onPress={() => {
              onCriteriaChange({ ...criteria, query: "" });
              setSearchVisible(false);
            }}
          />
        </View>
      ) : null}
      {hasFilters ? (
        <Pressable
          accessibilityLabel={t("journal.filter.openActive")}
          accessibilityRole="button"
          onPress={() => setShowFilters(true)}
          style={styles.activeFilter}
        >
          <Filter color={colors.surface} size={16} />
          <Typography color="surface" variant="label">
            {t("journal.filter.active")}
          </Typography>
        </Pressable>
      ) : null}
      <FlatList
        contentContainerStyle={styles.list}
        data={rows}
        keyExtractor={(row, index) =>
          row.kind === "header"
            ? `${row.label}-${index}`
            : `${row.item.kind}:${row.item.id}`
        }
        ListEmptyComponent={
          hasAnyEntries ? (
            <EmptyState
              description={t("journal.list.noMatchDescription")}
              icon={Search}
              title={t("journal.list.noMatchTitle")}
            />
          ) : (
            <EmptyState
              description={t("journal.list.emptyDescription")}
              icon={NotebookPen}
              title={t("journal.list.emptyTitle")}
            />
          )
        }
        ListFooterComponent={
          loadMoreError ? (
            <PrimaryButton
              label={t("common.actions.retry")}
              onPress={onRetryLoadMore}
            />
          ) : isLoadingMore ? (
            <ActivityIndicator color={colors.primary} />
          ) : null
        }
        onEndReached={() => {
          if (hasMore && !isLoadingMore) onLoadMore();
        }}
        onEndReachedThreshold={0.4}
        renderItem={({ item: row }) =>
          row.kind === "header" ? (
            <Typography
              color="textSecondary"
              style={styles.dateHeading}
              variant="label"
            >
              {row.label}
            </Typography>
          ) : (
            <JournalEntryRow
              {...(plants[row.item.record.plantId]
                ? { plant: plants[row.item.record.plantId] }
                : {})}
              {...(plantNames[row.item.record.plantId]
                ? { plantName: plantNames[row.item.record.plantId] }
                : {})}
              fertilizerNames={fertilizerNamesByActivity[row.item.id] ?? []}
              item={row.item}
              onOpenActivity={onOpenActivity}
              onOpenUpdate={onOpenUpdate}
            />
          )
        }
        style={styles.journalList}
      />
      <JournalFilterSheet
        filters={filters}
        onApply={(nextFilters) =>
          onCriteriaChange({ ...criteria, ...nextFilters })
        }
        onDismiss={() => setShowFilters(false)}
        plants={plantOptions}
        visible={showFilters}
      />
    </Screen>
  );
}

function createRows(items: readonly JournalItem[]): readonly Row[] {
  let lastDate = "";
  return items.flatMap((item) => {
    const label = formatDateHeading(item.occurredAt);
    const rows: Row[] = label === lastDate ? [] : [{ kind: "header", label }];
    lastDate = label;
    rows.push({ kind: "item", item });
    return rows;
  });
}

function formatDateHeading(occurredAt: string) {
  if (!occurredAt) return "";
  const date = new Date(occurredAt);
  const now = new Date();
  const day = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  if (day === today) return t("journal.filter.today");
  if (day === today - 24 * 60 * 60 * 1000) return t("journal.list.yesterday");
  return formatDate(date);
}

const styles = StyleSheet.create({
  activeFilter: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 32,
    paddingHorizontal: spacing.sm,
  },
  dateHeading: {
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: spacing.sm,
    paddingTop: spacing.lg,
  },
  headerActions: { alignItems: "center", flexDirection: "row" },
  journalList: { flex: 1 },
  list: { paddingBottom: 96 },
  search: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingLeft: spacing.base,
    marginTop: spacing.base,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
  },
});
