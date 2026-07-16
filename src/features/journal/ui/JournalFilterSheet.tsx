import { Check, ListFilter } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { getCareActivityLabel } from "@/features/journal";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type {
  JournalDateRange,
  JournalRecordFilter,
} from "../models/journal-query";

export type { JournalDateRange, JournalRecordFilter };

export type JournalFilters = Readonly<{
  dateRange: JournalDateRange;
  plantId: string | null;
  recordFilter: JournalRecordFilter;
}>;

type PlantOption = Readonly<{ id: string; name: string }>;
type Props = Readonly<{
  filters: JournalFilters;
  onApply: (filters: JournalFilters) => void;
  onDismiss: () => void;
  plants: readonly PlantOption[];
  visible: boolean;
}>;

const recordOptions: readonly Readonly<{
  label: string;
  value: JournalRecordFilter;
}>[] = [
  { label: t("journal.filter.allRecords"), value: "all" },
  { label: t("journal.filter.update"), value: "update" },
  { label: getCareActivityLabel("watering"), value: "watering" },
  { label: getCareActivityLabel("fertilizing"), value: "fertilizing" },
  { label: getCareActivityLabel("spraying"), value: "spraying" },
];

const dateOptions: readonly Readonly<{
  label: string;
  value: JournalDateRange;
}>[] = [
  { label: t("journal.filter.allDates"), value: "all" },
  { label: t("journal.filter.today"), value: "today" },
  { label: t("journal.filter.week"), value: "week" },
];

export function JournalFilterSheet({
  filters,
  onApply,
  onDismiss,
  plants,
  visible,
}: Props) {
  const [draft, setDraft] = useState(filters);
  const close = () => {
    setDraft(filters);
    onDismiss();
  };
  const apply = () => {
    onApply(draft);
    onDismiss();
  };
  return (
    <BottomSheet
      footer={
        <PrimaryButton label={t("common.actions.apply")} onPress={apply} />
      }
      onDismiss={close}
      title={
        <View style={styles.title}>
          <ListFilter color={colors.primary} size={20} />
          <Typography variant="headlineSmall">
            {t("journal.filter.title")}
          </Typography>
        </View>
      }
      visible={visible}
    >
      <FilterGroup label={t("journal.filter.recordType")}>
        {recordOptions.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            onPress={() =>
              setDraft((value) => ({ ...value, recordFilter: option.value }))
            }
            selected={draft.recordFilter === option.value}
          />
        ))}
      </FilterGroup>
      <FilterGroup label={t("journal.filter.plant")}>
        <FilterOption
          label={t("journal.filter.allPlants")}
          onPress={() => setDraft((value) => ({ ...value, plantId: null }))}
          selected={draft.plantId === null}
        />
        {plants.map((plant) => (
          <FilterOption
            key={plant.id}
            label={plant.name}
            onPress={() =>
              setDraft((value) => ({ ...value, plantId: plant.id }))
            }
            selected={draft.plantId === plant.id}
          />
        ))}
      </FilterGroup>
      <FilterGroup label={t("journal.filter.date")}>
        {dateOptions.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            onPress={() =>
              setDraft((value) => ({ ...value, dateRange: option.value }))
            }
            selected={draft.dateRange === option.value}
          />
        ))}
      </FilterGroup>
      <Pressable
        accessibilityLabel={t("journal.filter.clear")}
        accessibilityRole="button"
        onPress={() =>
          setDraft({ dateRange: "all", plantId: null, recordFilter: "all" })
        }
        style={styles.clear}
      >
        <Typography color="primary" variant="bodyLarge">
          {t("journal.filter.clear")}
        </Typography>
      </Pressable>
    </BottomSheet>
  );
}

function FilterGroup({
  children,
  label,
}: Readonly<{ children: ReactNode; label: string }>) {
  return (
    <View style={styles.group}>
      <Typography variant="headlineSmall">{label}</Typography>
      <View style={styles.options}>{children}</View>
    </View>
  );
}

function FilterOption({
  label,
  onPress,
  selected,
}: Readonly<{ label: string; onPress: () => void; selected: boolean }>) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.option, selected && styles.selected]}
    >
      <Typography color={selected ? "surface" : "text"} variant="bodyLarge">
        {label}
      </Typography>
      {selected ? <Check color={colors.surface} size={20} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  clear: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  group: { gap: spacing.sm },
  option: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  options: { gap: spacing.sm },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  title: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
