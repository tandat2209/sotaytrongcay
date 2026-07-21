import { ChevronRight, FileText, NotebookPen } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";

import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
  getWateringIntensityLabel,
  type JournalItem,
  type PlantUpdate,
} from "@/features/journal";
import { formatDateTime, formatNumber, t } from "@/shared/i18n";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  items: readonly JournalItem[];
  onOpenActivity: (id: string) => void;
  onOpenUpdate: (id: string) => void;
}>;

export function PlantDetailRecentJournal({
  items,
  onOpenActivity,
  onOpenUpdate,
}: Props) {
  return (
    <View style={styles.section}>
      <SectionHeader
        icon={NotebookPen}
        title={t("plants.recentJournal.title")}
      />
      {items.length ? (
        <View style={styles.list}>
          {items.map((item, index) => (
            <View key={`${item.kind}:${item.id}`}>
              {index > 0 ? <View style={styles.divider} /> : null}
              {item.kind === "care" ? (
                <CareRow
                  activity={item.record}
                  onPress={() => onOpenActivity(item.id)}
                />
              ) : (
                <UpdateRow
                  onPress={() => onOpenUpdate(item.id)}
                  update={item.record}
                />
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.list, styles.empty]}>
          <Typography color="textSecondary" variant="secondary">
            {t("plants.recentJournal.empty")}
          </Typography>
        </View>
      )}
    </View>
  );
}

function CareRow({
  activity,
  onPress,
}: Readonly<{
  activity: Extract<JournalItem, { kind: "care" }>["record"];
  onPress: () => void;
}>) {
  const label = getCareActivityLabel(activity.type);
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  const ActivityIcon = visual.icon;
  const occurredAt = formatDateTime(new Date(activity.occurredAt));
  const context =
    activity.type === "watering" && activity.intensity
      ? getWateringIntensityLabel(activity.intensity)
      : activity.type === "spraying" && activity.sprayTargetNameSnapshot
        ? activity.sprayTargetNameSnapshot
        : null;

  return (
    <Pressable
      accessibilityLabel={t("plants.recentJournal.open", {
        label: label.toLowerCase(),
        time: occurredAt,
      })}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        accessibilityElementsHidden
        style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
      >
        <ActivityIcon color={visual.color} size={21} />
      </View>
      <View style={styles.copy}>
        <Typography variant="bodyStrong">{label}</Typography>
        {context ? (
          <Typography color="textSecondary" variant="secondary">
            {context}
          </Typography>
        ) : null}
        <Typography color="textSecondary" variant="secondary">
          {occurredAt}
        </Typography>
      </View>
      <ChevronRight color={colors.textMuted} size={18} />
    </Pressable>
  );
}

function UpdateRow({
  onPress,
  update,
}: Readonly<{ onPress: () => void; update: PlantUpdate }>) {
  const photoUri = update.photos
    .slice()
    .sort((left, right) => left.position - right.position)[0]?.localUri;
  const occurredAt = formatDateTime(new Date(update.occurredAt));
  return (
    <Pressable
      accessibilityLabel={t("journal.update.openAccessibility", {
        time: occurredAt,
      })}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {photoUri ? (
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: photoUri }}
          style={styles.thumbnail}
        />
      ) : (
        <View
          accessibilityElementsHidden
          style={[styles.icon, styles.updateIcon]}
        >
          <FileText color={colors.primary} size={21} />
        </View>
      )}
      <View style={styles.copy}>
        <Typography variant="bodyStrong">
          {t("journal.filter.update")}
        </Typography>
        <Typography color="textSecondary" numberOfLines={1} variant="secondary">
          {update.notes ??
            t("plants.recentJournal.photoCount", {
              count: formatNumber(update.photos.length),
            })}
        </Typography>
        <Typography color="textSecondary" variant="secondary">
          {occurredAt}
        </Typography>
      </View>
      <ChevronRight color={colors.textMuted} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  copy: { flex: 1, gap: spacing.xs, minWidth: 0 },
  divider: {
    backgroundColor: colors.divider,
    height: StyleSheet.hairlineWidth,
    marginLeft: 44 + spacing.base,
  },
  empty: {
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.base,
  },
  icon: {
    alignItems: "center",
    borderRadius: radius.small,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: "hidden",
    paddingHorizontal: spacing.base,
  },
  pressed: { opacity: 0.68 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 76,
    paddingVertical: spacing.sm,
  },
  section: { gap: spacing.base },
  thumbnail: { borderRadius: radius.small, height: 44, width: 44 },
  updateIcon: { backgroundColor: colors.primarySoft },
});
