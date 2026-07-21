import { Camera, Filter, NotebookPen, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import {
  getCareActivityLabel,
  getCareActivityOriginLabel,
  getWateringIntensityLabel,
} from "./care-activity-copy";
import { appLocale, formatDate, formatTime, t } from "@/shared/i18n";
import { EmptyState } from "@/shared/ui/EmptyState";
import { IconButton } from "@/shared/ui/IconButton";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { type CareActivity } from "../models/care-activity";
import { createJournalItems, type JournalItem } from "../models/journal-item";
import {
  emptyJournalCriteria,
  type JournalCriteria,
} from "../models/journal-query";
import type { PlantUpdate } from "../models/plant-update";
import { JournalFilterSheet, type JournalFilters } from "./JournalFilterSheet";
import type {
  PlantIdentityComponent,
  PlantIdentityViewProps,
} from "./plant-identity-types";

type PlantSummary = Omit<PlantIdentityViewProps, "size"> &
  Readonly<{ speciesId: string }>;
type Row =
  | Readonly<{ kind: "header"; label: string }>
  | Readonly<{ connectsToNext: boolean; kind: "item"; item: JournalItem }>;
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
  plantIdentityComponent: PlantIdentityComponent,
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
            <JournalRow
              {...(plants[row.item.record.plantId]
                ? { plant: plants[row.item.record.plantId] }
                : {})}
              {...(plantNames[row.item.record.plantId]
                ? { plantName: plantNames[row.item.record.plantId] }
                : {})}
              connectsToNext={row.connectsToNext}
              fertilizerNames={fertilizerNamesByActivity[row.item.id] ?? []}
              item={row.item}
              onOpenActivity={onOpenActivity}
              onOpenUpdate={onOpenUpdate}
              plantIdentityComponent={PlantIdentityComponent}
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

function JournalRow({
  connectsToNext,
  fertilizerNames,
  item,
  onOpenActivity,
  onOpenUpdate,
  plant,
  plantIdentityComponent: PlantIdentityComponent,
  plantName,
}: Readonly<{
  connectsToNext: boolean;
  fertilizerNames: readonly string[];
  item: JournalItem;
  onOpenActivity: (id: string) => void;
  onOpenUpdate: (id: string) => void;
  plant?: PlantSummary;
  plantIdentityComponent: PlantIdentityComponent;
  plantName?: string;
}>) {
  const name = plant?.name ?? plantName ?? t("common.fallback.plant");
  const occurredAt = formatTime(new Date(item.occurredAt));
  if (item.kind === "care") {
    const record = item.record;
    const visual = CARE_ACTIVITY_VISUALS[record.type];
    const ActivityIcon = visual.icon;
    return (
      <Pressable
        accessibilityLabel={`${getCareActivityLabel(record.type)} · ${name}`}
        accessibilityRole="button"
        onPress={() => onOpenActivity(item.id)}
        style={styles.row}
      >
        <View style={styles.timeline}>
          <View
            style={[
              styles.timelineIcon,
              { backgroundColor: visual.backgroundColor },
            ]}
          >
            <ActivityIcon color={visual.color} size={18} />
          </View>
          {connectsToNext ? <View style={styles.timelineLine} /> : null}
        </View>
        <SurfaceCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Typography variant="headlineSmall">
              {getCareActivityLabel(record.type)}
            </Typography>
            <Typography color="textSecondary" variant="label">
              {occurredAt}
            </Typography>
          </View>
          {plant ? (
            <PlantIdentityComponent
              imageUri={plant.imageUri}
              name={plant.name}
              size="list"
              speciesTitle={plant.speciesTitle}
              stageId={plant.stageId}
              stageTitle={plant.stageTitle}
            />
          ) : (
            <Typography color="primary" variant="bodyMedium">
              {name}
            </Typography>
          )}
          {record.type === "watering" && record.intensity ? (
            <Typography color="textSecondary" variant="bodyMedium">
              {getWateringIntensityLabel(record.intensity)}
            </Typography>
          ) : null}
          {record.type === "fertilizing" && fertilizerNames.length > 0 ? (
            <Typography
              color="textSecondary"
              numberOfLines={2}
              variant="bodyMedium"
            >
              {fertilizerNames.join(" · ")}
            </Typography>
          ) : null}
          {record.type === "spraying" && record.sprayTargetNameSnapshot ? (
            <Typography color="textSecondary" variant="bodyMedium">
              {record.sprayTargetNameSnapshot}
            </Typography>
          ) : null}
          {record.notes ? (
            <Typography
              color="textSecondary"
              numberOfLines={2}
              variant="bodyMedium"
            >
              {record.notes}
            </Typography>
          ) : null}
          <Typography color="textSecondary" variant="label">
            {getCareActivityOriginLabel(record.origin)}
          </Typography>
        </SurfaceCard>
      </Pressable>
    );
  }
  const record = item.record;
  const photoUri = record.photos
    .slice()
    .sort((left, right) => left.position - right.position)[0]?.localUri;
  const stageTitle = plant
    ? (getPreviewPlantKnowledge(plant.speciesId)?.stages.find(
        (stage) => stage.id === record.stageId,
      )?.title ?? t("common.fallback.unknown"))
    : t("common.fallback.unknown");
  const summary =
    record.notes ??
    t("journal.list.photoSummary", { count: record.photos.length });
  return (
    <Pressable
      accessibilityLabel={`${t("journal.filter.update")} · ${name}`}
      accessibilityRole="button"
      onPress={() => onOpenUpdate(item.id)}
      style={styles.row}
    >
      <View style={styles.timeline}>
        <View style={styles.timelineIcon}>
          <Camera color={colors.primary} size={18} />
        </View>
        {connectsToNext ? <View style={styles.timelineLine} /> : null}
      </View>
      <SurfaceCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Typography
            numberOfLines={2}
            style={styles.updateSummary}
            variant="headlineSmall"
          >
            {summary}
          </Typography>
          <Typography color="textSecondary" variant="label">
            {occurredAt}
          </Typography>
        </View>
        <View style={styles.updateIdentity}>
          {plant ? (
            <PlantIdentityComponent
              imageUri={photoUri ?? plant.imageUri}
              name={plant.name}
              size="list"
              speciesTitle={plant.speciesTitle}
              stageId={record.stageId}
              stageTitle={stageTitle}
            />
          ) : (
            <Typography color="primary" variant="bodyMedium">
              {name}
            </Typography>
          )}
          {photoUri ? (
            <Image
              accessibilityLabel={t("journal.photo.updateImageAccessibility")}
              source={{ uri: photoUri }}
              style={styles.photo}
            />
          ) : null}
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

function createRows(items: readonly JournalItem[]): readonly Row[] {
  let lastDate = "";
  return items.flatMap((item, index) => {
    const label = formatDateHeading(item.occurredAt);
    const rows: Row[] = label === lastDate ? [] : [{ kind: "header", label }];
    lastDate = label;
    rows.push({
      connectsToNext:
        formatDateHeading(items[index + 1]?.occurredAt ?? "") === label,
      kind: "item",
      item,
    });
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
  card: { flex: 1, gap: spacing.sm, minWidth: 0 },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
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
  dateHeading: { paddingTop: spacing.sm, textTransform: "uppercase" },
  headerActions: { alignItems: "center", flexDirection: "row" },
  journalList: { flex: 1 },
  list: { gap: spacing.base, paddingBottom: 96, paddingTop: spacing.base },
  photo: { borderRadius: radius.chip, height: 64, width: 64 },
  photoOnly: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  row: { flexDirection: "row", gap: spacing.sm },
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
  timeline: { alignItems: "center", alignSelf: "stretch", width: 56 },
  timelineIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    justifyContent: "center",
    marginTop: spacing.base,
    width: 40,
    zIndex: 1,
  },
  timelineLine: {
    backgroundColor: colors.border,
    bottom: -spacing.lg,
    position: "absolute",
    top: spacing.base + 40,
    width: StyleSheet.hairlineWidth,
  },
  updateIdentity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  updateSummary: { flex: 1 },
});
